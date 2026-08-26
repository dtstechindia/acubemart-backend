/* Error Handler */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const response = {
        success: false,
        message,
        statusCode,
    };

    if (
        process.env.NODE_ENV !== 'production' &&
        process.env.EXPOSE_ERROR_STACK === 'true'
    ) {
        response.stack = err.stack;
    }

    if (statusCode >= 500) {
        console.error(`[request-error] ${req.method} ${req.originalUrl}:`, err);
    }

    return res.status(statusCode).json(response)
};


/* API Error Handler */
const apiErrorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.success = false;
    error.message = message;
    return error;
};

export {
    errorHandler,
    apiErrorHandler,
}
