
const sendEmails = async( emailFrom, emailTo, emailSub, contentData) => {
  const send = require("gmail-send")({
    user: emailFrom,
    pass: process.env.EMAIL_PASS,
    to: emailTo,
    subject: emailSub,
    // replyTo: "devendramangoit@gmail.com",
  });
  // const filepath = req.file.path;
  try {
    const { result, full } = await send({
      html: `${contentData}`,
    }); 
  } catch (error) {
    res.json(error);
  }
};
module.exports = sendEmails;