const express = require("express");
const { webProtection } = require("../helper/auth");
const {
  createSubcsription,
  updateSubscription,
  deleteSubscription,
  getAllSubscription,
  getSubscriptionById,
  getSubscriptionByUserId,
  getSubscriptionSearchByUserId,
  getSubscriptionPlans,
  getSubscriptionPlansDetById,
  getSubscriptionByUserIdLimitOne
} = require("../controllers/subscription.controller");
const router = express.Router();

router.post("/createsubscription", createSubcsription);
router.put("/updatesubscription/:id", webProtection, updateSubscription);
router.delete("/deletesubscription/:id", webProtection, deleteSubscription);
router.post("/getsubscription/:search?", webProtection, getAllSubscription);
router.get("/getsubscriptionbyid/:id", getSubscriptionById);
router.get("/getsubscriptionbyuserid/:id", getSubscriptionByUserId);
router.get("/subscriptionbyuserid/:id", getSubscriptionByUserIdLimitOne);

router.post(
  "/getsubscriptionbyuserid/:search?",
  webProtection,
  getSubscriptionSearchByUserId
);

//subscription plans
router.get("/subscriptionplans", webProtection, getSubscriptionPlans);
router.get(
  "/subscriptionplandetbyid/:id",
  webProtection,
  getSubscriptionPlansDetById
);

router.post("/createsubscription", createSubcsription);
router.put("/updatesubscription/:id", updateSubscription);
router.delete("/deletesubscription/:id", webProtection, deleteSubscription);
router.get("/getsubscription", webProtection, getAllSubscription);
router.get("/getsubscriptionbyid/:id", getSubscriptionById);
router.get("/getsubscriptionbyuserid/:id", getSubscriptionByUserId);
router.post(
  "/getsubscriptionbyuserid/:search?",
  webProtection,
  getSubscriptionSearchByUserId
);

module.exports = router;
