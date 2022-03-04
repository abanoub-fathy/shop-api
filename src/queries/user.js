const createUser =
  "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
const getUserByEmail = "SELECT * FROM users where email = $1";
const saveTokenToUser = "UPDATE users SET token = $1 where id = $2";
const getUserByIdAndToken = "SELECT * FROM users WHERE id = $1 AND token = $2";

module.exports = {
  createUser,
  getUserByEmail,
  saveTokenToUser,
  getUserByIdAndToken,
};
