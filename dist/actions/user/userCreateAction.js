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
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_2 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const Mailer_1 = __importDefault(require("../../utils/Mailer"));
class CreateCustomerAction {
    static execute(userData, meterData, coop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const randomPassword = crypto_1.default.randomBytes(8).toString('hex');
                const hashedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
                const birthdate = new Date();
                const formattedBirthdate = (0, date_fns_1.formatISO)(birthdate);
                const user = yield tx.user.create({
                    data: Object.assign(Object.assign({}, userData), { birthdate: formattedBirthdate, account: {
                            create: {
                                password: hashedPassword
                            },
                        } }),
                });
                const meterAccountName = `${userData.first_name} ${userData.middle_name || ''} ${userData.last_name}`;
                const meterAccount = yield tx.meterAccount.create({
                    data: Object.assign(Object.assign({}, meterData), { meterAccountName: meterAccountName.trim(), coopId: coop_id, meterActivated: true, meterAddress: user.address && user.address.length > 0 ? user.address[0] : '' })
                });
                const accountRegistry = yield tx.accountRegistry.create({
                    data: {
                        userId: user.id,
                        meterId: meterAccount.id,
                        status: client_2.Status.APPROVED
                    }
                });
                const mailer = new Mailer_1.default();
                yield mailer.sendAccountPassword(user.email, randomPassword, user.email);
                return { user, meterAccount, accountRegistry };
            }));
        });
    }
}
exports.default = CreateCustomerAction;
//# sourceMappingURL=userCreateAction.js.map