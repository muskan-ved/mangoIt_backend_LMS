const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Order = db.Order;
const User = db.User;

exports.getOrdres = async (req, res) => {
  // res.send('all orders')
  try {
    const orders = await Order.findAll({ where: { is_deleted: false } });
    res.status(200).json(orders);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getOrderById = async (req, res) => {
  // res.send('order byid')
  const orderId = req.params.id;
  try {
    const orderById = await Order.findOne({
      where: { id: orderId, is_deleted: false },
    });

    if (orderById) {
      res.status(200).json(orderById);
    }
    if (!orderById) {
      res.status(404).json("Order not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createOrder = async (req, res) => {
  const {
    user_id,
    subscription_id,
    payment_type,
    amount,
    status,
    parent_order_id,
    transaction_id,
    order_type,
  } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;

  try {
    const findUser = await User.findOne({ where: { id: login_user } });

    if (!(findUser.role_id == 1)) {
      //learner user
      const orderCreate = await Order.create({
        user_id: login_user,
        subscription_id: subscription_id,
        payment_type: payment_type,
        amount: amount,
        status: status,
        parent_order_id: parent_order_id,
        transaction_id: transaction_id,
        order_type: order_type,
        created_by: login_user,
      });
      res.json(orderCreate);
    }

    if (findUser.role_id == 1) {
      //admin user
      const orderCreate = await Order.create({
        user_id: user_id,
        subscription_id: subscription_id,
        payment_type: payment_type,
        amount: amount,
        status: status,
        transaction_id: transaction_id,
        parent_order_id: parent_order_id,
        order_type: order_type,
        created_by: login_user,
      });
      res.json(orderCreate);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;

  const {
    user_id: user_id,
    subscription_id,
    payment_type,
    amount,
    status,
    parent_order_id,
    order_type,
  } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  try {
    const orderUpdate = await Order.update(
      {
        user_id: user_id,
        subscription_id: subscription_id,
        payment_type: payment_type,
        amount: amount,
        status: status,
        parent_order_id: parent_order_id,
        order_type: order_type,
        updated_by: updated_by,
      },
      { where: { id: orderId } }
    );

    const newUpdateOrder = await Order.findOne({ where: { id: orderId } });
    res.json(newUpdateOrder);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;

  try {
    const orderDelete = await Order.update(
      {
        is_deleted: true,
        deleted_by: deleted_by,
      },
      { where: { id: orderId } }
    );

    const orderDeleted = await Order.findOne({ where: { id: orderId } });
    res.json(orderDeleted);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getOrderByUserId = async (req, res) => {
    // res.send("all session");
    const orderId = req.params.id;
    try {
      const orderByUserId = await Order.findAll({
        where: { user_id: orderId },
      });
      if (orderByUserId) {
        res.status(200).json(orderByUserId);
      }
      if (!orderByUserId) {
        res.status(404).json("orderId not Found!");
      }
    } catch (e) {
      res.status(400).json(e);
    }
  };
  
