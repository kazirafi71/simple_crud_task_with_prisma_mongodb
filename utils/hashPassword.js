var bcrypt = require("bcrypt");

module.exports.generateHashPassword = async (password) => {
  var hash = bcrypt.hashSync(password, 10);

  return hash;
};

module.exports.checkHashPassword = async (password, hashPass) => {
  var result = bcrypt.compareSync(password, hashPass);

  return result;
};
