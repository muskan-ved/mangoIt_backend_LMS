const express = require("express");
const { upload } = require("../helper/upload");
const {
  getUsers,
  getUserById,
  updateUser,
  registration,
  loginUser,
  deleteUser,
  resetPassword,
  sendGmail,
  getUserByEmail,
} = require("../controllers/user.controller");
const { webProtection } = require("../helper/auth");
const router = express.Router();

router.get("/getusers/:search?", webProtection, getUsers);
router.get("/getuser/:id", webProtection, getUserById);
router.post("/getuserbyemail", webProtection, getUserByEmail);
router.post("/registration", webProtection, registration);
router.post("/loginuser", webProtection, loginUser);
router.put(
  "/updateuser/:id",
  webProtection,
  upload.single("profile_pic"),
  updateUser
);
router.delete("/deleteuser/:id", webProtection, deleteUser);
router.post("/resetpassword", webProtection, resetPassword);
router.post(
  "/sendgmail",
  webProtection,
  upload.single("attachment"),
  sendGmail
);

module.exports = router;
