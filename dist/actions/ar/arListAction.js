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
const client_2 = require("@prisma/client");
class ArListPaginateAction {
    static execute(page, pageSize, coopId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * pageSize;
            const [ar, total] = yield Promise.all([
                client_1.default.accountRegistry.findMany({
                    where: {
                        deletedAt: null,
                        status: client_2.Status.APPROVED,
                        meterAccount: {
                            coop: {
                                id: coopId,
                                deletedAt: null
                            }
                        },
                        user: {
                            deleted_at: null
                        }
                    },
                    skip,
                    take: pageSize,
                    include: {
                        user: true,
                        meterAccount: true
                    }
                }),
                client_1.default.accountRegistry.count({
                    where: {
                        deletedAt: null,
                        meterAccount: {
                            coop: {
                                id: coopId
                            }
                        },
                        user: {
                            deleted_at: null
                        }
                    },
                }),
            ]);
            return { ar, total };
        });
    }
    static listAll(page, pageSize, coopId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * pageSize;
            const [ar, total] = yield Promise.all([
                client_1.default.accountRegistry.findMany({
                    where: {
                        deletedAt: null,
                        meterAccount: {
                            coop: {
                                id: coopId,
                                deletedAt: null
                            }
                        },
                        user: {
                            deleted_at: null
                        }
                    },
                    skip,
                    take: pageSize,
                    include: {
                        user: true,
                        meterAccount: true
                    }
                }),
                client_1.default.accountRegistry.count({
                    where: {
                        deletedAt: null,
                        meterAccount: {
                            coop: {
                                id: coopId
                            }
                        },
                        user: {
                            deleted_at: null
                        }
                    },
                }),
            ]);
            return { ar, total };
        });
    }
}
exports.default = ArListPaginateAction;
//# sourceMappingURL=arListAction.js.map