const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  //Initialise nodemailer
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.G_PASS,
  },
});

module.exports = { transporter };
