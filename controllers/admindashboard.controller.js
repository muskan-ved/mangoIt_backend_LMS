require("dotenv").config();

const db = require("../models/index.model");
const User = db.User;
const Subscription = db.Subscription;
const Course = db.Course;

exports.getDashboard = async (req, res) => {
  try {
    const users = await User.findAll({});
    const subscriptions = await Subscription.findAll({});
    const totalSubscriptionsPrice = subscriptions.reduce(
      (accumulator, item) => accumulator + item.price,
      0
    );
    const course = await Course.findAll({});

    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0]; // Get today's date in the format "YYYY-MM-DD"

    const todaySubscriptionData = subscriptions.filter((item) => {
      const createdAt = new Date(item.createdAt);
      const createdAtDateString = createdAt.toISOString().split("T")[0]; // Get the "createdAt" date in the format "YYYY-MM-DD"
      return createdAtDateString === todayDateString;
    });

    const todayUserData = users.filter((item) => {
      const createdAt = new Date(item.createdAt);
      const createdAtDateString = createdAt.toISOString().split("T")[0]; // Get the "createdAt" date in the format "YYYY-MM-DD"
      return createdAtDateString === todayDateString;
    });

    res.status(200).json({
      totalUsers: users?.length,
      totalCourses: course?.length,
      totalSubscriptionsPrice: totalSubscriptionsPrice,
      totalSubscriptions: subscriptions?.length,
      todaysSubscriptionData: todaySubscriptionData?.slice(-5),
      todaysUsersData: todayUserData?.slice(-5),
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
