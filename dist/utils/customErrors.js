"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.BadRequestError = void 0;
class BadRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=customErrors.js.map