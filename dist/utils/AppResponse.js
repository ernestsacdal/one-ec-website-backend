"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppResponse {
    static sendSuccess({ res, data, message, code, totalResults, }) {
        res.status(code).json(Object.assign(Object.assign({ status: "success", message }, (totalResults && { totalResults })), { data,
            code }));
    }
    static sendError({ res, data, message, code }) {
        res.status(code).json({
            status: "error",
            data,
            message,
            code,
        });
    }
}
exports.default = AppResponse;
//# sourceMappingURL=AppResponse.js.map