const jwt = require("jsonwebtoken");
const _ = require("lodash");

const VerfiyToken = async (req, res, next) => {
  try {
    const authHeader = _.get(req, "headers.authorization", "");
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const result = jwt.verify(token, process.env.SECRET_KEY);

    if (_.isEmpty(result)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userData = result;
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  VerfiyToken,
};
