const express = require("express");
const { webProtection } = require("../helper/auth");
const {
  createEnrollCourse,
  updateEnrollCourse,
  deleteEnrollCourse,
  checkEnrolledcourseornotbyuserId,
  getTopenrolledCourses,
} = require("../controllers/enrollcourse.controller");
const router = express.Router();

router.post("/createenrollcourse", webProtection, createEnrollCourse);
router.put("/updateenrollcourse/:id", webProtection, updateEnrollCourse);
router.delete("/deleteenrollcourse/:id", webProtection, deleteEnrollCourse);
router.post("/checenrollcourses", checkEnrolledcourseornotbyuserId);
router.get("/topenrolledcourses", getTopenrolledCourses);

module.exports = router;
