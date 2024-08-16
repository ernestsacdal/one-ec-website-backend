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
const AppResponse_1 = __importDefault(require("../../utils/AppResponse"));
const authAction_1 = __importDefault(require("../../actions/coor/authAction"));
const coorForgotPassword_1 = __importDefault(require("../../actions/coor/coorForgotPassword"));
const coorChangePassword_1 = __importDefault(require("../../actions/coor/coorChangePassword"));
const validationSchemas_1 = require("../../utils/validationSchemas");
const client_1 = __importDefault(require("../../utils/client"));
const coorCreateAction_1 = __importDefault(require("../../actions/coor/coorCreateAction"));
const coorUpdateAction_1 = __importDefault(require("../../actions/coor/coorUpdateAction"));
const coorListPaginationAction_1 = __importDefault(require("../../actions/coor/coorListPaginationAction"));
const coorDeleteAction_1 = __importDefault(require("../../actions/coor/coorDeleteAction"));
const coorShowAction_1 = __importDefault(require("../../actions/coor/coorShowAction"));
const coorListPerCoopAction_1 = __importDefault(require("../../actions/coor/coorListPerCoopAction"));
const coorSearch_1 = __importDefault(require("../../actions/coor/coorSearch"));
const roleCoordinatorShowAction_1 = __importDefault(require("../../actions/role/roleCoordinatorShowAction"));
class CoorController {
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
                    const role = yield roleCoordinatorShowAction_1.default.execute(admin.id);
                    return AppResponse_1.default.sendSuccess({
                        res: res,
                        data: {
                            token,
                            role
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
                const coor = req.coorData;
                if (!coor) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Coordinator not found",
                        code: 404
                    });
                }
                yield authAction_1.default.logActivity(coor, 'Logged out');
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
                yield coorForgotPassword_1.default.requestReset(email);
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
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coorId = req.coorData.id;
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
                yield coorChangePassword_1.default.changePassword(coorId, currentPassword, newPassword);
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
                yield coorForgotPassword_1.default.resetPassword(token, newPassword);
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
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validation = validationSchemas_1.createCoordinatorSchema.safeParse(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map(e => e.message).join(", ")}`,
                        code: 400
                    });
                }
                const { data, roleIds } = req.body;
                const coopId = req.coorData.coop_id;
                const roles = yield client_1.default.role.findMany({
                    where: {
                        id: { in: roleIds },
                        deletedAt: null
                    }
                });
                if (roles.length !== roleIds.length) {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: 'Some roles not found or are deleted',
                        code: 404
                    });
                }
                const existingCoordinator = yield client_1.default.coopCoordinator.findUnique({
                    where: { email: data.email }
                });
                if (existingCoordinator) {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: "Email already exists",
                        code: 400
                    });
                }
                const { coordinator } = yield coorCreateAction_1.default.execute(data, roleIds, coopId);
                return AppResponse_1.default.sendSuccess({
                    res,
                    data: { coordinator },
                    message: "Coordinator created successfully",
                    code: 201
                });
            }
            catch (error) {
                console.log('Error:', error);
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Internal server error ${error.message}`,
                    code: 500
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coordinatorId = parseInt(req.params.id);
                const validation = validationSchemas_1.updateCoordinatorSchema.safeParse(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map(e => e.message).join(", ")}`,
                        code: 400
                    });
                }
                const { data, roleIds } = req.body;
                const result = yield coorUpdateAction_1.default.execute(coordinatorId, data, roleIds || []);
                return AppResponse_1.default.sendSuccess({
                    res,
                    data: { coordinator: result.coordinatorUpdate },
                    message: "Coordinator updated successfully",
                    code: 200
                });
            }
            catch (error) {
                if (error.message == "One or more roles do not exist") {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: error.message,
                        code: 400
                    });
                }
                else if (error.message == "Coordinator not found.") {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: error.message,
                        code: 400
                    });
                }
                else {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: `Internal server error: ${error.message}`,
                        code: 500
                    });
                }
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            try {
                const { coors, total } = yield coorListPaginationAction_1.default.execute(page, pageSize);
                if (!coors) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "No coor available",
                        code: 404,
                    });
                }
                const totalPages = Math.ceil(total / pageSize);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: {
                        coors,
                        pagination: {
                            total,
                            page,
                            pageSize,
                            totalPages,
                        }
                    },
                    message: "Coors retrieved successfully",
                    code: 200,
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
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const coop = yield coorDeleteAction_1.default.execute(parseInt(id));
                if (!coop) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Coor not found",
                        code: 404
                    });
                }
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: coop,
                    message: "Coor deleted successfully",
                    code: 200
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
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const coor = yield coorShowAction_1.default.execute(parseInt(id));
                if (!coor) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Coor not found or deleted",
                        code: 404
                    });
                }
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: coor,
                    message: "Coor retrieved successfully",
                    code: 200
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
    listPerCoop(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const coopId = req.coorData.coop_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            try {
                const { coors, total } = yield coorListPerCoopAction_1.default.execute(page, pageSize, coopId);
                if (!coors) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "No coor available",
                        code: 404,
                    });
                }
                const totalPages = Math.ceil(total / pageSize);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: {
                        coors,
                        pagination: {
                            total,
                            page,
                            pageSize,
                            totalPages,
                        }
                    },
                    message: "Coors retrieved successfully",
                    code: 200,
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
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const coopId = req.coorData.coop_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            try {
                const searchQuery = req.query.search;
                const { coors, total } = yield coorSearch_1.default.execute(page, pageSize, searchQuery, coopId);
                if (!coors) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "No avalibale users",
                        code: 400
                    });
                }
                const totalPages = Math.ceil(total / pageSize);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: {
                        coors,
                        pagination: {
                            total,
                            page,
                            pageSize,
                            totalPages,
                        }
                    },
                    message: "Good",
                    code: 200
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
}
exports.default = CoorController;
//# sourceMappingURL=coorController.js.map