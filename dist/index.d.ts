import { InputProps } from './common/entity';
export default class DCDN {
    private dcdnClient;
    private createClient;
    private checkErExist;
    private checkForceUpdate;
    private checkProductionEnv;
    private getCurrentCodeByName;
    private publishLocalFileToEdgeRoutine;
    /**
     * 查看er 列表
     * @param inputs
     * @returns
     */
    list(inputs: InputProps): Promise<any>;
    /**
     * 获取指定环境 er 代码
     * @param inputs
     * @returns
     */
    get(inputs: InputProps): Promise<ErResponse.ErDetail>;
    /**
     * 删除er应用程序
     * @param inputs
     * @returns
     */
    delete(inputs: InputProps): Promise<any>;
    /**
     * er部署
     * @param inputs
     * @returns
     */
    deploy(inputs: InputProps): Promise<any>;
}
