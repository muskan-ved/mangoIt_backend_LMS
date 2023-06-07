const express = require("express");
const { webProtection } = require("../helper/auth");
const {
  createEnrollCourse,
  updateEnrollCourse,
  deleteEnrollCourse,
  getCourseByUser,
} = require("../controllers/enrollcourse.controller");
const router = express.Router();

router.post("/createenrollcourse", webProtection, createEnrollCourse);
router.put("/updateenrollcourse/:id", webProtection, updateEnrollCourse);
router.delete("/deleteenrollcourse/:id", webProtection, deleteEnrollCourse);
router.get("/get_course_by_user_id/:id", getCourseByUser);

module.exports = router;
