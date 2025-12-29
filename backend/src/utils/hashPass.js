const { hash } = require("bcryptjs");

const hashPass = async (password) => {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
}

module.exports = hashPass;