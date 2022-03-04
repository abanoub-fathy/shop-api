const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { getUserByIdAndToken } = require("../queries/user");

// auth function
const auth = async (req, res, next) => {
  try {
    // remove the Bearer from the token sent from user request
    const tokenFromReq = req.headers.authorization.replace("Bearer ", "");

    // decode the token
    const decoded = jwt.verify(tokenFromReq, process.env.JWT_SECRET);

    // find the user with the decoded token
    const user = await db.query(getUserByIdAndToken, [
      decoded.id,
      tokenFromReq,
    ]);

    // if no user
    if (!user.rows.length) {
      throw new Error();
    }

    // add props on req and call next
    req.user = user.rows[0];
    req.token = tokenFromReq;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authinticate" });
  }
};

module.exports = auth;
