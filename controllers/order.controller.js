const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Order = db.Order;
const User = db.User;
const Subscription = db.Subscription;

exports.getOrdres = async (req, res) => {
  const Sequelize = require("sequelize");
  const searchQuery = req.params.searchQuery;
  let orders;

  try {
    if (searchQuery) {
      orders = await Order.findAll({
        include: [
          {
            model: Subscription,
          },
          {
            model: User,
            where: {
              [Sequelize.Op.or]: [
                Sequelize.literal(
                  `CONCAT(first_name, ' ', last_name) LIKE '%${searchQuery}%'`
                ),
              ],
            },
          },
        ],

        where: {
          is_deleted: false,
        },
      });
    } else if (req.body.status !== "all" && req.body.status) {
      orders = await Order.findAll({
        include: [Subscription, User],
        where: {
          status: req.body.status,
          is_deleted: false,
        },
      });
    } else {
      orders = await Order.findAll({
        include: [Subscription, User],
        where: { is_deleted: false },
      });
    }
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

  // const token = req.headers.logintoken;
  // const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  // const login_user = decode.id;

  try {
    // const findUser = await User.findOne({ where: { id: login_user } });

    // if (!(findUser.role_id == 1)) {
    //   //learner user
    const orderCreate = await Order.create({
      user_id: user_id,
      subscription_id: subscription_id,
      payment_type: payment_type,
      amount: amount,
      status: status,
      parent_order_id: parent_order_id,
      transaction_id: transaction_id,
      order_type: order_type,
      created_by: user_id,
    });
    res.json(orderCreate);

    // }

    // if (findUser.role_id == 1) {
    //   //admin user
    //   const orderCreate = await Order.create({
    //     user_id: user_id,
    //     subscription_id: subscription_id,
    //     payment_type: payment_type,
    //     amount: amount,
    //     status: status,
    //     transaction_id: transaction_id,
    //     parent_order_id: parent_order_id,
    //     order_type: order_type,
    //     created_by: login_user,
    //   });
    //   res.json(orderCreate);
    // }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { status, transaction_id } = req.body;

  // const token = req.headers.logintoken;
  // const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  // const updated_by = decode.id;
  try {
    const orderUpdate = await Order.update(
      {
        status: status,
        transaction_id: transaction_id,
        updated_by: 1,
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

exports.getOrderSubscriptionId = async (req, res) => {
  // res.send("all session");
  const subscriptionId = req.params.id;
  try {
    const OrdersBysubscriptionId = await Order.findAll({
      where: { subscription_id: subscriptionId },
    });
    if (OrdersBysubscriptionId) {
      res.status(200).json(OrdersBysubscriptionId);
    }
    if (!OrdersBysubscriptionId) {
      res.status(404).json("orde not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createOrderforRenewSubscriptio = async (req, res) => {
  const { userId, subscriptioId } = req.body;
  try {
    //get orders by user id
    const orderByUserId = await Order.findAll({
      where: { user_id: userId },
      order: [["id", "DESC"]],
    });
    //get subscription plan det
    const getSubscriptionsBysubId = await db.Subscription.findAll({
      where: { user_id: userId, id: subscriptioId },
    });
    //create subscription order
    const orderCreate = await Order.create({
      user_id: userId,
      subscription_id: subscriptioId,
      amount: getSubscriptionsBysubId[0]?.price,
      status: "unpaid",
      parent_order_id: orderByUserId[0]?.id,
      order_type: orderByUserId[0]?.order_type,
      created_by: userId,
    });
    res.status(201).json(orderCreate);
  } catch (e) {
    res.status(400).json(e);
  }
};
