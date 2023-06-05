const { response } = require("./response");
const { StatusCodes } = require("http-status-codes");
const { verifyJwtToken } = require("./tokenManager");

const isAdminOrSupport = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return response(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        {},
        "You must be logged in"
      );
    }

    const token = authorization.split(" ")[1];

    const isValid = await verifyJwtToken(token);

    if (!isValid || isValid?.role !== "Admin" || isValid?.role !== "Support") {
      return response(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        {},
        "You are not allowed"
      );
    } else {
      req.user = isValid;
      next();
    }
  } catch (error) {
    return response(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      {},
      "You are not allowed"
    );
  }
};

const isLoggedIn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return response(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        {},
        "You must be logged in"
      );
    }

    const token = authorization.split(" ")[1];

    const isValid = await verifyJwtToken(token);

    if (!isValid) {
      return response(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        {},
        "You are not allowed"
      );
    } else {
      req.user = isValid;
      next();
    }
  } catch (error) {
    return response(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      {},
      "You are not allowed"
    );
  }
};

module.exports = { isAdminOrSupport, isLoggedIn };
