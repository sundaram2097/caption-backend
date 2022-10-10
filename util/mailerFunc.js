var nodemailer = require("nodemailer");

const mailerFunc = async (toAddress, resetPassLongString) => {
  try {
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_MAIL_ID,
        pass: process.env.SENDER_MAIL_PASSWORD,
      },
    });

    if (transporter) {
      const mailOptions = {
        from: process.env.SENDER_MAIL_ID,
        to: toAddress,
        subject: "Password Reset Code",
        text: `Do not share your reset code with Others,  Click here to change Password-    
            ${process.env.CLIENT_RESETFLOW_URL}/${resetPassLongString} `,
      };

      const result = await transporter.sendMail(mailOptions);
      return result;
    }
  } catch (e) {
    console.log("error in sending mail -> ", e);
  }
};

module.exports = mailerFunc;
