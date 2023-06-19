
const sendEmails = (emailTo, emailFrom, emailSub) => {
     require("gmail-send")({
        to : emailTo,
        user: emailFrom,
        subject:emailSub,
        pass: process.env.EMAIL_PASS,
      });
};
module.exports = sendEmails;