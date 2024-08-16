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
const validationSchemas_1 = require("../../utils/validationSchemas");
class RoleCreateAction {
    static execute(data, coop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.default.role.create({
                data: Object.assign(Object.assign({}, data), { coopId: coop_id })
            });
        });
    }
    static validate(data) {
        return validationSchemas_1.roleSchemaCreate.safeParse(data);
    }
}
exports.default = RoleCreateAction;
//# sourceMappingURL=roleCreateAction.js.map