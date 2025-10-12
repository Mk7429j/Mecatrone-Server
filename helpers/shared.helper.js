const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

// Compare plain text with hashed password
const PlaintoHash = async (plainText, hashText) => {
  return await bcrypt.compare(plainText, hashText);
};

// Hash a plain text password
const EncryptPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Generate JWT token
const GenerateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY);
};

module.exports = {
  PlaintoHash,
  EncryptPassword,
  GenerateToken,
};
