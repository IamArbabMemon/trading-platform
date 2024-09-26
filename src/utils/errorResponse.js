class ErrorResponse extends Error {
    constructor(errorMessage, statusCode) {
        super(errorMessage);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export{ ErrorResponse } // Optional: Exporting the class if needed
