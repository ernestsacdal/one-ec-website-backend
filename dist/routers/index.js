"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = __importDefault(require("./admin"));
const coop_1 = __importDefault(require("./coop"));
const coor_1 = __importDefault(require("./coor"));
const role_1 = __importDefault(require("./role"));
const bill_1 = __importDefault(require("./bill"));
const ar_1 = __importDefault(require("./ar"));
const user_1 = __importDefault(require("./user"));
const routes = express_1.default.Router();
routes.use("/admin", admin_1.default);
routes.use("/coop", coop_1.default);
routes.use("/coor", coor_1.default);
routes.use("/role", role_1.default);
routes.use("/bill", bill_1.default);
routes.use("/ar", ar_1.default);
routes.use("/user", user_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map