const jwt = require("jsonwebtoken");

const createTokenFunc = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const verifyTokenFunc = async (tokenFromClient) => {
  const decodedPayLoad = await jwt.verify(
    tokenFromClient,
    process.env.JWT_SECRET
  );
  return decodedPayLoad;
};

module.exports = { createTokenFunc, verifyTokenFunc };
