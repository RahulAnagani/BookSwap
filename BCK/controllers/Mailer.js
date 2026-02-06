const nodemailer = require("nodemailer");
const otpModel = require("../models/otp");

module.exports.SendOtp = async (email, username, password, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Mail,
      pass: process.env.MailPass,
    },
  });

  const mailOptions = {
    from: process.env.Mail,
    to: email,
    subject: "BookSwap Verification Code",
    text: "Hello, \n As discussed, please find the requested code below.\nIf you have any questions or need further clarification, feel free to let me know.\nBest regards, " + String(otp),
  };
  

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return resolve(false);
      } else {
        try {
          const otpDoc = new otpModel({
            email,
            username,
            password,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          });
          await otpDoc.save();
          return resolve(true);
        } catch (err) {
          console.log("Error saving OTP:", err);
          return resolve(false);
        }
      }
    });
  });
};
