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
exports.aggregatePermissionsAndModules = void 0;
const AppResponse_1 = __importDefault(require("../utils/AppResponse"));
const client_1 = __importDefault(require("../utils/client"));
const aggregatePermissionsAndModules = (coordinatorRoles) => {
    const allPermissions = new Set();
    const allModules = new Set();
    coordinatorRoles.forEach(role => {
        role.role.permissions.forEach((permission) => allPermissions.add(permission));
        role.role.modules.forEach((module) => allModules.add(module));
    });
    return {
        permissions: Array.from(allPermissions),
        modules: Array.from(allModules),
    };
};
exports.aggregatePermissionsAndModules = aggregatePermissionsAndModules;
const CheckAccess = (requiredPermissions, requiredModules) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const coordinatorId = req.coorData.id;
        const coordinator = yield client_1.default.coopCoordinator.findUnique({
            where: { id: coordinatorId, deleted_at: null },
        });
        if (!coordinator) {
            return AppResponse_1.default.sendError({
                res: res,
                data: null,
                message: "Coordinator not found",
                code: 404
            });
        }
        if (coordinator.role === 'COOPSUPERADMIN') {
            return next();
        }
        const coordinatorRoles = yield client_1.default.coordinatorRole.findMany({
            where: { coordinatorId, deletedAt: null },
            include: { role: true },
        });
        const { permissions, modules } = (0, exports.aggregatePermissionsAndModules)(coordinatorRoles);
        const hasRequiredPermissions = requiredPermissions.every(permission => permissions.includes(permission));
        const hasRequiredModules = requiredModules.every(module => modules.includes(module));
        if (hasRequiredPermissions && hasRequiredModules) {
            next();
        }
        else {
            return AppResponse_1.default.sendError({
                res: res,
                data: null,
                message: "Unauthorized Access",
                code: 403
            });
        }
    });
};
exports.default = CheckAccess;
//# sourceMappingURL=role.js.map