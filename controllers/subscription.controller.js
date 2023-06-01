const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Subscription = db.Subscription;
const subscriptionPlan = db.subscriptionPlan;

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

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const created_by = decode.id;

  try {
    const createSubscription = await Subscription.create({
      name: name,
      description: description,
      price: price,
      duration_term: duration_term,
      user_id: userId,
      start_date: startDate,
      // next_pay_date:nextPay,
      status: status,
      duration_value: duration_value,
      created_by: created_by,
    });
    res.status(201).json(createSubscription);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateSubscription = async (req, res) => {
  const { name, description, price, duration_term, duration_value } = req.body;

  const subscriptionId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  const updateSubscription = await Subscription.update(
    {
      name: name,
      description: description,
      price: price,
      duration_term: duration_term,
      duration_value: duration_value,
      updated_by: updated_by,
    },
    { where: { id: subscriptionId } }
  );

  const updatedSubscriptionValue = await Subscription.findOne({
    where: { id: subscriptionId },
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
  const sequelize = require("sequelize");
  try {
    const users = await Subscription.findAll({});
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
    console.log("subsById", subsById);
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
  // res.send("all session");
  const subsId = req.params.id;
  try {
    const subsById = await Subscription.findOne({
      where: { id: subsId },
    });
    console.log("subsById", subsById);
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
      console.log("subsById", subsById);
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
