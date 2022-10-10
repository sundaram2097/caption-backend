const User = require("../shared/db_schema");
const { encryptPasswordFunc } = require("../util/hashFunc");

const resetPasswordControl = async (req, res) => {
  //check data from req.body and check jwtcode and then check resetcode
  //available in db...also accept new password

  //check jwt and then resetcode

  const { resetCode, email, id, password } = req.body;
  if (!resetCode || !email || !id || !password) {
    return res.status(400).send({ msg: "No empty values allowed" });
  }
  try {
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).send({ msg: "No user found !" });
    }
    if (userData.resetPasswordCode !== resetCode) {
      return res.status(400).send({ msg: "Wrong resetCode" });
    }
    const newEncryptedPassword = await encryptPasswordFunc(password);
    const result = await User.findByIdAndUpdate(
      id,
      { $set: { password: newEncryptedPassword, resetPasswordCode: "" } },
      { new: true }
    );
    res.send({ result });
    //
  } catch (e) {
    console.log(e, "error in resetPassControl");
    res.status(400).send({ msg: "Cannot process request" });
  }
};
module.exports = resetPasswordControl;
