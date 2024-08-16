"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const secretAccKey = crypto_1.default.randomBytes(64).toString("base64");
const secretRefKey = crypto_1.default.randomBytes(64).toString("base64");
const secretApiKey = crypto_1.default.randomBytes(64).toString("base64");
console.log(`Access key : ${secretAccKey}`);
console.log(`Refresh key : ${secretRefKey}`);
console.log(`API key : ${secretRefKey}`);
console.log("Paste these keys in to .env file");
//# sourceMappingURL=generateKey.js.map