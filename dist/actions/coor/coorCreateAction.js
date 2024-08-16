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
const Mailer_1 = __importDefault(require("../../utils/Mailer"));
class CoorCreateAction {
    static execute(data, roleIds, coopId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const randomPassword = crypto_1.default.randomBytes(8).toString('hex');
                const hashedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
                const coordinator = yield tx.coopCoordinator.create({
                    data: Object.assign(Object.assign({}, data), { coop_id: coopId, account: {
                            create: { password: hashedPassword }
                        }, roles: {
                            createMany: {
                                data: roleIds.map(roleId => ({ roleId }))
                            }
                        } })
                });
                const mailer = new Mailer_1.default();
                yield mailer.sendAccountPassword(data.email, randomPassword, data.email);
                return { coordinator };
            }));
        });
    }
}
exports.default = CoorCreateAction;
//# sourceMappingURL=coorCreateAction.js.map