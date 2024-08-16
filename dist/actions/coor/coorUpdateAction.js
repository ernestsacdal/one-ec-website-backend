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
class CoorUpdateAction {
    static execute(coorId, data, roleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const coordinatorExists = yield tx.coopCoordinator.findUnique({
                    where: { id: coorId }
                });
                if (!coordinatorExists) {
                    throw new Error("Coordinator not found.");
                }
                const existingRoles = yield tx.role.findMany({
                    where: {
                        id: { in: roleIds },
                        deletedAt: null
                    }
                });
                if (existingRoles.length !== roleIds.length) {
                    throw new Error("One or more roles do not exist.");
                }
                const existingRoleAssignments = yield tx.coordinatorRole.findMany({
                    where: {
                        coordinatorId: coorId,
                        roleId: { in: roleIds }
                    }
                });
                const existingRoleIds = existingRoleAssignments.map(role => role.roleId);
                yield tx.coordinatorRole.updateMany({
                    where: {
                        coordinatorId: coorId,
                        roleId: { notIn: roleIds }
                    },
                    data: {
                        deletedAt: new Date(),
                    }
                });
                yield Promise.all(roleIds.map((roleId) => __awaiter(this, void 0, void 0, function* () {
                    if (!existingRoleIds.includes(roleId)) {
                        yield tx.coordinatorRole.create({
                            data: {
                                coordinatorId: coorId,
                                roleId: roleId
                            }
                        });
                    }
                    else {
                        yield tx.coordinatorRole.updateMany({
                            where: {
                                coordinatorId: coorId,
                                roleId: roleId,
                                deletedAt: { not: null }
                            },
                            data: { deletedAt: null }
                        });
                    }
                })));
                const coordinatorUpdate = yield tx.coopCoordinator.update({
                    where: { id: coorId },
                    data: Object.assign({}, data)
                });
                return { coordinatorUpdate };
            }));
        });
    }
}
exports.default = CoorUpdateAction;
//# sourceMappingURL=coorUpdateAction.js.map