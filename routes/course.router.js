const express = require("express");
const {
  getCourses,
  getCourseById,
  getCourseBySearch,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseByIdConn,
  DownloadReceiptAfterPay,
} = require("../controllers/course.controller");
const { webProtection } = require("../helper/auth");
const router = express.Router();
const { upload } = require("../helper/upload");

router.post("/getcourse/:search?", webProtection, getCourses);
router.get("/getcourse/:id", getCourseById);
// router.get("/getcoursebysearch/:search", webProtection, getCourseBySearch)
router.post(
  "/createcourse",
  webProtection,
  upload.single("audio_video_trailer"),
  createCourse
);
router.put(
  "/updatecourse/:id",
  webProtection,
  upload.single("audio_video_trailer"),
  updateCourse
);
router.delete("/deletecourse/:id", webProtection, deleteCourse);
router.get("/get_course_by_id/:id", getCourseByIdConn);
router.post("/downloadreceipt", DownloadReceiptAfterPay);




module.exports = router;
