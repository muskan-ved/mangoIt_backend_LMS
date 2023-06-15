const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Subscription = db.Subscription;
const subscriptionPlan = db.subscriptionPlan;
const User = db.User;

exports.createSubcsription = async (req, res) => {
  const {
    name,
    description,
    price,
    userId,
    startDate,
    status,
    duration_term,
    duration_value,
  } = req.body;

  // const token = req.headers.logintoken;
  // const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  // const created_by = decode.id;

  try {
    const createSubscription = await Subscription.create({
      name: name,
      description: description,
      price: price,
      duration_term: duration_term,
      user_id: userId,
      start_date: startDate,
      status: status,
      duration_value: duration_value,
    });
    res.status(201).json(createSubscription);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateSubscription = async (req, res) => {
  const {
    start_date,
    status,
    startDate,
    duration_value,
    userId,
    duration_term,
    price,
    description,
    name,
  } = req.body;
  const subscription_id = req.params.id;

  const updateSubscription = await Subscription.update(
    {
      name: name,
      description: description,
      price: price,
      duration_term: duration_term,
      user_id: userId,
      duration_value: duration_value,
      start_date: start_date || startDate,
      status: status,
    },
    { where: { id: subscription_id } }
  );
  const updatedSubscriptionValue = await Subscription.findOne({
    where: { id: subscription_id },
  });
  res.send(updatedSubscriptionValue);
};

exports.deleteSubscription = async (req, res) => {
  const subscriptionId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deletedBy = decode.id;

  try {
    const isDeleted = await Subscription.findOne({
      where: { id: subscriptionId },
    });
    const deleteSubscription = await Subscription.update(
      { isDeleted: true, deletedBy: deletedBy },
      { where: { id: subscriptionId } }
    );
    const subscriptionDeleted = await Subscription.findOne({
      where: { id: subscriptionId },
    });
    res.status(201).json(subscriptionDeleted);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getAllSubscription = async (req, res) => {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const search = req.params.search;
  let users;

  try {
    if (search) {
      users = await Subscription.findAll({
        include: [User],
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
          isDeleted: false,
        },
      });
    } else if (req.body.filter) {
      users = await Subscription.findAll({
        include: [User],
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
          status: req.body.filter,
          isDeleted: false,
        },
      });
    } else {
      users = await Subscription.findAll({
        include: [User],
        where: { isDeleted: false },
      });
    }
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionByUserId = async (req, res) => {
  // res.send("all session");
  const subsId = req.params.id;
  try {
    const subsById = await Subscription.findAll({
      where: { user_id: subsId },
    });
    if (subsById) {
      res.status(200).json(subsById);
    }
    if (!subsById) {
      res.status(404).json("subsId not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionById = async (req, res) => {
  const subsId = req.params.id;
  try {
    const subsById = await Subscription.findOne({
      where: { id: subsId },
    });
    if (subsById) {
      res.status(200).json(subsById);
    }
    if (!subsById) {
      res.status(404).json("subsId not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionSearchByUserId = async (req, res) => {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const search = req.params.search;
  const userId = req.body.id;
  const subsId = req.params.id;
  try {
    if (search) {
      const subscription = await Subscription.findAll({
        where: {
          user_id: userId,
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      });
      res.status(200).json(subscription);
    } else {
      const subsById = await Subscription.findAll({
        where: { user_id: subsId },
      });
      if (subsById) {
        res.status(200).json(subsById);
      }
      if (!subsById) {
        res.status(404).json("subsId not Found!");
      }
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionPlans = async (req, res) => {
  const sequelize = require("sequelize");
  try {
    const users = await subscriptionPlan.findAll({});
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionPlansDetById = async (req, res) => {
  try {
    const subsById = await subscriptionPlan.findOne({
      where: { id: req.params.id },
    });
    if (subsById) {
      res.status(200).json(subsById);
    }
    if (!subsById) {
      res.status(404).json("subsId not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionByUserIdLimitOne = async (req, res) => {
  const subsId = req.params.id;
  try {
    const subsById = await Subscription.findOne({
      where: { user_id: subsId },
      limit: 1,
      order: [["createdAt", "DESC"]],
    });
    if (subsById) {
      res.status(200).json(subsById);
    }
    if (!subsById) {
      res.status(404).json("subsId not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};
