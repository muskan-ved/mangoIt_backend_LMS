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
  updateSubscriptionStatus,
} = require("../controllers/subscription.controller");
const router = express.Router();

router.post("/createsubscription", createSubcsription);
router.put("/updatesubscription/:id", webProtection, updateSubscription);
router.delete("/deletesubscription/:id", webProtection, deleteSubscription);
router.get("/getsubscription", webProtection, getAllSubscription);
router.get("/getsubscriptionbyid/:id", getSubscriptionById);
router.get("/getsubscriptionbyuserid/:id", getSubscriptionByUserId);
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
router.put(
  "/updatesubscriptionstatus/:id",
  webProtection,
  updateSubscriptionStatus
);
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
