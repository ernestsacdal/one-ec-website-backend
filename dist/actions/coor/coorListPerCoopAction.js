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
const client_1 = __importDefault(require("../../utils/client"));
class CoorListPaginatePerCoopAction {
    static execute(page, pageSize, coopId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * pageSize;
            const [coors, total] = yield Promise.all([
                client_1.default.coopCoordinator.findMany({
                    where: {
                        coop_id: coopId,
                        deleted_at: null,
                    },
                    skip,
                    take: pageSize,
                }),
                client_1.default.coopCoordinator.count({
                    where: {
                        coop_id: coopId,
                        deleted_at: null,
                    }
                }),
            ]);
            return { coors, total };
        });
    }
}
exports.default = CoorListPaginatePerCoopAction;
//# sourceMappingURL=coorListPerCoopAction.js.map