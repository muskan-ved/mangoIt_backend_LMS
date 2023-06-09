const {
  generateToken,
  hashPassword,
  isValidPassword,
} = require("../helper/auth");

require("dotenv").config();

const jsonwebtoken = require("jsonwebtoken");
const db = require("../models/index.model");
const { capitalizeFirstLetter } = require("../helper/help");
const User = db.User;
const EmailManage = db.EmailManage;

exports.getUsers = async (req, res) => {
  const sequelize = require("sequelize");
  const search = req.params.search;
  const { role_id, status } = req.body;

  try {
    if (search) {
      const users = await User.findAll({
        where: {
          [sequelize.Op.or]: {
            namesQuery: sequelize.where(
              sequelize.fn(
                "concat",
                sequelize.col("first_name"),
                " ",
                sequelize.col("last_name")
              ),
              {
                [sequelize.Op.like]: `%${search}%`,
              }
            ),
          },
          is_deleted: false,
        },
      });
      res.status(200).json(users);
    } else if (role_id == 0 && status) {
      const users = await User.findAll({
        where: {
          is_deleted: false,
          status,
        },
      });
      res.status(200).json(users);
    } else if (role_id && status == 0) {
      const users = await User.findAll({
        where: {
          is_deleted: false,
          role_id,
        },
      });
      res.status(200).json(users);
    } else if (role_id && status) {
      const users = await User.findAll({
        where: {
          is_deleted: false,
          role_id,
          status,
        },
      });
      res.status(200).json(users);
    } else {
      const users = await User.findAll({ where: { is_deleted: false } });
      res.status(200).json(users);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const getUserById = await User.findOne({
      where: { id: userId, is_deleted: false },
    });

    if (getUserById) {
      res.status(200).json(getUserById);
    }
    if (!getUserById) {
      res.status(404).json("User not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const getUserByemail = await User.findOne({
      where: { email: email, is_deleted: false },
    });
    if (getUserByemail) {
      res.status(200).json(getUserByemail);
    }
    if (!getUserByemail) {
      res.status(404).json("User not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.registration = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    role_id,
    profile_pic,
    loggedin_by,
  } = req.body;
  const checkToken = req.headers.logintoken;

  if (!checkToken) {
    const findUser = await User.findOne({
      where: { email: email, is_deleted: false },
    });
    if (
      (email && loggedin_by === "facebook") ||
      (email && loggedin_by === "google")
    ) {
      //  return res.send('fb or google')

      if (findUser !== null) {
        // return res.status(400).json("Email already Registered!")
        const user = await User.update(
          {
            first_name: first_name,
            last_name: last_name,
            email: email,
            profile_pic: profile_pic,
            loggedin_by: loggedin_by,
          },
          { where: { id: findUser.dataValues.id } }
        );
        const updatedUser = await User.findOne({
          where: { id: findUser.dataValues.id },
        });
        const token = await generateToken({
          id: findUser.dataValues.id,
          email: email,
        });
        return res.status(201).json({ updatedUser, loginToken: token });
      } else {
        const user = await User.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          profile_pic: profile_pic,
          loggedin_by: loggedin_by,
        });
        const token = await generateToken({
          id: user.dataValues.id,
          email: email,
        });

        return res.status(201).json({ user, loginToken: token });
      }
    } else {
      if (findUser) {
        // learner self registration
        return res.status(400).json("Email already Registered!");
      } else if (!email) {
        return res.status(400).json("Email feild is Required!");
      } else {
        const user = await User.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: await hashPassword(
            password ? password : process.env.TEMPPASS
          ),
          role_id: role_id,
        });
        return res.status(201).json(user);
      }
    }
  }

  if (checkToken) {
    const token = req.headers.logintoken;
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
    const login_user = decode.id;
    // console.log(login_user)
    const findLoginUser = await User.findOne({
      where: { id: login_user, is_deleted: false },
    });

    if (findLoginUser.role_id == 1) {
      // admin reg for learner
      if (!email || !password) {
        res.status(400).json("Email and Password Required!");
      }

      const findUser = await User.findOne({
        where: { email: email, is_deleted: false },
      });
      if (findUser) {
        res.status(400).json("Email already Registered!");
      }

      if (!findUser) {
        const user = await User.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: await hashPassword(password),
          role_id: role_id,
          created_by: login_user,
        });
        res.status(201).json(user);
      }
    }
  }
};

exports.loginUser = async (req, res) => {
  const { email, password, identifier } = req.body;

  if (email && identifier === "userautologinwithemail") {
    const user = await User.findOne({
      where: { email: email, is_deleted: false },
    });
    const token = await generateToken({
      id: user.id,
      email: user.email,
    });
    res.status(200).json({
      userDetails: user,
      loginToken: token,
    });
  } else {
    const user = await User.findOne({
      where: { email: email, is_deleted: false },
    });
    if (!user) {
      return res.status(404).json("User not exist with this Email!");
    }
    const validPassword = await isValidPassword(password, user.password);
    if (!validPassword) {
      res.status(400).json("Password Incorrect!");
    }
    if (validPassword) {
      const token = await generateToken({
        id: user.id,
        email: user.email,
      });

      res.status(200).json({
        userDetails: user,
        loginToken: token,
      });
    }
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  let profile_pic;
  if (req.file) {
    profile_pic = req.file.path;
  }
  const findUser = await User.findOne({
    where: { id: userId, is_deleted: false },
  });
  if (!findUser) {
    res.status(404).json("User not Found!");
  }

  if (findUser) {
    const { first_name, last_name, email, role_id, status } = req.body;

    const token = req.headers.logintoken;
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
    const updated_by = decode.id;
    const checkEmail = await User.findOne({ where: { email: email } });
    const existUser = await User.findOne({
      where: { email: email, id: userId },
    });
    if (!checkEmail || existUser) {
      const update = await User.update(
        {
          first_name: first_name,
          last_name: last_name,
          role_id: role_id,
          status,
          email: email,
          updated_by: updated_by,
          profile_pic: profile_pic,
        },
        { where: { id: userId } }
      );
      const updatedUser = await User.findOne({ where: { id: userId } });
      return res.status(201).json(updatedUser);
    }

    if (checkEmail) {
      return res.status(400).json("Email already Registered!");
    }
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;
  try {
    const userDelete = await User.update(
      {
        is_deleted: true,
        deleted_by: deleted_by,
      },
      { where: { id: userId } }
    );

    const deletedUser = await User.findOne({ where: { id: userId } });
    res.status(201).json(deletedUser);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
    const user_id = decode.id;
    console.log(user_id);
    const findUser = await User.findOne({
      where: { id: user_id, is_deleted: false },
    });

    if (!findUser) {
      return res.status(400).json("User not Found!");
    }

    if (findUser) {
      findUser.password = await hashPassword(password);
      findUser.save();

      res.status(202).json("password change succesfully!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.sendGmail = async (req, res) => {
  const { to, cc, subject } = req.body;

  const findUser = await User.findOne({
    where: { email: to, is_deleted: false },
  });

  const findEmailSendingData = await EmailManage.findOne({
    where: { emailtype: "forgot_password" },
  });

  let result = findEmailSendingData.dataValues.emailbodytext.replace(
    "{{username}}",
    `${capitalizeFirstLetter(findUser && findUser?.first_name)} ${
      findUser && findUser?.last_name
    }`
  );

  console.log(findEmailSendingData.dataValues, "33333", result, findUser);
  if (!findUser) {
    return res.status(400).json("this email is not register with us!");
  }

  if (findUser) {
    const send = require("gmail-send")({
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
      to,
      cc,
      subject,
      // replyTo: "devendramangoit@gmail.com",
    });

    // const filepath = req.file.path;

    try {
      // console.log(findUser,"44444444444444444444")
      const { full } = await send({
        html: `${result}`,
        // files: [filepath],
      });
      const genToken = await generateToken({
        id: findUser.id,
        email: findUser.email,
      });
      res.status(200).json(genToken);
    } catch (error) {
      res.json(error);
    }
  }
};
