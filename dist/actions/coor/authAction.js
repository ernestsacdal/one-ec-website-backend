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
const zod_1 = require("zod");
const client_1 = __importDefault(require("../../utils/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../../utils/token"));
const Mailer_1 = __importDefault(require("../../utils/Mailer"));
class AuthAction {
    static execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const coor = yield client_1.default.coopCoordinator.findFirst({
                where: {
                    email: String(data.email),
                    deleted_at: null,
                },
                include: {
                    account: true
                }
            });
            if (!coor) {
                throw new Error("Invalid Login Credentials");
            }
            const now = new Date();
            if (coor.loginAttempts >= 5 && coor.lastLoginAttempt) {
                const timeDifference = now.getTime() - new Date(coor.lastLoginAttempt).getTime();
                const waitTime = 1 * 60 * 1000;
                if (timeDifference < waitTime) {
                    const remainingTime = Math.ceil((waitTime - timeDifference) / 1000);
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    if (coor.loginAttempts === 5) {
                        const mailer = new Mailer_1.default();
                        yield mailer.sendLoginAttemptAlert(coor.email, "Warning: Multiple Failed Login Attempts", "You have one more login attempt left before your account is temporarily locked.");
                        yield client_1.default.admin.update({
                            where: {
                                id: coor.id
                            },
                            data: {
                                loginAttempts: { increment: 1 },
                                lastLoginAttempt: now,
                            }
                        });
                    }
                    throw new Error(`Too many login attempts, please try again after ${minutes} minutes and ${seconds} seconds`);
                }
                else {
                    yield client_1.default.coopCoordinator.update({
                        where: {
                            id: coor.id
                        },
                        data: {
                            loginAttempts: 0,
                            lastLoginAttempt: null
                        }
                    });
                }
            }
            const isPasswordMatch = bcrypt_1.default.compareSync(data.password.toString(), coor.account[0].password);
            if (!isPasswordMatch) {
                yield client_1.default.coopCoordinator.update({
                    where: {
                        id: coor.id
                    },
                    data: {
                        loginAttempts: { increment: 1 },
                        lastLoginAttempt: now,
                    }
                });
                throw new Error("Invalid Login Credentials");
            }
            yield client_1.default.coopCoordinator.update({
                where: {
                    id: coor.id
                },
                data: {
                    loginAttempts: 0,
                    lastLoginAttempt: null
                }
            });
            return coor;
        });
    }
    static generateToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const coor = yield client_1.default.coopCoordinator.findFirst({
                where: {
                    email: data.email,
                    deleted_at: null
                },
            });
            if (!coor) {
                throw new Error("Invalid Login Credentials");
            }
            console.log(coor);
            return token_1.default.generate(coor);
        });
    }
    static validate(data) {
        const loginSchema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string(),
        });
        return loginSchema.safeParse(data);
    }
    static logActivity(coor, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.default.adminLog.create({
                data: {
                    coor_id: coor.id,
                    name: coor.first_name + ' ' + coor.last_name,
                    email: coor.email,
                    date: new Date(),
                    time: new Date().toISOString().split('T')[1].split('.')[0],
                    activity: activity
                }
            });
        });
    }
}
exports.default = AuthAction;
//# sourceMappingURL=authAction.js.map