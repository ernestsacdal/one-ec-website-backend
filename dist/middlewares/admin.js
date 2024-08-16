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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppResponse_1 = __importDefault(require("../utils/AppResponse"));
const token_1 = __importDefault(require("../utils/token"));
const adminShowAction_1 = __importDefault(require("../actions/admin/adminShowAction"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AdminMiddleware {
    static authToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];
            if (!token) {
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: "Unauthorized",
                    code: 403,
                });
            }
            try {
                const decodedToken = token_1.default.validate(token);
                const adminId = decodedToken.id;
                if (!adminId) {
                    return AppResponse_1.default.sendError({
                        res,
                        code: 401,
                        message: "Invalid token: Admin ID not found",
                        data: null,
                    });
                }
                const adminData = yield adminShowAction_1.default.execute(adminId);
                if (!adminData) {
                    return AppResponse_1.default.sendError({
                        res,
                        code: 404,
                        message: "Admin not found",
                        data: null,
                    });
                }
                req.adminData = adminData;
                next();
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Token expired",
                        code: 401,
                    });
                }
                if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Token invalid",
                        code: 401,
                    });
                }
                console.log(error);
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: "Internal server error",
                    code: 500,
                });
            }
        });
    }
}
exports.default = AdminMiddleware;
//# sourceMappingURL=admin.js.map