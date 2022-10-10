const User = require("../shared/db_schema");

const { encryptPasswordFunc } = require("../util/hashFunc");
const { createTokenFunc } = require("../util/tokenFunc");

const registerControl = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    if (!email || !name || !password) {
      return res.status(400).send({ msg: "No empty values accepted" });
    }

    const duplicateData = await User.findOne({ email });
    if (duplicateData) {
      return res.status(400).send({ msg: "Email Already exists" });
    }

    const hashedPassword = await encryptPasswordFunc(password);
    const createdUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    if (createdUser) {
      const jwtPayload = {
        email: createdUser.email,
        id: createdUser._id,
      };
      const newToken = await createTokenFunc(jwtPayload);
      res.send({ newToken, msg: "Registered Successfully" });
    }
  } catch (e) {
    console.log(e, "err");
    res.status(400).send({ msg: "Error in registering User" });
  }
};

module.exports = registerControl;
