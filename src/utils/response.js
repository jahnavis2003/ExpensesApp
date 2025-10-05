// utils/response.js
const sendResponse = (res, statusCode = 200, success = true, data = null, message = "") => {
  return res.status(statusCode).json({
    success,
    data,
    message,
  });
};

export default sendResponse;
