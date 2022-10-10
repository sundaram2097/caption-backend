const bcrypt = require("bcrypt");

const encryptPasswordFunc = async (plainPass) => {
  const salt = await bcrypt.genSalt(12);
  const encryptedData = await bcrypt.hash(plainPass, salt);
  return encryptedData;
};

const decryptPasswordFunc = async (plainPass, hashedPass) => {
  const result = await bcrypt.compare(plainPass, hashedPass);
  return result;
};

module.exports = { encryptPasswordFunc, decryptPasswordFunc };
