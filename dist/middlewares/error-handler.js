"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../utils/customErrors");
const errorHandler = (err, req, res, next) => {
    console.log(err);
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    if (err instanceof customErrors_1.BadRequestError) {
        statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err instanceof customErrors_1.NotFoundError) {
        statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
    res.status(statusCode).json({
        message: err.message
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map