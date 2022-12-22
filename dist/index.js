"use strict";
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
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var axios_1 = __importDefault(require("axios"));
var lodash_get_1 = __importDefault(require("lodash.get"));
var inquirer_1 = __importDefault(require("inquirer"));
var logger_1 = __importDefault(require("./common/logger"));
var client_1 = __importDefault(require("./client"));
function decodeBase64(data) {
    return Buffer.from(data, 'base64').toString('ascii');
}
function encodeBase64(data) {
    return Buffer.from(data).toString('base64');
}
function transToAbsolutePath(_path) {
    try {
        _path = path_1.default.join(process.cwd(), _path);
    }
    catch (e) {
    }
    return _path;
}
var DCDN = /** @class */ (function () {
    function DCDN() {
    }
    DCDN.prototype.createClient = function (AccessKeyID, AccessKeySecret) {
        if (!this.dcdnClient) {
            this.dcdnClient = new client_1.default(AccessKeyID, AccessKeySecret);
        }
        return this.dcdnClient;
    };
    DCDN.prototype.checkErExist = function (client, name) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client.DescribeRoutine(name)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, result.EnvConf];
                }
            });
        });
    };
    DCDN.prototype.checkForceUpdate = function (args) {
        var FORCE_UPDATE_REG = /(^\-f$|^\-\-force$)?/gi;
        return (args.filter(function (key) {
            return FORCE_UPDATE_REG.test(key);
        })).length > 0;
    };
    DCDN.prototype.checkProductionEnv = function (env) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, env.includes('production')];
            });
        });
    };
    DCDN.prototype.getCurrentCodeByName = function (client, name) {
        return __awaiter(this, void 0, void 0, function () {
            var result, cr, erInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.DescribeRoutine(name)];
                    case 1:
                        result = _a.sent();
                        cr = (0, lodash_get_1.default)(result, 'EnvConf.production.CodeRev');
                        if (!cr) {
                            return [2 /*return*/, ''];
                        }
                        return [4 /*yield*/, client.DescribeRoutineCodeRevision({ name: name, selectCodeRevision: cr })];
                    case 2:
                        erInfo = _a.sent();
                        erInfo.CodeDescription = decodeBase64(erInfo.CodeDescription);
                        erInfo.ErCode = decodeBase64(erInfo.ErCode);
                        return [2 /*return*/, erInfo.ErCode];
                }
            });
        });
    };
    DCDN.prototype.publishLocalFileToEdgeRoutine = function (data, forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        return __awaiter(this, void 0, void 0, function () {
            var code, erName, envs, erDescription, finalResult, createResult, isProduction, client, localCode, remoteCode, qa, useLocal, OSSAccessKeyId, Signature, callback, Url, key, policy, data_1, stateCode, codeRevision, e_2, message, deleteAndRetry, qa, deleteLatestOne;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = data.code, erName = data.erName, envs = data.envs;
                        erDescription = envs.join('_') + '_' + Date.now().toString();
                        finalResult = '';
                        isProduction = this.checkProductionEnv(envs);
                        client = this.createClient(data.AccessKeyID, data.AccessKeySecret);
                        code = transToAbsolutePath(code);
                        localCode = path_1.default.isAbsolute(code) ? fs_1.default.readFileSync(code, { encoding: 'utf-8' }) : code;
                        logger_1.default.info("begin to upload local file to edgeroutine named \u3010".concat(erName, "\u3011 and environment is \u3010").concat(JSON.stringify(envs), "\u3011,please wait a moment"));
                        if (!!isProduction) return [3 /*break*/, 2];
                        return [4 /*yield*/, client.UploadStagingRoutineCode({ name: erName, codeDescription: erDescription })];
                    case 1:
                        createResult = _a.sent();
                        return [3 /*break*/, 11];
                    case 2: return [4 /*yield*/, this.getCurrentCodeByName(client, erName)];
                    case 3:
                        remoteCode = _a.sent();
                        if (!(remoteCode === '')) return [3 /*break*/, 5];
                        return [4 /*yield*/, client.UploadStagingRoutineCode({ name: erName, codeDescription: erDescription })];
                    case 4:
                        createResult = _a.sent();
                        return [3 /*break*/, 11];
                    case 5:
                        if (!(localCode === remoteCode)) return [3 /*break*/, 6];
                        logger_1.default.info("there is no need to upload local code");
                        return [3 /*break*/, 11];
                    case 6:
                        if (!forceUpdate) return [3 /*break*/, 8];
                        return [4 /*yield*/, client.UploadStagingRoutineCode({ name: erName, codeDescription: erDescription })];
                    case 7:
                        createResult = _a.sent();
                        return [3 /*break*/, 11];
                    case 8:
                        if (!(localCode !== remoteCode)) return [3 /*break*/, 11];
                        return [4 /*yield*/, inquirer_1.default.prompt([{ type: 'confirm', name: 'useLocal', message: '本地代码有更新，是否选择本地' }])];
                    case 9:
                        qa = _a.sent();
                        useLocal = qa.useLocal;
                        if (!useLocal) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.UploadStagingRoutineCode({ name: erName, codeDescription: erDescription })];
                    case 10:
                        createResult = _a.sent();
                        _a.label = 11;
                    case 11:
                        if (!createResult) return [3 /*break*/, 24];
                        OSSAccessKeyId = createResult.OSSAccessKeyId, Signature = createResult.Signature, callback = createResult.callback, Url = createResult.Url, key = createResult.key, policy = createResult.policy;
                        _a.label = 12;
                    case 12:
                        _a.trys.push([12, 18, , 24]);
                        return [4 /*yield*/, axios_1.default.postForm(Url, {
                                OSSAccessKeyId: OSSAccessKeyId,
                                'x:codedescription': encodeBase64(erDescription),
                                policy: policy,
                                Signature: Signature,
                                key: key,
                                callback: callback,
                                file: localCode
                            })];
                    case 13:
                        data_1 = _a.sent();
                        stateCode = (0, lodash_get_1.default)(data_1, 'data.code');
                        if (!(stateCode === 200)) return [3 /*break*/, 16];
                        logger_1.default.info("file upload success,begin to commit staging routine code");
                        return [4 /*yield*/, client.CommitStagingRoutineCode({ name: erName, codeDescription: erDescription })];
                    case 14:
                        codeRevision = _a.sent();
                        logger_1.default.info("the curent code revision is \u3010".concat(codeRevision, "\u3011, now we will begin to publish it!"));
                        return [4 /*yield*/, client.PublishRoutineCodeRevision({
                                name: erName,
                                selectCodeRevision: codeRevision,
                                envs: envs
                            })];
                    case 15:
                        finalResult = _a.sent();
                        logger_1.default.info("congratulations you have done all this work");
                        return [3 /*break*/, 17];
                    case 16:
                        logger_1.default.info("file upload failed,please retry");
                        _a.label = 17;
                    case 17: return [3 /*break*/, 24];
                    case 18:
                        e_2 = _a.sent();
                        message = (0, lodash_get_1.default)(e_2, 'data.Message');
                        if (!(message === "A server error occurred: you got upper limit of code revisions" /* ErResponse.ErrorInfo.LIMIT_PUB_NUMBER */)) return [3 /*break*/, 23];
                        deleteAndRetry = function () { return __awaiter(_this, void 0, void 0, function () {
                            var result, codeRevs, oldestCodeRevision;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client.DescribeRoutine(erName)];
                                    case 1:
                                        result = _a.sent();
                                        codeRevs = (0, lodash_get_1.default)(result, 'CodeRevs', []);
                                        codeRevs = codeRevs.sort(function (item1, item2) {
                                            var codeV1 = parseInt(item1.CodeRevision);
                                            var codeV2 = parseInt(item2.CodeRevision);
                                            return codeV1 - codeV2;
                                        });
                                        oldestCodeRevision = (0, lodash_get_1.default)(codeRevs, '[0].CodeRevision');
                                        return [4 /*yield*/, client.DeleteRoutineCodeRevision({ name: erName, selectCodeRevision: oldestCodeRevision })];
                                    case 2:
                                        _a.sent(); //移除指定版本    
                                        return [4 /*yield*/, this.publishLocalFileToEdgeRoutine(data, true)];
                                    case 3: //移除指定版本    
                                    return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        if (!forceUpdate) return [3 /*break*/, 20];
                        return [4 /*yield*/, deleteAndRetry()];
                    case 19: return [2 /*return*/, _a.sent()];
                    case 20: return [4 /*yield*/, inquirer_1.default.prompt([{ type: 'confirm', name: 'deleteLatestOne', message: '您发布版本已达上限，是否删除最旧版本，重新发布' }])];
                    case 21:
                        qa = _a.sent();
                        deleteLatestOne = qa.deleteLatestOne;
                        if (!deleteLatestOne) return [3 /*break*/, 23];
                        return [4 /*yield*/, deleteAndRetry()];
                    case 22: return [2 /*return*/, _a.sent()];
                    case 23: return [3 /*break*/, 24];
                    case 24: return [2 /*return*/, finalResult];
                }
            });
        });
    };
    /**
     * 查看er 列表
     * @param inputs
     * @returns
     */
    DCDN.prototype.list = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, AccessKeyID, AccessKeySecret, client, name, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = inputs.credentials, AccessKeyID = _a.AccessKeyID, AccessKeySecret = _a.AccessKeySecret;
                        client = this.createClient(AccessKeyID, AccessKeySecret);
                        name = inputs.argsObj[0];
                        return [4 /*yield*/, client.DescribeRoutine(name)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * 获取指定环境 er 代码
     * @param inputs
     * @returns
     */
    DCDN.prototype.get = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, AccessKeyID, AccessKeySecret, client, _b, name, selectCodeRevision, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = inputs.credentials, AccessKeyID = _a.AccessKeyID, AccessKeySecret = _a.AccessKeySecret;
                        client = this.createClient(AccessKeyID, AccessKeySecret);
                        _b = inputs.argsObj, name = _b[0], selectCodeRevision = _b[1];
                        return [4 /*yield*/, client.DescribeRoutineCodeRevision({ name: name, selectCodeRevision: selectCodeRevision })];
                    case 1:
                        result = _c.sent();
                        result.CodeDescription = decodeBase64(result.CodeDescription);
                        result.ErCode = decodeBase64(result.ErCode);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * 删除er应用程序
     * @param inputs
     * @returns
     */
    DCDN.prototype.delete = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            function removeEr(name) {
                return __awaiter(this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client.DeleteRoutine(name)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            }
            var _a, name, args, _b, AccessKeyID, AccessKeySecret, client, result, isDelete, e_3, message;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = inputs.argsObj, name = _a[0], args = _a[1];
                        _b = inputs.credentials, AccessKeyID = _b.AccessKeyID, AccessKeySecret = _b.AccessKeySecret;
                        client = this.createClient(AccessKeyID, AccessKeySecret);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        if (!name) return [3 /*break*/, 6];
                        if (!(args && (args !== '-f' && args !== '--force'))) return [3 /*break*/, 3];
                        return [4 /*yield*/, removeEr(name)];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3: return [4 /*yield*/, inquirer_1.default.prompt([{ type: 'confirm', name: 'isDelete', message: "\u786E\u5B9A\u5220\u9664".concat(name, "\u5417") }])];
                    case 4:
                        result = _c.sent();
                        isDelete = result.isDelete;
                        if (!isDelete) return [3 /*break*/, 6];
                        return [4 /*yield*/, removeEr(name)];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_3 = _c.sent();
                        message = (0, lodash_get_1.default)(e_3, 'data.Message');
                        throw new Error(message);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * er部署
     * @param inputs
     * @returns
     */
    DCDN.prototype.deploy = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, AccessKeyID, AccessKeySecret, client, data, isForceUpdate, erName, erDescription, envConf, _b, envs, code, erExist, requestData, e_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = inputs.credentials, AccessKeyID = _a.AccessKeyID, AccessKeySecret = _a.AccessKeySecret;
                        client = this.createClient(AccessKeyID, AccessKeySecret);
                        data = inputs.props;
                        isForceUpdate = this.checkForceUpdate(inputs.argsObj);
                        erName = data.erName, erDescription = data.erDescription, envConf = data.envConf, _b = data.envs, envs = _b === void 0 ? [] : _b, code = data.code;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.checkErExist(client, erName)];
                    case 2:
                        erExist = _c.sent();
                        if (!!erExist) return [3 /*break*/, 4];
                        return [4 /*yield*/, client.CreateRoutine({
                                name: erName, description: erDescription, envConf: {
                                    staging: {
                                        specName: (0, lodash_get_1.default)(envConf, 'staging', "50ms" /* ErRequest.SpecConfig.B */)
                                    },
                                    production: {
                                        specName: (0, lodash_get_1.default)(envConf, 'production', "100ms" /* ErRequest.SpecConfig.C */)
                                    }
                                }
                            })];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        requestData = Object.assign({}, { erName: erName, erDescription: erDescription, code: code, envs: envs }, { AccessKeyID: AccessKeyID, AccessKeySecret: AccessKeySecret });
                        return [4 /*yield*/, this.publishLocalFileToEdgeRoutine(requestData, isForceUpdate)];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6:
                        e_4 = _c.sent();
                        throw new Error(e_4.data.Message);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return DCDN;
}());
exports.default = DCDN;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBd0I7QUFDeEIsMENBQW9CO0FBQ3BCLGdEQUEwQjtBQUMxQiwwREFBNkI7QUFDN0Isc0RBQWdDO0FBQ2hDLDJEQUFxQztBQUVyQyxvREFBa0M7QUFFbEMsU0FBUyxZQUFZLENBQUMsSUFBWTtJQUNoQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsSUFBWTtJQUNoQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdDLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLEtBQUs7SUFDaEMsSUFBSTtRQUNGLEtBQUssR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN6QztJQUFDLE9BQU8sQ0FBQyxFQUFFO0tBQ1g7SUFDRCxPQUFPLEtBQUssQ0FBQTtBQUNkLENBQUM7QUFFRDtJQUFBO0lBME5BLENBQUM7SUF4TlMsMkJBQVksR0FBcEIsVUFBcUIsV0FBbUIsRUFBRSxlQUF1QjtRQUMvRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7U0FDaEU7UUFDRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVhLDJCQUFZLEdBQTFCLFVBQTJCLE1BQWtCLEVBQUUsSUFBWTs7Ozs7O3dCQUNyRCxNQUFNLEdB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