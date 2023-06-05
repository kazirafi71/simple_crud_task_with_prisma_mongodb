let jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

module.exports.generateToken = async (data) => {
  let token = jwt.sign(data, process.env.SECRECT_KEY, {
    expiresIn: "2d",
  });
  return token;
};

module.exports.generateVerifyToken = async (data) => {
  let token = jwt.sign(data, process.env.SECRECT_KEY, {
    expiresIn: "5min",
  });
  return token;
};

module.exports.verifyJwtToken = async (token) => {
  let isValid = jwt.verify(token, process.env.SECRECT_KEY);
  return isValid;
};

module.exports.decodeJwtToken = async (token) => {
  var decoded = jwt_decode(token);
  return decoded;
};
