"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
class Token {
    static generate(payload) {
        const sanitizedPayload = payload;
        const token = jsonwebtoken_1.default.sign(sanitizedPayload, config_1.default.key.secret, {
            expiresIn: config_1.default.key.expiresIn,
        });
        return token;
    }
    static validate(token) {
        const validatedToken = jsonwebtoken_1.default.verify(token, config_1.default.key.secret);
        return validatedToken;
    }
}
exports.default = Token;
//# sourceMappingURL=token.js.map