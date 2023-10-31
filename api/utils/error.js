const errorHandler = (status, message) => {
    const error = new Error(message);
    error.statusCode = status;
    error.message = message;
    return  error ;
};

export default errorHandler;