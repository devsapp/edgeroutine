declare namespace ErRequest {
    const enum SpecConfig {
        A = '5ms',
        B = '50ms',
        C = '100ms'
    }

    interface SpecData {
        specName: SpecConfig
    }

    interface EnvConf {
        staging: SpecData,
        production: SpecData
    }
    interface DescribeRoutineCodeRevisionRequest {
        name: string,
        selectCodeRevision: string
    }
    interface DescribeRoutineRequest {
        name: string
    }

    interface CreateRoutineRequest {
        name: string,
        description?: string,
        envConf?: EnvConf
    }

    interface UploadRoutineCodeRequest {
        name: string,
        codeDescription?: string
    }

    interface PublishRoutineCodeRevisionRequest {
        name: string,
        selectCodeRevision: string, // 要发布的边缘程序版本
        envs: string[] // ["Production","Preset_Canary_Zhejiang"]
    }

    interface CommitStagingRoutineCodeRequest {
        name: string, // 名称
        codeDescription?: string //代码版本描述
    }

    interface DeleteRoutineCodeRevisionRequest {
        name: string,
        selectCodeRevision: string
    }
}

declare namespace ErResponse {
    const enum ErrorInfo {
        LIMIT_PUB_NUMBER = 'A server error occurred: you got upper limit of code revisions'
    }

    interface ErDetail {
        CodeDescription: string, //代码描述
        CreateTime: string, //创建时间
        ErCode: string, //具体代码
    }
    interface ErCreate {
        Status: string
    }
}

declare namespace ErData {
    interface AccessData {
        AccessKeyID?: string,
        AccessKeySecret?: string,
    }

    interface EnvConfData {
        staging: string,
        production: string
    }

    interface FullErInputData {
        erName: string,
        erDescription?: string,
        envs: string[],
        code: string, //代码地址
        envConf?: EnvConfData
    }

    interface StandedPublishData {
        erName: string,
        erDescription: string,
        envs: string[],
        code: string, //代码地址
    }
}


