export const enum SpecConfig {
    A = '5ms',
    B = '50ms',
    C = '100ms'
}

export interface SpecData {
    specName: SpecConfig
}

export interface EnvConf {
    staging: SpecData,
    production: SpecData
}
export interface DescribeRoutineCodeRevisionRequest {
    name: string,
    selectCodeRevision: string
}
export interface DescribeRoutineRequest {
    name: string
}

export interface CreateRoutineRequest {
    name: string,
    description?: string,
    envConf?: EnvConf
}

export interface UploadRoutineCodeRequest {
    name: string,
    codeDescription?: string
}

export interface PublishRoutineCodeRevisionRequest {
    name: string,
    selectCodeRevision: string, // 要发布的边缘程序版本
    envs: string[] // ["Production","Preset_Canary_Zhejiang"]
}

export interface CommitStagingRoutineCodeRequest {
    name: string, // 名称
    codeDescription?: string //代码版本描述
}

export interface DeleteRoutineCodeRevisionRequest {
    name: string,
    selectCodeRevision: string
}




export const enum ErrorInfo {
    LIMIT_PUB_NUMBER = 'A server error occurred: you got upper limit of code revisions'
}

export interface ErDetail {
    CodeDescription: string, //代码描述
    CreateTime: string, //创建时间
    ErCode: string, //具体代码
}
export interface ErCreate {
    Status: string
}



export interface AccessData {
    AccessKeyID?: string,
    AccessKeySecret?: string,
}

export interface EnvConfData {
    staging: string,
    production: string
}

export interface FullErInputData {
    erName: string,
    erDescription?: string,
    envs: string[],
    code: string, //代码地址
    envConf?: EnvConfData
}

export interface StandedPublishData {
    erName: string,
    erDescription: string,
    envs: string[],
    code: string, //代码地址
}