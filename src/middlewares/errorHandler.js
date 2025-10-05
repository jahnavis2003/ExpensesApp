// middlewares/errorHandler.js
import sendResponse from "../utils/response.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  sendResponse(
    res,
    err.statusCode || 500,
    false,
    null,
    err.message || "Internal Server Error"
  );
};

export default errorHandler;
