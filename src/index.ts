import path from 'path';
import fs from 'fs';
import axios from 'axios';
import get from 'lodash.get';
import inquirer from 'inquirer';
import logger from './common/logger';
import { InputProps } from './common/entity';
import DcdnClient from './client';
import { ErDetail, StandedPublishData, AccessData, ErrorInfo, SpecConfig, FullErInputData } from './@types';
function decodeBase64(data: string) {
  return Buffer.from(data, 'base64').toString('ascii');
}

function encodeBase64(data: string) {
  return Buffer.from(data).toString('base64')
}

function transToAbsolutePath(_path) {
  try {
    _path = path.join(process.cwd(), _path);
  } catch (e) {
  }
  return _path
}

export default class DCDN {
  private dcdnClient: DcdnClient;
  private createClient(AccessKeyID: string, AccessKeySecret: string): DcdnClient {
    if (!this.dcdnClient) {
      this.dcdnClient = new DcdnClient(AccessKeyID, AccessKeySecret);
    }
    return this.dcdnClient;
  }

  private async checkErExist(client: DcdnClient, name: string) {
    let result: any = {};
    try {
      result = await client.DescribeRoutine(name);
    } catch (e) {

    }
    return result.EnvConf;
  }
  private checkForceUpdate(args) {
    const FORCE_UPDATE_REG = /(^\-f$|^\-\-force$)?/gi;
    return (args.filter((key) => {
      return FORCE_UPDATE_REG.test(key);
    })).length > 0;
  }

  private async checkProductionEnv(env: string[]) {
    return env.includes('production');
  }


  private async getCurrentCodeByName(client: DcdnClient, name: string) {
    const result = await client.DescribeRoutine(name);
    const cr = get(result, 'EnvConf.production.CodeRev');
    if (!cr) {
      return '';
    }
    const erInfo: ErDetail = await client.DescribeRoutineCodeRevision({ name, selectCodeRevision: cr });
    erInfo.CodeDescription = decodeBase64(erInfo.CodeDescription);
    erInfo.ErCode = decodeBase64(erInfo.ErCode);
    return erInfo.ErCode;
  }

  private async publishLocalFileToEdgeRoutine(data: StandedPublishData & AccessData, forceUpdate = false) {
    let { code, erName, envs } = data;
    let erDescription = envs.join('_') + '_' + Date.now().toString();
    let finalResult = '';
    let createResult;
    const isProduction = this.checkProductionEnv(envs);
    const client = this.createClient(data.AccessKeyID, data.AccessKeySecret);
    code = transToAbsolutePath(code);
    const localCode = path.isAbsolute(code) ? fs.readFileSync(code, { encoding: 'utf-8' }) : code;
    logger.info(`begin to upload local file to edgeroutine named 【${erName}】 and environment is 【${JSON.stringify(envs)}】,please wait a moment`);
    if (!isProduction) {
      createResult = await client.UploadStagingRoutineCode({ name: erName, codeDescription: erDescription });
    } else {
      const remoteCode = await this.getCurrentCodeByName(client, erName);
      if (remoteCode === '') {
        createResult = await client.UploadStagingRoutineCode({ name: erName, codeDescription: erDescription });
      } else if (localCode === remoteCode) {
        logger.info(`there is no need to upload local code`);
      } else if (forceUpdate) {
        createResult = await client.UploadStagingRoutineCode({ name: erName, codeDescription: erDescription });
      } else if (localCode !== remoteCode) {
        const qa = await inquirer.prompt([{ type: 'confirm', name: 'useLocal', message: '本地代码有更新，是否选择本地' }]);
        const useLocal = qa.useLocal;
        if (useLocal) {
          createResult = await client.UploadStagingRoutineCode({ name: erName, codeDescription: erDescription });
        }
      }
    }
    if (createResult) {
      const { OSSAccessKeyId, Signature, callback, Url, key, policy, } = createResult;
      try {
        const data = await axios.postForm(Url, {
          OSSAccessKeyId,
          'x:codedescription': encodeBase64(erDescription),
          policy,
          Signature,
          key,
          callback,
          file: localCode
        });
        const stateCode = get(data, 'data.code');
        if (stateCode === 200) {
          logger.info(`file upload success,begin to commit staging routine code`);
          const codeRevision = await client.CommitStagingRoutineCode({ name: erName, codeDescription: erDescription });
          logger.info(`the curent code revision is 【${codeRevision}】, now we will begin to publish it!`);
          finalResult = await client.PublishRoutineCodeRevision({
            name: erName,
            selectCodeRevision: codeRevision,
            envs
          });
          logger.info(`congratulations you have done all this work`);
        } else {
          logger.info(`file upload failed,please retry`);
        }
      } catch (e) {
        const message = get(e, 'Message');
        if (message === ErrorInfo.LIMIT_PUB_NUMBER) {
          const deleteAndRetry = async () => {
            const result = await client.DescribeRoutine(erName);
            let codeRevs = get(result, 'CodeRevs', []);
            codeRevs = codeRevs.sort((item1, item2) => {
              const codeV1 = parseInt(item1.CodeRevision);
              const codeV2 = parseInt(item2.CodeRevision);
              return codeV1 - codeV2;
            });
            const oldestCodeRevision = get(codeRevs, '[0].CodeRevision');
            await client.DeleteRoutineCodeRevision({ name: erName, selectCodeRevision: oldestCodeRevision });//移除指定版本    
            return await this.publishLocalFileToEdgeRoutine(data, true);
          }
          if (forceUpdate) {
            return await deleteAndRetry();
          } else {
            const qa = await inquirer.prompt([{ type: 'confirm', name: 'deleteLatestOne', message: '您发布版本已达上限，是否删除最旧版本，重新发布' }]);
            const deleteLatestOne = qa.deleteLatestOne;
            if (deleteLatestOne) {
              return await deleteAndRetry();
            }
          }
        }
      }
    }

    return finalResult;
  }

  /**
   * 查看er 列表
   * @param inputs 
   * @returns 
   */
  public async list(inputs: InputProps) {
    const { AccessKeyID, AccessKeySecret } = inputs.credentials;
    const client = this.createClient(AccessKeyID, AccessKeySecret);
    const [name] = inputs.argsObj;
    const result = await client.DescribeRoutine(name);
    return result;
  }

  /**
   * 获取指定环境 er 代码
   * @param inputs 
   * @returns 
   */
  public async get(inputs: InputProps) {
    const { AccessKeyID, AccessKeySecret } = inputs.credentials;
    const client = this.createClient(AccessKeyID, AccessKeySecret);
    const [name, selectCodeRevision] = inputs.argsObj;
    const result: ErDetail = await client.DescribeRoutineCodeRevision({ name, selectCodeRevision });
    result.CodeDescription = decodeBase64(result.CodeDescription);
    result.ErCode = decodeBase64(result.ErCode);
    return result;
  }

  /**
   * 删除er应用程序
   * @param inputs 
   * @returns 
   */
  public async delete(inputs: InputProps) {
    const [name, args] = inputs.argsObj;
    const { AccessKeyID, AccessKeySecret } = inputs.credentials;
    const client = this.createClient(AccessKeyID, AccessKeySecret);
    async function removeEr(name: string) {
      const result = await client.DeleteRoutine(name);
      return result;
    }
    try {
      if (name) {
        if (args && (args !== '-f' && args !== '--force')) {
          return await removeEr(name);
        } else {
          const result = await inquirer.prompt([{ type: 'confirm', name: 'isDelete', message: `确定删除${name}吗` }]);
          const { isDelete } = result;
          if (isDelete) {
            return await removeEr(name);
          }
        }
      }
    } catch (e) {
      const message = get(e, 'Message');
      throw new Error(message);
    }
  }

  /**
   * er部署
   * @param inputs 
   * @returns 
   */
  public async deploy(inputs: InputProps) {
    const { AccessKeyID, AccessKeySecret } = inputs.credentials;
    const client = this.createClient(AccessKeyID, AccessKeySecret);
    const data: FullErInputData = inputs.props;
    const isForceUpdate = this.checkForceUpdate(inputs.argsObj)
    const { erName, erDescription, envConf, envs = [], code } = data;
    try {
      const erExist = await this.checkErExist(client, erName);
      if (!erExist) {  // 检查er是否存在
        await client.CreateRoutine({
          name: erName, description: erDescription, envConf: {
            staging: {
              specName: get(envConf, 'staging', SpecConfig.B)
            },
            production: {
              specName: get(envConf, 'production', SpecConfig.C)
            }
          }
        });
      }
      const requestData = Object.assign({}, { erName, erDescription, code, envs }, { AccessKeyID, AccessKeySecret })
      return await this.publishLocalFileToEdgeRoutine(requestData, isForceUpdate);
    } catch (e) {
      throw new Error(e.Message);
    }
  }

}
