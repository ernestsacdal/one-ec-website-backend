"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const AppResponse_1 = __importDefault(require("../utils/AppResponse"));
const api_key = config_1.default.key.x_key;
const apiKeyAuth = (req, res, next) => {
    const apiKeyHeader = req.headers['x-api-key'];
    if (apiKeyHeader && apiKeyHeader === api_key) {
        next();
    }
    else {
        return AppResponse_1.default.sendError({
            res: res,
            data: null,
            message: "Forbidden Access",
            code: 403
        });
    }
};
exports.default = apiKeyAuth;
//# sourceMappingURL=apiKey.js.map