const express = require("express");
const {
  //createStripeCustomer,
  AcceptPayment,
  //   getStripeCustomer,
  //   updateStripeCustomer,
  //   deleteStripeCustomer,
  //   cardToken,
} = require("../controllers/payment.controller");
const { webProtection } = require("../helper/auth");
const router = express.Router();

router.post("/acceptpayment", webProtection, AcceptPayment);
// router.get("/payment/:id", webProtection, getStripeCustomer);
// router.put("/payment/:id", webProtection, updateStripeCustomer);
// router.delete("/payment/:id", webProtection, deleteStripeCustomer);
// router.post("/cardtoken", webProtection, cardToken);

module.exports = router;
