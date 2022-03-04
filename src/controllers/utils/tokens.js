const jwt = require("jsonwebtoken");

// generate auth token
const generateAuthToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1 day",
  });
  return token;
};

module.exports = {
  generateAuthToken,
};
