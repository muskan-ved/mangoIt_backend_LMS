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
  const search = req.params.search;
  try {
    if (search) {
      const getEnrollData = await Enrollcourse.findAll({
        where: { user_id: user_id, is_deleted: false },
        include: [
          {
            model: Course,
            where: {
              title: {
                [Op.like]: `%${search}%`,
              },
              is_deleted: false,
            },
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
      //////////////////Percent of completed//////////////////////////////
      const enrollCourse = await Enrollcourse.findAll({
        where: { user_id: user_id },
      });

      let getEnrollData1;
      const courseIdCounts = {};
      for (let i = 0; i < enrollCourse.length; i++) {
        getEnrollData1 = enrollCourse[i].view_history;
        if (getEnrollData1 !== null) {
          getEnrollData1.map((ea) => {
            Object.assign(ea, { courseId: enrollCourse[i].course_id });
          });

          getEnrollData1.forEach((obj) => {
            const courseId = obj["courseId"];

            if (!courseIdCounts[courseId]) {
              courseIdCounts[courseId] = 0;
            }

            for (const key in obj) {
              if (key !== "courseId") {
                courseIdCounts[courseId] += obj[key].length;
              }
            }
          });
        } else {
          console.log("empty");
        }
      }

      ///////////////////////Percent of completed//////////////////////////
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
          courseIdCounts: courseIdCounts,
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
    } else {
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
      ////////////////////////////////////////////////
      const enrollCourse = await Enrollcourse.findAll({
        where: { user_id: user_id },
      });

      let getEnrollData1;
      const courseIdCounts = {};
      for (let i = 0; i < enrollCourse.length; i++) {
        getEnrollData1 = enrollCourse[i].view_history;
        if (getEnrollData1 !== null) {
          getEnrollData1.map((ea) => {
            Object.assign(ea, { courseId: enrollCourse[i].course_id });
          });

          getEnrollData1.forEach((obj) => {
            const courseId = obj["courseId"];
            if (!courseIdCounts[courseId]) {
              courseIdCounts[courseId] = 0;
            }
            for (const key in obj) {
              if (key !== "courseId") {
                courseIdCounts[courseId] += obj[key].length;
              }
            }
          });
        } else {
          console.log("empty");
        }
      }

      /////////////////////////////////////////////////
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
          courseIdCounts: courseIdCounts,
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
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getEnrollPercent = async (req, res) => {
  const user_id = req.params.id;

  try {
    const enrollCourse = await Enrollcourse.findAll({
      where: { user_id: user_id },
    });

    let getEnrollData;
    let arr = [];
    const courseIdCounts = {};
    for (let i = 0; i < enrollCourse.length; i++) {
      getEnrollData = enrollCourse[i].view_history;
      getEnrollData.map((ea) => {
        Object.assign(ea, { courseId: enrollCourse[i].course_id });
      });

      getEnrollData.forEach((obj) => {
        const courseId = obj["courseId"];

        if (!courseIdCounts[courseId]) {
          courseIdCounts[courseId] = 0;
        }

        for (const key in obj) {
          if (key !== "courseId") {
            courseIdCounts[courseId] += obj[key].length;
          }
        }
      });
      // getEnrollData.forEach((item) => {
      //   arr.push(item);
      // });
    }
    const response = {
      courseIdCounts: courseIdCounts,
    };

    console.log("Course ID Counts:", response);
    res.status(201).json(response);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.markAsCompleteCourse = async (req, res) => {
  const { user_id, course_id, module_id, session_id } = req.body;
  try {
    if (!user_id && !course_id) {
      res.status(404).json("All field are required!");
    } else {
      const updateEnroll = await Enrollcourse.findOne({
        where: { user_id: user_id, course_id: course_id },
      });
      if (updateEnroll) {
        const enrollId = updateEnroll.view_history;
        if (enrollId === null) {
          let data = [
            {
              [module_id] : [session_id],
            },
          ];
          const updateEnl = await Enrollcourse.update(
            { view_history: data },
            { where: { id: updateEnroll.id } }
          );
          res.status(201).json("Data Inserted");
        } else {
          console.log("updatedddddd");
        }
      } else {
        console.log("Enrollment not found");
      }
      // res.status(201).json(updateEnroll);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};
