/* Error Handler */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
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