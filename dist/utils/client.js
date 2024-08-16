"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new client_1.PrismaClient();
if (process.env.PROJECT_ENV !== "production")
    globalForPrisma.prisma = prisma;
exports.default = prisma;
//# sourceMappingURL=client.js.map