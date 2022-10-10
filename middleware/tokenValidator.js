const { verifyTokenFunc } = require("../util/tokenFunc");

const tokenValidatorFunc = async (req, res, next) => {
  try {
    const access_token = req.headers.authorization;
    const token = access_token.split(" ")[1];
    const payload = await verifyTokenFunc(token);
    if (!payload) {
      return res
        .status(400)
        .send({ msg: "Token expired... issue new request" });
    }
    next();
  } catch (e) {
    console.log(e, " error in token validator");
  }
};
module.exports = tokenValidatorFunc;
