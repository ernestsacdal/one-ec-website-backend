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
const arListAction_1 = __importDefault(require("../../actions/ar/arListAction"));
const arShowAction_1 = __importDefault(require("../../actions/ar/arShowAction"));
class ArController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const coopId = req.coorData.coop_id;
                const { ar, total } = yield arListAction_1.default.execute(page, pageSize, coopId);
                return AppResponse_1.default.sendSuccess({
                    res,
                    data: {
                        ar,
                        total,
                        page,
                        pageSize,
                        totalPages: Math.ceil(total / pageSize),
                    },
                    message: 'Account registries fetched successfully',
                    code: 200
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res,
                    data: null,
                    message: `Internal server error: ${error.message}`,
                    code: 500
                });
            }
        });
    }
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const coopId = req.coorData.coop_id;
                const { ar, total } = yield arListAction_1.default.listAll(page, pageSize, coopId);
                return AppResponse_1.default.sendSuccess({
                    res,
                    data: {
                        ar,
                        total,
                        page,
                        pageSize,
                        totalPages: Math.ceil(total / pageSize),
                    },
                    message: 'Account registries fetched successfully',
                    code: 200
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res,
                    data: null,
                    message: `Internal server error: ${error.message}`,
                    code: 500
                });
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const ar = yield arShowAction_1.default.execute(parseInt(id));
                if (!ar) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Coop not found or deleted",
                        code: 404
                    });
                }
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: ar,
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
}
exports.default = ArController;
//# sourceMappingURL=arController.js.map