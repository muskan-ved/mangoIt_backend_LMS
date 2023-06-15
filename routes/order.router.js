const express = require("express");
const {
  getOrdres,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderByUserId,
  createOrderforRenewSubscriptio,
} = require("../controllers/order.controller");
const { webProtection } = require("../helper/auth");
const router = express.Router();

router.post("/getorders/:searchQuery?", webProtection, getOrdres);
router.get("/getorder/:id", webProtection, getOrderById);
router.post("/createorder", webProtection, createOrder);
router.put("/updateorder/:id", updateOrder);
router.delete("/deleteorder/:id", webProtection, deleteOrder);
router.get("/getorderbyuserid/:id", getOrderByUserId);

//create order for renew subscription by userid
router.post(
  "/createorderforrenewsubscriptio",
  webProtection,
  createOrderforRenewSubscriptio
);

module.exports = router;
