"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dcdn20180115_1 = __importStar(require("@alicloud/dcdn20180115")), dcdnClient = dcdn20180115_1;
var $OpenApi = __importStar(require("@alicloud/openapi-client"));
var $Util = __importStar(require("@alicloud/tea-util"));
var lodash_get_1 = __importDefault(require("lodash.get"));
var logger_1 = __importDefault(require("./common/logger"));
function responseHandler(response) {
    if (response.statusCode === 200) {
        return response.body;
    }
    else {
        logger_1.default.console.error('bad server');
        return null;
    }
}
var Client = /** @class */ (function () {
    function Client(ak, sk) {
        this.requestClient = this.createClient(ak, sk);
        this.defaultRuntimeOptions = new $Util.RuntimeOptions({});
    }
    Client.prototype.createClient = function (accessKeyId, accessKeySecret) {
        if (!this.requestClient) {
            var config = new $OpenApi.Config({
                accessKeyId: accessKeyId,
                accessKeySecret: accessKeySecret,
            });
            // 访问的域名
            config.endpoint = "dcdn.aliyuncs.com";
            this.requestClient = new dcdn20180115_1.default(config);
        }
        return this.requestClient;
    };
    /**
     * 创建ER
     * @param data
     */
    Client.prototype.CreateRoutine = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var createRoutineRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createRoutineRequest = new dcdnClient.CreateRoutineRequest(data);
                        return [4 /*yield*/, this.requestClient.createRoutineWithOptions(createRoutineRequest, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content')];
                }
            });
        });
    };
    Client.prototype.EditRoutineConf = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var createRoutineRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createRoutineRequest = new dcdnClient.EditRoutineConfRequest(data);
                        return [4 /*yield*/, this.requestClient.editRoutineConfWithOptions(createRoutineRequest, this.defaultRuntimeOptions)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.DeleteRoutine = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var requestData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestData = new dcdnClient.DeleteRoutineRequest({ name: name });
                        return [4 /*yield*/, this.requestClient.deleteRoutineWithOptions(requestData, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response))];
                }
            });
        });
    };
    Client.prototype.DeleteRoutineCodeRevision = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var requestData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestData = new dcdnClient.DeleteRoutineCodeRevisionRequest(data);
                        return [4 /*yield*/, this.requestClient.deleteRoutineCodeRevisionWithOptions(requestData, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content.OssPostConfig')];
                }
            });
        });
    };
    Client.prototype.UploadRoutineCode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var createRoutineRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createRoutineRequest = new dcdnClient.UploadRoutineCodeRequest(data);
                        return [4 /*yield*/, this.requestClient.uploadRoutineCodeWithOptions(createRoutineRequest, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content.OssPostConfig')];
                }
            });
        });
    };
    Client.prototype.UploadStagingRoutineCode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var createRoutineRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createRoutineRequest = new dcdnClient.UploadStagingRoutineCodeRequest(data);
                        return [4 /*yield*/, this.requestClient.uploadStagingRoutineCodeWithOptions(createRoutineRequest, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content.OssPostConfig')];
                }
            });
        });
    };
    Client.prototype.DescribeUserErStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestData = new dcdnClient.DescribeUserErStatusRequest({});
                        return [4 /*yield*/, this.requestClient.describeUserErStatusWithOptions(requestData, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response))];
                }
            });
        });
    };
    /**
     * 指定测试环境到正式版本
     * @param data
     * @returns  正式版本编号
     */
    Client.prototype.CommitStagingRoutineCode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var createRoutineRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createRoutineRequest = new dcdnClient.CommitStagingRoutineCodeRequest(data);
                        return [4 /*yield*/, this.requestClient.commitStagingRoutineCodeWithOptions(createRoutineRequest, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content.CodeRevision')];
                }
            });
        });
    };
    /**
     * 发布指定版本的边缘程序ER代码到某个Env环境
     * @param data
     * @returns 指定的版本号
     */
    Client.prototype.PublishRoutineCodeRevision = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var createRoutineRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createRoutineRequest = new dcdnClient.PublishRoutineCodeRevisionRequest(data);
                        return [4 /*yield*/, this.requestClient.publishRoutineCodeRevisionWithOptions(createRoutineRequest, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content.CodeRevision')];
                }
            });
        });
    };
    Client.prototype.DescribeDcdnErUsageData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestOption, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestOption = new dcdnClient.DescribeDcdnErUsageDataRequest({});
                        return [4 /*yield*/, this.requestClient.describeDcdnErUsageData(requestOption)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'erAccData.erAccItem')];
                }
            });
        });
    };
    /**
     * 获取某个边缘程序ER（EdgeRoutine）的元信息，包括每个环境的ER配置，配置版本，代码版本等信息
     * @param name  er name
     * @returns
     */
    Client.prototype.DescribeRoutine = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var requestOption, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestOption = new dcdnClient.DescribeRoutineRequest({ name: name });
                        return [4 /*yield*/, this.requestClient.describeRoutineWithOptions(requestOption, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content')];
                }
            });
        });
    };
    /**
     * 获取边缘程序ER的某个版本的JS代码
     * @param data  {name,selectCodeRevision} name:er名，selectCodeRevision: 版本
     * @returns
     */
    Client.prototype.DescribeRoutineCodeRevision = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var requestOption, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestOption = new dcdnClient.DescribeRoutineCodeRevisionRequest(data);
                        return [4 /*yield*/, this.requestClient.describeRoutineCodeRevisionWithOptions(requestOption, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content')];
                }
            });
        });
    };
    Client.prototype.DescribeRoutineSpec = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestOption, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestOption = new dcdnClient.DescribeRoutineCodeRevisionRequest({});
                        return [4 /*yield*/, this.requestClient.describeRoutineSpecWithOptions(requestOption)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content.Specs')];
                }
            });
        });
    };
    Client.prototype.DescribeRoutineUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestOption, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestOption = new dcdnClient.DescribeRoutineUserInfoRequest({});
                        return [4 /*yield*/, this.requestClient.describeRoutineUserInfoWithOptions(requestOption, this.defaultRuntimeOptions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, lodash_get_1.default)(responseHandler(response), 'content')];
                }
            });
        });
    };
    return Client;
}());
exports.default = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsa0dBQW1FO0FBQ25FLGlFQUFxRDtBQUNyRCx3REFBNEM7QUFDNUMsMERBQTZCO0FBQzdCLDJEQUFxQztBQUVyQyxTQUFTLGVBQWUsQ0FBQyxRQUFRO0lBQzdCLElBQUksUUFBUSxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUU7UUFDN0IsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO0tBQ3hCO1NBQU07UUFDSCxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkMsT0FBTyxJQUFJLENBQUM7S0FDZjtBQUNMLENBQUM7QUFDRDtJQUdJLGdCQUFZLEVBQVUsRUFBRSxFQUFVO1FBQzlCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBR08sNkJBQVksR0FBcEIsVUFBcUIsV0FBbUIsRUFBRSxlQUF1QjtRQUM3RCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNyQixJQUFJLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzdCLFdBQVcsYUFBQTtnQkFDWCxlQUFlLGlCQUFBO2FBQ2xCLENBQUMsQ0FBQztZQUNILFFBQVE7WUFDUixNQUFNLENBQUMsUUFBUSxHQUFHLG1CQUFtQixDQUFDO1lBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsT0FBTyxJ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