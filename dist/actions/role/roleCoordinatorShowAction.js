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
class RoleCoorShowAction {
    static execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const coordinator = yield client_1.default.coopCoordinator.findUnique({
                where: {
                    id: id,
                    deleted_at: null
                },
                include: {
                    roles: {
                        where: {
                            deletedAt: null
                        },
                        include: {
                            role: true
                        }
                    }
                }
            });
            // if (!roleData) {
            //     return null;
            // }
            // const aggregatedPermissions = new Set<string>();
            // const aggregatedModules = new Set<string>();
            // roleData.roles.forEach(roleEntry => {
            //     roleEntry.role.permissions.forEach(permission => aggregatedPermissions.add(permission));
            //     roleEntry.role.modules.forEach(module => aggregatedModules.add(module));
            // });
            // const combinedRoleData = {
            //     ...roleData,
            //     permissions: Array.from(aggregatedPermissions),
            //     modules: Array.from(aggregatedModules)
            // };
            // return combinedRoleData;
            if (!coordinator) {
                throw new Error("Coordinator not found");
            }
            // Extract only the roles and their related data
            const rolesData = coordinator.roles.map(coordinatorRole => {
                return {
                    id: coordinatorRole.role.id,
                    name: coordinatorRole.role.name,
                    permissions: coordinatorRole.role.permissions,
                    modules: coordinatorRole.role.modules,
                };
            });
            return {
                coordinatorRole: coordinator.role,
                roles: rolesData
            };
        });
    }
}
exports.default = RoleCoorShowAction;
//# sourceMappingURL=roleCoordinatorShowAction.js.map