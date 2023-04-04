const {
  generateToken,
  hashPassword,
  isValidPassword,
} = require("../helper/auth");
require("dotenv").config();

const jsonwebtoken = require("jsonwebtoken");
const db = require("../models/index.model");
const User = db.User;

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
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

    if(getUserById) {
        res.status(200).json(getUserById)
    }
    if (!getUserById) {
      res.status(404).json("User not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getUsersBySearch = async(req, res) => {
    const givenLetters = req.body.letters;

    try {
        const usersBySearch = await User.findAll({
          where: { first_name: givenLetters, is_deleted: false },
        });
    
        if(usersBySearch) {
            res.status(200).json(usersBySearch)
        }
        if (!usersBySearch) {
          res.status(404).json("User not Found!");
        }
      } catch (e) {
        res.status(400).json(e);
      }

}

exports.registration = async (req, res) => {
  const { first_name, last_name, email, password, role_id } = req.body;

  const checkToken = req.headers.logintoken;
  if (!checkToken) {
    if (!email || !password) {
      // learner reg self
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
      });
      res.status(201).json(user);
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
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json("Email and Password Required!");
  }

  const user = await User.findOne({
    where: { email: req.body.email, is_deleted: false },
  });
  if (!user) {
    res.status(404).json("User not exist with this Email!");
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
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const profile_pic = req.file.path;

  const findUser = await User.findOne({
    where: { id: userId, is_deleted: false },
  });
  if (!findUser) {
    res.status(404).json("User not Found!");
  }
  if (findUser) {
    const { first_name, last_name, email } = req.body;

    // password: await hashPassword(req.body.password)
    const token = req.headers.logintoken;
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
    const updated_by = decode.id;

    const firstName = await User.findOne({ where: { first_name: first_name } });
    const lastName = await User.findOne({ where: { last_name: last_name } });
    const findEmail = await User.findOne({ where: { email: req.body.email } });

    if (!firstName || !lastName) {
      const updateName = await User.update(
        {
          first_name: first_name,
          last_name: last_name,
          updated_by: updated_by,
        },
        { where: { id: userId } }
      );
      const updatedUser = await User.findOne({ where: { id: userId } });
      res.status(201).json(updatedUser);
    }

    if ((firstName && lastName) || !findEmail) {
      const updateUser = await User.update(
        { email: email, updated_by: updated_by },
        { where: { id: userId } }
      );
      const updatedUser = await User.findOne({ where: { id: userId } });
      res.status(201).json(updatedUser);
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
    const { email } = req.body;
    const findUser = await User.findOne({
      where: { email, is_deleted: false },
    });

    if (!findUser) {
      return res.status(400).json("this email is not register with us!");
    }

    if (findUser) {
      const { password, confirm_password } = req.body;

      if (!password || !confirm_password) {
        return res
          .status(400)
          .json("password & confirm_password fields are required!");
      }

      if (password !== confirm_password) {
        return res
          .status(400)
          .json("Password and confirm password are not matched!");
      }

      findUser.password = await hashPassword(confirm_password);
      findUser.save();

      res.status(202).json("password change succesfully!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.sendGmail = async (req, res) => {
  const { to, cc, subject } = req.body;

  const send = require("gmail-send")({
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
    to,
    cc,
    subject,
    replyTo: "devendramangoit@gmail.com",
  });

  const filepath = req.file.path;

  try {
    const { result, full } = await send({
      html: "<b> demo text from mail </b>", // both for text and html
      files: [filepath],
    });

    res.status(200).json(full);
  } catch (error) {
    res.json(error);
  }
};
