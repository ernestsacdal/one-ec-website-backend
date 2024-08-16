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
class CoorSearchAction {
    static execute(page, pageSize, searchQuery, coopId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * pageSize;
            const [coors, total] = yield Promise.all([
                client_1.default.coopCoordinator.findMany({
                    where: {
                        OR: [
                            { first_name: { contains: searchQuery, mode: 'insensitive' } },
                            { middle_name: { contains: searchQuery, mode: 'insensitive' } },
                            { last_name: { contains: searchQuery, mode: 'insensitive' } },
                            { email: { contains: searchQuery, mode: 'insensitive' } },
                            { contact_number: { contains: searchQuery, mode: 'insensitive' } },
                            { address: { contains: searchQuery, mode: 'insensitive' } },
                        ],
                        deleted_at: null,
                        coop_id: coopId
                    },
                    skip,
                    take: pageSize,
                }),
                client_1.default.coopCoordinator.count({
                    where: {
                        OR: [
                            { first_name: { contains: searchQuery, mode: 'insensitive' } },
                            { middle_name: { contains: searchQuery, mode: 'insensitive' } },
                            { last_name: { contains: searchQuery, mode: 'insensitive' } },
                            { email: { contains: searchQuery, mode: 'insensitive' } },
                            { contact_number: { contains: searchQuery, mode: 'insensitive' } },
                            { address: { contains: searchQuery, mode: 'insensitive' } },
                        ],
                        deleted_at: null,
                        coop_id: coopId
                    },
                })
            ]);
            return { coors, total };
        });
    }
}
exports.default = CoorSearchAction;
//# sourceMappingURL=coorSearch.js.map