const User = require("../shared/db_schema");

const { decryptPasswordFunc } = require("../util/hashFunc");
const { createTokenFunc } = require("../util/tokenFunc");

const loginControl = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send({ msg: "No empty values accepted" });
    }

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).send({ msg: "Wrong email/password" });
    }

    const hashedPassword = userData.password;
    const passwordMatch = await decryptPasswordFunc(password, hashedPassword);
    if (!passwordMatch) {
      return res.status(400).send({ msg: "Wrong email/password" });
    }

    const tokenPayLoad = {
      email: userData.email,
      id: userData._id,
    };
    const newToken = await createTokenFunc(tokenPayLoad);
    res.send({ newToken, msg: "Login Successful" });
  } catch (e) {
    console.log(e, "err");
    res.status(400).send({ msg: "Error in User login" });
  }
};

module.exports = loginControl;
