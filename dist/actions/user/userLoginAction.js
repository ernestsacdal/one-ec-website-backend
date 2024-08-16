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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../../utils/token"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
class UserAuthAction {
    static execute(data, ip, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({
                where: {
                    email: String(data.email),
                    deleted_at: null
                },
                include: {
                    account: true
                }
            });
            if (!user) {
                yield this.recordFailedAttempt(ip, id);
                throw new Error("Invalid Login Credentials");
            }
            const lockedOut = yield this.checkAndHandleLockout(ip, id);
            if (lockedOut) {
                throw new Error("Too many login attempts. Please try again later.");
            }
            const isPasswordMatch = yield bcrypt_1.default.compareSync(data.password.toString(), user.account[0].password);
            if (!isPasswordMatch) {
                yield this.recordFailedAttempt(ip, id);
                throw new Error("Invalid Login Credentials");
            }
            yield this.resetLoginAttempts(ip, id);
            const token = token_1.default.generate({ id: user.id, email: user.email });
            return { user, token };
        });
    }
    static recordFailedAttempt(ip, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const existingAttempt = yield prisma.loginAttempt.findFirst({
                where: {
                    ip_address: ip,
                    userId: id
                }
            });
            if (existingAttempt) {
                yield prisma.loginAttempt.update({
                    where: {
                        id: existingAttempt.id
                    },
                    data: {
                        attempts: {
                            increment: 1
                        },
                        last_attempt_at: now
                    }
                });
            }
            else {
                yield prisma.loginAttempt.create({
                    data: {
                        ip_address: ip,
                        userId: id, attempts: 1,
                        last_attempt_at: now
                    }
                });
            }
        });
    }
    static checkAndHandleLockout(ip, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const attempt = yield prisma.loginAttempt.findFirst({
                where: {
                    ip_address: ip,
                    userId: id
                }
            });
            if (attempt) {
                if (attempt.last_attempt_at === null) {
                    return false;
                }
                const lastAttemptTime = new Date(attempt.last_attempt_at).getTime();
                const now = new Date().getTime();
                const timeDifference = now - lastAttemptTime;
                const lockoutTime = 60 * 1000;
                if (attempt.attempts >= 5 && timeDifference < lockoutTime) {
                    return true;
                }
                else if (timeDifference >= lockoutTime) {
                    yield this.resetLoginAttempts(ip, id);
                }
            }
            return false;
        });
    }
    static resetLoginAttempts(ip, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const attempt = yield prisma.loginAttempt.findFirst({
                where: {
                    ip_address: ip,
                    userId: id
                }
            });
            if (attempt) {
                yield prisma.loginAttempt.update({
                    where: {
                        id: attempt.id
                    },
                    data: {
                        attempts: 0,
                        last_attempt_at: null
                    }
                });
            }
        });
    }
    static validate(data) {
        const loginSchema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string(),
        });
        return loginSchema.safeParse(data);
    }
    static generateToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToken = yield prisma.user.findFirst({
                where: {
                    email: data.email,
                    deleted_at: null
                },
            });
            if (!userToken) {
                throw new Error("Invalid Login Credentials");
            }
            console.log(userToken);
            return token_1.default.generate(userToken);
        });
    }
}
exports.default = UserAuthAction;
//# sourceMappingURL=userLoginAction.js.map