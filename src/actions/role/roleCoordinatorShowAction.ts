import prisma from "../../utils/client";

class RoleCoorShowAction {
    static async execute(id: number) {
        const roleData = await prisma.coopCoordinator.findUnique({
            where: {
                id: id,
                deleted_at: null
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!roleData) {
            return null;
        }

        const aggregatedPermissions = new Set<string>();
        const aggregatedModules = new Set<string>();

        roleData.roles.forEach(roleEntry => {
            roleEntry.role.permissions.forEach(permission => aggregatedPermissions.add(permission));
            roleEntry.role.modules.forEach(module => aggregatedModules.add(module));
        });

        const combinedRoleData = {
            ...roleData,
            permissions: Array.from(aggregatedPermissions),
            modules: Array.from(aggregatedModules)
        };

        return combinedRoleData;
    }
}

export default RoleCoorShowAction;