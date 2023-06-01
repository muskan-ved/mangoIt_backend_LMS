const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const EmailManage = db.EmailManage;

exports.getAllEmailContent = async (req, res) => {
  let emailById = req.params.id,
    emailContent;
  try {
    if (emailById) {
      emailContent = await EmailManage.findOne({
        where: { id: emailById },
      });
    } else {
      emailContent = await EmailManage.findAll();
    }

    res.status(200).json(emailContent);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createEmailContent = async (req, res) => {
  const { emailtype, replytoname, replytoemail, emailsubject, emailbodytext } =
    req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;

  try {
    const findUser = await EmailManage.findOne({
      where: { user_id: login_user },
    });

    if (!findUser) {
      email_temp_create = await EmailManage.create({
        user_id: login_user,
        emailtype,
        replytoname,
        replytoemail,
        emailsubject,
        emailbodytext,
        created_by: login_user,
      });
      res.status(201).json(email_temp_create);
    } else {
      res
        .status(400)
        .json({ message: "User already inserted email management" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateEmailContent = async (req, res) => {
  const { emailtype, replytoname, replytoemail, emailsubject, emailbodytext } =
    req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  try {
    const checkEmailManagementId = await EmailManage.findOne({
      where: { id: req.params.id },
    });

    if (checkEmailManagementId) {
      await EmailManage.update(
        {
          emailtype,
          replytoname,
          replytoemail,
          emailsubject,
          emailbodytext,
          user_id: updated_by,
          updated_by: updated_by,
        },
        { where: { id: req.params.id } }
      );
    } else {
      res.status(400).json("Email content id not found");
    }

    const newUpdateEmailConfig = await EmailManage.findOne({
      where: { id: req.params.id },
    });
    res.status(201).json(newUpdateEmailConfig);
  } catch (e) {
    res.status(400).json(e);
  }
};
