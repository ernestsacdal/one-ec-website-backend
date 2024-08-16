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
class BillListPerMeterAccountAction {
    static execute(page, pageSize, coopId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * pageSize;
            // Find the specific account registry entry
            const ar = yield client_1.default.accountRegistry.findUnique({
                where: {
                    id: id,
                    deletedAt: null,
                    meterAccount: {
                        coopId: coopId
                    }
                },
                include: {
                    meterAccount: {
                        include: {
                            Bill: {
                                skip,
                                take: pageSize,
                            }
                        }
                    },
                    user: true,
                }
            });
            if (!ar) {
                return { ar: null, total: 0 };
            }
            const total = yield client_1.default.bill.count({
                where: {
                    meterAccountId: ar.meterAccount.id,
                },
            });
            return { ar, total };
        });
    }
}
exports.default = BillListPerMeterAccountAction;
//# sourceMappingURL=billListPerMeterAccount.js.map