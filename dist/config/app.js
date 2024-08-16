"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const routers_1 = __importDefault(require("../routers"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_1 = __importDefault(require("../utils/swagger"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.set('trust proxy', true);
// Development logging
if (process.env.PROJECT_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use("/api/v1/", routers_1.default);
(0, swagger_1.default)(app);
app.get("/", (req, res) => {
    return res.redirect("/docs");
});
// Global Error Handler for all routes
app.all("*", (req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
exports.default = app;
//# sourceMappingURL=app.js.map