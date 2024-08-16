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
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const Mailer_1 = __importDefault(require("../../utils/Mailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class ForgotPasswordAction {
    static requestReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield client_1.default.admin.findUnique({
                where: { email },
                include: { account: true },
            });
            if (!admin) {
                throw new Error("Email does not exist");
            }
            const token = crypto_1.default.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
            yield client_1.default.passwordReset.create({
                data: {
                    adminId: admin.id,
                    token,
                    expiresAt,
                },
            });
            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
            const mailer = new Mailer_1.default();
            yield mailer.sendPasswordResetLink(admin.email, resetLink);
            return true;
        });
    }
    static resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetRequest = yield client_1.default.passwordReset.findFirst({
                where: { token, deletedAt: null },
                include: { admin: true },
            });
            if (!resetRequest || resetRequest.expiresAt < new Date()) {
                throw new Error("Invalid or expired password reset token");
            }
            const hashedPassword = bcrypt_1.default.hashSync(newPassword, 10);
            yield client_1.default.account.updateMany({
                where: { admin_id: resetRequest.adminId },
                data: { password: hashedPassword },
            });
            yield client_1.default.passwordReset.update({
                where: { id: resetRequest.id },
                data: { deletedAt: new Date() },
            });
            return true;
        });
    }
}
exports.default = ForgotPasswordAction;
//# sourceMappingURL=adminForgotPassword.js.map