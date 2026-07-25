const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");

const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorizationHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.userId,
    };

    return next();
  } catch {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

module.exports = auth;
