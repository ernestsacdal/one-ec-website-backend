"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = __importDefault(require("../config"));
const localUrl = config_1.default.url.local;
const forwardedUrl = config_1.default.url.forward;
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "OneEC",
            description: "API Documentation",
            version: "2.0.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
                apiKeyAuth: {
                    type: "apiKey",
                    name: "x-api-key",
                    in: "header",
                },
            },
        },
        security: [
            {
                apiKeyAuth: [],
            },
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["src/routers/*/*.{js,ts}", "dist/routers/*/*.{js,ts}"],
};
const spec = (0, swagger_jsdoc_1.default)(options);
const swagger = (app) => {
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spec, {
        customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
        swaggerOptions: {
            authAction: {
                bearerAuth: {
                    name: "bearerAuth",
                    schema: {
                        type: "http",
                        in: "header",
                        name: "Authorization",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                    value: "Bearer ", // Pre-fill with "Bearer " prefix
                },
            },
        },
    }));
};
exports.default = swagger;
//# sourceMappingURL=swagger.js.map