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
const validationSchemas_1 = require("../../utils/validationSchemas");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Mailer_1 = __importDefault(require("../../utils/Mailer"));
class CoopCreateAction {
    static execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_2.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const coop = yield tx.cooperative.create({
                    data: {
                        name: data.name,
                        description: data.description,
                        address: data.address,
                    },
                });
                const randomPassword = crypto_1.default.randomBytes(8).toString('hex');
                const hashedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
                const coordinator = yield tx.coopCoordinator.create({
                    data: {
                        first_name: data.coordinator.first_name,
                        middle_name: data.coordinator.middle_name,
                        last_name: data.coordinator.last_name,
                        email: data.coordinator.email,
                        contact_number: data.coordinator.contact_number,
                        coop_id: coop.id,
                        role: client_1.UserRole.COOPSUPERADMIN,
                    },
                });
                yield tx.account.create({
                    data: {
                        password: hashedPassword,
                        coordinator_id: coordinator.id,
                    },
                });
                // const superAdminRole = await tx.role.create({
                //     data: {
                //         name: coop.name + " Super Admin",
                //         permissions: [], 
                //         modules: [],
                //     },
                // });
                // await tx.coordinatorRole.create({
                //     data: {
                //         coordinatorId: coordinator.id,
                //         roleId: superAdminRole.id,
                //     },
                // });
                const mailer = new Mailer_1.default();
                yield mailer.sendAccountPassword(data.coordinator.email, randomPassword, data.coordinator.email);
                return { coop, coordinator };
            }));
        });
    }
    static validate(data) {
        return validationSchemas_1.coopSchema.safeParse(data);
    }
}
exports.default = CoopCreateAction;
//# sourceMappingURL=coopCreateAction.js.map