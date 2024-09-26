import { ErrorResponse } from "../utils/errorResponse.js"; // Adjust the path as necessary

const errorHandler = (err, req, res, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    return res.status(err.statusCode).json({ error: err.message || 'AN UNEXPECTED ERROR OCCURRED !!' });
};

export{errorHandler} // Optional: Exporting the function if needed
