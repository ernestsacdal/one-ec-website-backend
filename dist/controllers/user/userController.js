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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppResponse_1 = __importDefault(require("../../utils/AppResponse"));
const validationSchemas_1 = require("../../utils/validationSchemas");
const client_1 = __importDefault(require("../../utils/client"));
const userCreateAction_1 = __importDefault(require("../../actions/user/userCreateAction"));
const userLoginAction_1 = __importDefault(require("../../actions/user/userLoginAction"));
const userRegistrationAction_1 = __importDefault(require("../../actions/user/userRegistrationAction"));
const client_2 = require("@prisma/client");
const userForgotPasswordAction_1 = __importDefault(require("../../actions/user/userForgotPasswordAction"));
const userUpdateAction_1 = __importDefault(require("../../actions/user/userUpdateAction"));
const UserShowAction_1 = __importDefault(require("../../actions/user/UserShowAction"));
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.coorData.coop_id;
                const userValidation = validationSchemas_1.userDataSchema.safeParse(req.body.userData);
                if (!userValidation.success) {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: `User Validation error: ${userValidation.error.errors.map(e => e.message).join(", ")}`,
                        code: 400
                    });
                }
                const meterValidation = validationSchemas_1.meterDataSchema.safeParse(req.body.meterData);
                if (!meterValidation.success) {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: `Meter Validation error: ${meterValidation.error.errors.map(e => e.message).join(", ")}`,
                        code: 400
                    });
                }
                const userData = yield client_1.default.user.findUnique({
                    where: { email: req.body.userData.email }
                });
                if (userData) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Email already exists",
                        code: 400
                    });
                }
                const { user, meterAccount, accountRegistry } = yield userCreateAction_1.default.execute(req.body.userData, req.body.meterData, id);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: { user, meterAccount, accountRegistry },
                    message: "Customer created successfully",
                    code: 201
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Internal server error ${error.message}`,
                    code: 500
                });
            }
        });
    }
    auth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ip = req.ip || '0.0.0.0';
                const data = {
                    email: req.body.email,
                    password: req.body.password,
                };
                const validation = userLoginAction_1.default.validate(data);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Error : ${validation.error.errors}`,
                        code: 400,
                    });
                }
                const userId = yield client_1.default.user.findFirst({
                    where: {
                        email: validation.data.email,
                        deleted_at: null
                    }
                });
                if (!userId) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "User not found",
                        code: 400,
                    });
                }
                const user = yield userLoginAction_1.default.execute(data, ip, userId.id);
                const token = yield userLoginAction_1.default.generateToken(data);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: {
                        token,
                    },
                    message: "Authentication successful",
                    code: 200,
                });
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
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const validation = validationSchemas_1.userSchema.safeParse(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                        code: 400
                    });
                }
                const _f = validation.data, { password } = _f, userData = __rest(_f, ["password"]);
                const normalizedUserData = Object.assign(Object.assign({}, userData), { middle_name: (_a = userData.middle_name) !== null && _a !== void 0 ? _a : null, birthdate: (_b = userData.birthdate) !== null && _b !== void 0 ? _b : null, contact_number: (_c = userData.contact_number) !== null && _c !== void 0 ? _c : null, gender: (_d = userData.gender) !== null && _d !== void 0 ? _d : null, address: (_e = userData.address) !== null && _e !== void 0 ? _e : null, role: client_2.UserRole.USER });
                const existingUser = yield client_1.default.user.findUnique({
                    where: {
                        email: validation.data.email
                    }
                });
                if (existingUser) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Email already exists",
                        code: 400
                    });
                }
                const user = yield userRegistrationAction_1.default.execute(normalizedUserData, password);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: user,
                    message: "User registered successfully",
                    code: 201
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Internal server error: ${error.message}`,
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
                yield userForgotPasswordAction_1.default.requestReset(email);
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
                yield userForgotPasswordAction_1.default.resetPassword(token, newPassword);
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
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const validation = userUpdateAction_1.default.validate(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                        code: 400,
                    });
                }
                const roleShow = yield UserShowAction_1.default.execute(parseInt(id));
                if (!roleShow) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "User not found",
                        code: 404,
                    });
                }
                const role = yield userUpdateAction_1.default.execute(parseInt(id), req.body);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: role,
                    message: "User updated successfully",
                    code: 200,
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Internal server error ${error.message}`,
                    code: 500,
                });
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=userController.js.map