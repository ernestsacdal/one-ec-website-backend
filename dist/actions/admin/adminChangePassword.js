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
const Mailer_1 = __importDefault(require("../../utils/Mailer"));
class ChangePasswordAction {
    static changePassword(adminId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield client_1.default.admin.findUnique({
                where: {
                    id: adminId
                },
                include: {
                    account: true
                },
            });
            if (!admin) {
                throw new Error("Admin not found");
            }
            const isPasswordMatch = bcrypt_1.default.compareSync(currentPassword, admin.account[0].password);
            if (!isPasswordMatch) {
                throw new Error("Current password is incorrect");
            }
            const hashedNewPassword = bcrypt_1.default.hashSync(newPassword, 10);
            yield client_1.default.account.update({
                where: { id: admin.account[0].id },
                data: { password: hashedNewPassword },
            });
            const mailer = new Mailer_1.default();
            yield mailer.sendPasswordChangeNotification(admin.email, admin.first_name);
            return true;
        });
    }
    static logActivity(admin, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.default.adminLog.create({
                data: {
                    admin_id: admin.id,
                    name: admin.first_name + ' ' + admin.last_name,
                    email: admin.email,
                    date: new Date(),
                    time: new Date().toISOString().split('T')[1].split('.')[0],
                    activity: "Password changed",
                },
            });
        });
    }
}
exports.default = ChangePasswordAction;
//# sourceMappingURL=adminChangePassword.js.map