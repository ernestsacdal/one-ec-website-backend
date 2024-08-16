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
const roleCreateAction_1 = __importDefault(require("../../actions/role/roleCreateAction"));
const roleUpdateAction_1 = __importDefault(require("../../actions/role/roleUpdateAction"));
const roleShowAction_1 = __importDefault(require("../../actions/role/roleShowAction"));
const roleListPaginateAction_1 = __importDefault(require("../../actions/role/roleListPaginateAction"));
const roleDeleteAction_1 = __importDefault(require("../../actions/role/roleDeleteAction"));
const roleCoordinatorShowAction_1 = __importDefault(require("../../actions/role/roleCoordinatorShowAction"));
class RoleController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const coop_id = req.coorData.coop_id;
            try {
                const validation = roleCreateAction_1.default.validate(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                        code: 400
                    });
                }
                const coop = yield roleCreateAction_1.default.execute(req.body, coop_id);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: coop,
                    message: "Role created succesfully",
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
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const validation = roleUpdateAction_1.default.validate(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                        code: 400,
                    });
                }
                const roleShow = yield roleShowAction_1.default.execute(parseInt(id));
                if (!roleShow) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Role not found",
                        code: 404,
                    });
                }
                const role = yield roleUpdateAction_1.default.execute(parseInt(id), req.body);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: role,
                    message: "Role updated successfully",
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
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const role = yield roleShowAction_1.default.execute(parseInt(id));
                if (!role) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Role not found or deleted",
                        code: 404
                    });
                }
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: role,
                    message: "Role retrieved successfully",
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
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const coop_id = req.coorData.coop_id;
            try {
                const { roles, total } = yield roleListPaginateAction_1.default.execute(page, pageSize, coop_id);
                if (!roles) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "No role available",
                        code: 404,
                    });
                }
                const totalPages = Math.ceil(total / pageSize);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: {
                        roles,
                        pagination: {
                            total,
                            page,
                            pageSize,
                            totalPages,
                        }
                    },
                    message: "Roles retrieved successfully",
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
                const role = yield roleDeleteAction_1.default.execute(parseInt(id));
                if (!role) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Role not found",
                        code: 404
                    });
                }
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: role,
                    message: "Role deleted successfully",
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
    role(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.coorData.id;
                const coor = yield roleCoordinatorShowAction_1.default.execute(id);
                if (!coor) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Coor not found",
                        code: 404
                    });
                }
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: coor,
                    message: "Coor Role retrieved successfully",
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
}
exports.default = RoleController;
//# sourceMappingURL=roleController.js.map