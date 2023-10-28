export default function errorHandler (status, message) {
    const error = new Error(message);
    error.statusCode = status;
    error.message = message;
    return { error };
};
