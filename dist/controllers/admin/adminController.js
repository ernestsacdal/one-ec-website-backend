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
const Mailer_1 = __importDefault(require("../../utils/Mailer"));
const AppResponse_1 = __importDefault(require("../../utils/AppResponse"));
const authAction_1 = __importDefault(require("../../actions/admin/authAction"));
const adminForgotPassword_1 = __importDefault(require("../../actions/admin/adminForgotPassword"));
const validationSchemas_1 = require("../../utils/validationSchemas");
const adminChangePassword_1 = __importDefault(require("../../actions/admin/adminChangePassword"));
const mailer = new Mailer_1.default();
class AdminController {
    auth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    email: req.body.email,
                    password: req.body.password,
                };
                const validation = authAction_1.default.validate(data);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Error : ${validation.error.errors}`,
                        code: 400,
                    });
                }
                const admin = yield authAction_1.default.execute(data);
                if (admin) {
                    yield authAction_1.default.logActivity(admin, 'Logged in');
                    const token = yield authAction_1.default.generateToken(data);
                    return AppResponse_1.default.sendSuccess({
                        res: res,
                        data: {
                            token,
                        },
                        message: "Authentication successful",
                        code: 200,
                    });
                }
            }
            catch (error) {
                if (error.message == "Invalid Login Credentials") {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: error.message,
                        code: 401,
                    });
                }
                else if (error.message.includes("Too many login attempts")) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: error.message,
                        code: 429
                    });
                }
                else {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Internal server error : ${error.message}`,
                        code: 500,
                    });
                }
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.adminData;
                if (!admin) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Admin not found",
                        code: 404
                    });
                }
                yield authAction_1.default.logActivity(admin, 'Logged out');
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: null,
                    message: "Logout successful",
                    code: 200
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Internal server error : ${error.message}`,
                    code: 500
                });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validation = validationSchemas_1.requestResetSchema.safeParse(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation Error: ${validation.error.errors.map(err => err.message).join(", ")}`,
                        code: 400,
                    });
                }
                const { email } = validation.data;
                yield adminForgotPassword_1.default.requestReset(email);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: null,
                    message: "Password reset link sent successfully",
                    code: 200,
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Error: ${error.message}`,
                    code: 400,
                });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validation = validationSchemas_1.resetPasswordSchema.safeParse(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation Error: ${validation.error.errors.map(err => err.message).join(", ")}`,
                        code: 400,
                    });
                }
                const { token, newPassword } = validation.data;
                yield adminForgotPassword_1.default.resetPassword(token, newPassword);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: null,
                    message: "Password reset successfully",
                    code: 200,
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Error: ${error.message}`,
                    code: 400,
                });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.adminData.id;
                const { currentPassword, newPassword, confirmPassword } = req.body;
                const validation = validationSchemas_1.passwordChangeSchema.safeParse({ currentPassword, newPassword, confirmPassword });
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation Error: ${validation.error.errors.map(err => err.message).join(", ")}`,
                        code: 400,
                    });
                }
                yield adminChangePassword_1.default.changePassword(adminId, currentPassword, newPassword);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: null,
                    message: "Password changed successfully",
                    code: 200,
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: error.message,
                    code: 400
                });
            }
        });
    }
}
exports.default = AdminController;
//# sourceMappingURL=adminController.js.map