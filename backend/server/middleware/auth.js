const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }
  const token = authorization.split(" ")[1];
  console.log(token);
  try {
    const user = jwt.verify(token, process.env.JWT_KEY);
    console.log(user)
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token signature" });
  }
};

module.exports = authMiddleware;
