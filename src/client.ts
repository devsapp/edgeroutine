

import dcdn20180115, * as dcdnClient from '@alicloud/dcdn20180115';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';
import get from 'lodash.get';
import logger from './common/logger';

function responseHandler(response) {
    if (response.statusCode === 200) {
        return response.body;
    } else {
        logger.console.error('bad server');
        return null;
    }
}
export default class Client {
    private requestClient: dcdn20180115;
    private defaultRuntimeOptions;
    constructor(ak: string, sk: string) {
        this.requestClient = this.createClient(ak, sk);
        this.defaultRuntimeOptions = new $Util.RuntimeOptions({});
    }


    private createClient(accessKeyId: string, accessKeySecret: string): dcdn20180115 {
        if (!this.requestClient) {
            let config = new $OpenApi.Config({
                accessKeyId,
                accessKeySecret,
            });
            // 访问的域名
            config.endpoint = `dcdn.aliyuncs.com`;
            this.requestClient = new dcdn20180115(config);
        }
        return this.requestClient;
    }

    /**
     * 创建ER
     * @param data 
     */
    public async CreateRoutine(data: ErRequest.CreateRoutineRequest): Promise<ErResponse.ErCreate> {
        const createRoutineRequest = new dcdnClient.CreateRoutineRequest(data);
        const response = await this.requestClient.createRoutineWithOptions(createRoutineRequest, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content');
    }


    public async EditRoutineConf(data: ErRequest.CreateRoutineRequest) {
        const createRoutineRequest = new dcdnClient.EditRoutineConfRequest(data);
        await this.requestClient.editRoutineConfWithOptions(createRoutineRequest, this.defaultRuntimeOptions);
    }

    public async DeleteRoutine(name: string) {
        const requestData = new dcdnClient.DeleteRoutineRequest({ name });
        const response = await this.requestClient.deleteRoutineWithOptions(requestData, this.defaultRuntimeOptions);
        return get(responseHandler(response));
    }

    public async DeleteRoutineCodeRevision(data: ErRequest.DeleteRoutineCodeRevisionRequest) {
        const requestData = new dcdnClient.DeleteRoutineCodeRevisionRequest(data);
        const response = await this.requestClient.deleteRoutineCodeRevisionWithOptions(requestData, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content.OssPostConfig');
    }

    public async UploadRoutineCode(data: ErRequest.UploadRoutineCodeRequest) {
        const createRoutineRequest = new dcdnClient.UploadRoutineCodeRequest(data);
        const response = await this.requestClient.uploadRoutineCodeWithOptions(createRoutineRequest, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content.OssPostConfig');
    }

    public async UploadStagingRoutineCode(data: ErRequest.UploadRoutineCodeRequest) {
        const createRoutineRequest = new dcdnClient.UploadStagingRoutineCodeRequest(data);
        const response = await this.requestClient.uploadStagingRoutineCodeWithOptions(createRoutineRequest, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content.OssPostConfig');
    }

    public async DescribeUserErStatus() {
        const requestData = new dcdnClient.DescribeUserErStatusRequest({});
        const response = await this.requestClient.describeUserErStatusWithOptions(requestData, this.defaultRuntimeOptions);
        return get(responseHandler(response));
    }
    /**
     * 指定测试环境到正式版本
     * @param data 
     * @returns  正式版本编号
     */
    public async CommitStagingRoutineCode(data: ErRequest.CommitStagingRoutineCodeRequest): Promise<string> {
        const createRoutineRequest = new dcdnClient.CommitStagingRoutineCodeRequest(data);
        const response = await this.requestClient.commitStagingRoutineCodeWithOptions(createRoutineRequest, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content.CodeRevision');
    }

    /**
     * 发布指定版本的边缘程序ER代码到某个Env环境
     * @param data 
     * @returns 指定的版本号
     */
    public async PublishRoutineCodeRevision(data: ErRequest.PublishRoutineCodeRevisionRequest): Promise<string> {
        const createRoutineRequest = new dcdnClient.PublishRoutineCodeRevisionRequest(data);
        const response = await this.requestClient.publishRoutineCodeRevisionWithOptions(createRoutineRequest, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content.CodeRevision');
    }

    public async DescribeDcdnErUsageData() {
        const requestOption = new dcdnClient.DescribeDcdnErUsageDataRequest({});
        const response = await this.requestClient.describeDcdnErUsageData(requestOption);
        return get(responseHandler(response), 'erAccData.erAccItem');
    }
    /**
     * 获取某个边缘程序ER（EdgeRoutine）的元信息，包括每个环境的ER配置，配置版本，代码版本等信息
     * @param name  er name
     * @returns 
     */
    public async DescribeRoutine(name: string) {
        const requestOption = new dcdnClient.DescribeRoutineRequest({ name });
        const response = await this.requestClient.describeRoutineWithOptions(requestOption, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content');
    }
    /**
     * 获取边缘程序ER的某个版本的JS代码
     * @param data  {name,selectCodeRevision} name:er名，selectCodeRevision: 版本
     * @returns 
     */
    public async DescribeRoutineCodeRevision(data: ErRequest.DescribeRoutineCodeRevisionRequest): Promise<ErResponse.ErDetail> {
        const requestOption = new dcdnClient.DescribeRoutineCodeRevisionRequest(data);
        const response = await this.requestClient.describeRoutineCodeRevisionWithOptions(requestOption, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content');
    }

    public async DescribeRoutineSpec() {
        const requestOption = new dcdnClient.DescribeRoutineCodeRevisionRequest({});
        const response = await this.requestClient.describeRoutineSpecWithOptions(requestOption, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content.Specs');;
    }

    public async DescribeRoutineUserInfo() {
        const requestOption = new dcdnClient.DescribeRoutineUserInfoRequest({});
        const response = await this.requestClient.describeRoutineUserInfoWithOptions(requestOption, this.defaultRuntimeOptions);
        return get(responseHandler(response), 'content');;
    }
}