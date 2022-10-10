const { v4: uuid } = require("uuid");
//import {v4 as uuid} from uuid - es6Way (above:commonJs way)

const User = require("../shared/db_schema");
const mailerFunc = require("../util/mailerFunc");
const { createTokenFunc } = require("../util/tokenFunc");

const forgotPasswordControl = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).send({ msg: "No empty values allowed" });
    }
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).send({
        msg: "Check Your mail for code, if not received email is not valid",
      });
    }
    const resetPasswordCode = uuid();
    const userId = userData._id;
    const result = await User.findByIdAndUpdate(
      userId,
      {
        $set: { resetPasswordCode },
      },
      { new: true }
    );

    if (result) {
      const tokenPayload = {
        email: result.email,
        id: result._id,
      };
      const newToken = await createTokenFunc(tokenPayload);

      const resetPassLongString = `${resetPasswordCode}????${newToken}`;
      // const array = resetPassLongString.split("????").join("   ");
      // console.log(array, "arr");

      //(resetPassLongString)---> resetPasswordCode + jwt -sending both to client mail,
      //so jwt canbe used to verify its expiration time(1h)and
      //also check resetcode in db in (resetpassword route)
      const emailResponse = await mailerFunc(result.email, resetPassLongString);
      console.log(emailResponse, "email status response");
    }
    res.send({ msg: "check your mail for further instructions.." });
  } catch (e) {
    console.log(e, "err");
    res.status(400).send({
      msg: "password reset functionality is corrupted...Request not fulfilled",
    });
  }
};

module.exports = forgotPasswordControl;
