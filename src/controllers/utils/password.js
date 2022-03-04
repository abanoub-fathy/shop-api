const bcrypt = require("bcryptjs");

// hash password
const hashUserPassword = async (password) => {
  const hashed = await bcrypt.hash(password, 8);
  return hashed;
};

// compare user password
const comapreUserPassword = async (password, hashed) => {
  const passMatch = await bcrypt.compare(password, hashed);
  return passMatch;
};

module.exports = {
  comapreUserPassword,
  hashUserPassword,
};
