class ApiError extends Error {
    public statusCode: number;
    public errors?: Record<string, string[]>;

    constructor(
        statusCode: number,
        message: string,
        errors?: Record<string, string[]>,
        stack?: string
    ) {
        super(message);

        this.statusCode = statusCode;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
