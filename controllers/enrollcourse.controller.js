const db = require("../models/index.model");
require("dotenv").config();
var Sequelize = require("sequelize");
const jsonwebtoken = require("jsonwebtoken");
const Enrollcourse = db.Enrollcourse;
const User = db.User;
const Module = db.Module;
const Session = db.Session;
const Course = db.Course;
var Op = Sequelize.Op;

exports.createEnrollCourse = async (req, res) => {
  const { user_id, course_id, course_type, view_history, mark_compelete } =
    req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;

  try {
    findLoginUser = await User.findOne({ where: { id: login_user } });

    if (!(findLoginUser.role_id == 1)) {
      //learner user
      const enrollCourse = await Enrollcourse.create({
        user_id: login_user,
        course_id: course_id,
        course_type: course_type,
        created_by: login_user,
        view_history: view_history,
        mark_compelete: mark_compelete,
      });
      res.status(201).json(enrollCourse);
    }

    if (findLoginUser.role_id == 1) {
      // admin user
      const enrollCourse = await Enrollcourse.create({
        user_id: user_id,
        course_id: course_id,
        course_type: course_type,
        created_by: login_user,
        view_history: view_history,
        mark_compelete: mark_compelete,
      });
      res.status(201).json(enrollCourse);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateEnrollCourse = async (req, res) => {
  const enrollCourseId = req.params.id;

  const {
    user_id,
    course_id,
    course_type,
    view_history,
    mark_compelete: mark_compelete,
  } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  const enrollCourseUpdate = await Enrollcourse.update(
    {
      user_id: user_id,
      course_id: course_id,
      course_type: course_type,
      view_history: view_history,
      updated_by: updated_by,
      mark_compelete: mark_compelete,
    },
    { where: { id: enrollCourseId } }
  );

  const newUpdatedEnrollCourse = await Enrollcourse.findOne({
    where: { id: enrollCourseId },
  });
  res.status(201).json(newUpdatedEnrollCourse);
};

exports.deleteEnrollCourse = async (req, res) => {
  const enrollCourseId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;

  try {
    const enrollCourseDelete = await Enrollcourse.update(
      {
        is_deleted: true,
        deleted_by: deleted_by,
      },
      { where: { id: enrollCourseId } }
    );

    const enrollCourseDeleted = await Enrollcourse.findOne({
      where: { id: enrollCourseId },
    });
    res.status(201).json(enrollCourseDeleted);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getCourseByUser = async (req, res) => {
  const user_id = req.params.id;
  //   const Op = Sequelize.Op;
  //   const search = req.params.search;
  //   const { is_chargeable, status } = req.body;
  try {
    const getEnrollData = await Enrollcourse.findAll({
      where: { user_id: user_id, is_deleted: false },
      include: [
        {
          model: Course,
        },
      ],
    });
    const moduleCounts = await Module.findAll({
      where: { is_deleted: false },
      attributes: [
        "course_id",
        [Sequelize.fn("COUNT", Sequelize.col("course_id")), "moduleCount"],
      ],
      group: ["course_id"],
    });
    const moduleCountsMap = new Map();
    moduleCounts.forEach((count) => {
      moduleCountsMap.set(count.course_id, count.moduleCount);
    });

    const sessionCounts = await Session.findAll({
      where: { is_deleted: false },
      attributes: [
        "course_id",
        [Sequelize.fn("COUNT", Sequelize.col("course_id")), "sessionCount"],
      ],
      group: ["course_id"],
    });
    const sessionCountsMap = new Map();
    sessionCounts.forEach((count) => {
      sessionCountsMap.set(count.course_id, count.sessionCount);
    });

    const combinedArray = getEnrollData.map((course) => {
      const sessionCount = sessionCounts.filter((count) =>
        count.course_id !== course.course_id
          ? count.sessionCount
          : { sessionCount: 0 }
      );
      const moduleCount = moduleCounts.filter((count) =>
        count.course_id !== course.course_id
          ? count.moduleCount
          : { moduleCount: 0 }
      );
      return {
        course,
        sessionCount: sessionCount,
        moduleCount: moduleCount,
      };
    });

    if (combinedArray) {
      res.status(200).json(combinedArray);
    }
    if (!combinedArray) {
      res.status(404).json("User Id not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

// const getCourseId = getEnrollData.map((ea) => {
//   return ea.course_id;
// });

// const courseData = await Course.findAll({
//   where: {
//     id: {
//       [Op.in]: getCourseId,
//     },
//     is_deleted: false,
//   },
//   include: [
//     {
//       model: Module,
//       include: [
//         {
//           model: Session,
//           where: {
//             course_id: {
//               [Op.in]: getCourseId,
//             },
//           },
//         },
//       ],
//     },
//   ],
// });
