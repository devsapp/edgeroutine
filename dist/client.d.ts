export default class Client {
    private requestClient;
    private defaultRuntimeOptions;
    constructor(ak: string, sk: string);
    private createClient;
    /**
     * 创建ER
     * @param data
     */
    CreateRoutine(data: ErRequest.CreateRoutineRequest): Promise<ErResponse.ErCreate>;
    EditRoutineConf(data: ErRequest.CreateRoutineRequest): Promise<void>;
    DeleteRoutine(name: string): Promise<any>;
    DeleteRoutineCodeRevision(data: ErRequest.DeleteRoutineCodeRevisionRequest): Promise<any>;
    UploadRoutineCode(data: ErRequest.UploadRoutineCodeRequest): Promise<any>;
    UploadStagingRoutineCode(data: ErRequest.UploadRoutineCodeRequest): Promise<any>;
    DescribeUserErStatus(): Promise<any>;
    /**
     * 指定测试环境到正式版本
     * @param data
     * @returns  正式版本编号
     */
    CommitStagingRoutineCode(data: ErRequest.CommitStagingRoutineCodeRequest): Promise<string>;
    /**
     * 发布指定版本的边缘程序ER代码到某个Env环境
     * @param data
     * @returns 指定的版本号
     */
    PublishRoutineCodeRevision(data: ErRequest.PublishRoutineCodeRevisionRequest): Promise<string>;
    DescribeDcdnErUsageData(): Promise<any>;
    /**
     * 获取某个边缘程序ER（EdgeRoutine）的元信息，包括每个环境的ER配置，配置版本，代码版本等信息
     * @param name  er name
     * @returns
     */
    DescribeRoutine(name: string): Promise<any>;
    /**
     * 获取边缘程序ER的某个版本的JS代码
     * @param data  {name,selectCodeRevision} name:er名，selectCodeRevision: 版本
     * @returns
     */
    DescribeRoutineCodeRevision(data: ErRequest.DescribeRoutineCodeRevisionRequest): Promise<ErResponse.ErDetail>;
    DescribeRoutineSpec(): Promise<any>;
    DescribeRoutineUserInfo(): Promise<any>;
}
