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
const ejs_1 = __importDefault(require("ejs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../config/index"));
const nodemailer = require("nodemailer");
class Mailer {
    sendEmail(receiver, subject, data, templateName, plainText, htmlContent, attachments) {
        return new Promise((resolve, reject) => {
            var _a;
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: index_1.default.email.address,
                    pass: index_1.default.email.password,
                },
            });
            let content = null;
            if (templateName) {
                const templatePath = path_1.default.resolve(__dirname, `../views/email/${templateName}.ejs`);
                const template = fs_1.default.readFileSync(templatePath, "utf8");
                content = ejs_1.default.render(template, { data });
            }
            if (!plainText && !content && !htmlContent) {
                return reject(new Error("No content provided for email."));
            }
            const mailOptions = {
                from: "OneEC",
                to: receiver,
                subject: subject,
                text: plainText !== null && plainText !== void 0 ? plainText : undefined,
                html: (_a = htmlContent !== null && htmlContent !== void 0 ? htmlContent : content) !== null && _a !== void 0 ? _a : undefined,
                attachments: attachments
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    reject(error);
                }
                else {
                    console.log("Email sent:", info.response);
                    resolve(true);
                }
            });
        });
    }
    sendLoginAttemptAlert(email, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { subject, message };
            return yield this.sendEmail(email, subject, data, "failedLoginAlert");
        });
    }
    sendPasswordResetLink(email, resetLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { resetLink };
            return yield this.sendEmail(email, "Password Reset Request", data, "passwordReset");
        });
    }
    sendPasswordChangeNotification(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { name };
            return yield this.sendEmail(email, "Password Changed", data, "passwordChanged");
        });
    }
    sendAccountPassword(email, password, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { password, email: userEmail };
            return yield this.sendEmail(email, "Your Account Password", data, "accountPassword");
        });
    }
    sendEmailSummary(email, kwhConsume, amount, rate, pdfBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { kwhConsume, amount, rate };
            const attachments = [{
                    filename: 'Bill.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }];
            return this.sendEmail(email, "Bill Summary", data, "billSummary", undefined, undefined, attachments);
        });
    }
}
exports.default = Mailer;
//# sourceMappingURL=Mailer.js.map