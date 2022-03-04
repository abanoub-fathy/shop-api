const authAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(403).send({ error: "You are not allowed" });
  }
};

module.exports = authAdmin;
