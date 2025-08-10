const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

  const authorization = req.headers.authorization;
  if (!authorization)
    return res.status(401).json({ message: "Token Not Found!" });

  const token = authorization.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { jwtAuthMiddleware, generateToken };