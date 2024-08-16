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
const client_2 = __importDefault(require("../../utils/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const date_fns_1 = require("date-fns");
class UserRegistrationAction {
    static execute(data, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            let formattedBirthdate = null;
            if (data.birthdate) {
                formattedBirthdate = (0, date_fns_1.formatISO)(data.birthdate);
            }
            return yield client_2.default.user.create({
                data: Object.assign(Object.assign({}, data), { birthdate: formattedBirthdate, role: client_1.UserRole.USER, account: {
                        create: {
                            password: hashedPassword
                        }
                    } }),
                include: {
                    account: true
                }
            });
        });
    }
}
exports.default = UserRegistrationAction;
//# sourceMappingURL=userRegistrationAction.js.map