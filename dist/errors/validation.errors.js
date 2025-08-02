"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((errorObj) => errorSources.push({
        path: errorObj.path,
        message: errorObj.message,
    }));
    return {
        statusCode: 400,
        message: err.message,
        errorSources,
    };
};
exports.handleValidationError = handleValidationError;
