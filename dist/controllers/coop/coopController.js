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
const coopCreateAction_1 = __importDefault(require("../../actions/coop/coopCreateAction"));
const AppResponse_1 = __importDefault(require("../../utils/AppResponse"));
const coopUpdateAction_1 = __importDefault(require("../../actions/coop/coopUpdateAction"));
const coopShowAction_1 = __importDefault(require("../../actions/coop/coopShowAction"));
const coopListAction_1 = __importDefault(require("../../actions/coop/coopListAction"));
const coopDeleteAction_1 = __importDefault(require("../../actions/coop/coopDeleteAction"));
const client_1 = __importDefault(require("../../utils/client"));
class CoopController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validation = coopCreateAction_1.default.validate(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                        code: 400
                    });
                }
                const existingCoordinator = yield client_1.default.coopCoordinator.findUnique({
                    where: { email: req.body.coordinator.email }
                });
                if (existingCoordinator) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Email already exists",
                        code: 400
                    });
                }
                const { coop, coordinator } = yield coopCreateAction_1.default.execute(req.body);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: { coop, coordinator },
                    message: "Cooperative created successfully",
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
                const validation = coopUpdateAction_1.default.validate(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                        code: 400,
                    });
                }
                const coopShow = yield coopShowAction_1.default.execute(parseInt(id));
                if (!coopShow) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Coop not found",
                        code: 404,
                    });
                }
                const coop = yield coopUpdateAction_1.default.execute(parseInt(id), req.body);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: coop,
                    message: "Coordinator updated successfully",
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
                const coop = yield coopShowAction_1.default.execute(parseInt(id));
                if (!coop) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Coop not found or deleted",
                        code: 404
                    });
                }
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: coop,
                    message: "Coop retrieved successfully",
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
            try {
                const { coops, total } = yield coopListAction_1.default.execute(page, pageSize);
                if (!coops) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "No coop available",
                        code: 404,
                    });
                }
                const totalPages = Math.ceil(total / pageSize);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: {
                        coops,
                        pagination: {
                            total,
                            page,
                            pageSize,
                            totalPages,
                        }
                    },
                    message: "Coops retrieved successfully",
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
                const coop = yield coopDeleteAction_1.default.execute(parseInt(id));
                if (!coop) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Coop not found",
                        code: 404
                    });
                }
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: coop,
                    message: "Coop deleted successfully",
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
exports.default = CoopController;
//# sourceMappingURL=coopController.js.map