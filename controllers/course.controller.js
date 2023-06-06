const db = require("../models/index.model");
require("dotenv").config;
const fs = require("fs");
const jsonwebtoken = require("jsonwebtoken");
const Course = db.Course;
const Module = db.Module;
const Session = db.Session;

exports.getCourses = async (req, res) => {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const search = req.params.search;
  const { is_chargeable, status } = req.body;

  try {
    if (search) {
      const courses = await Course.findAll({
        where: {
          title: {
            [Op.like]: `%${search}%`,
          },
          is_deleted: false,
        },
      });
      const moduleCounts = await Module.findAll({
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

      const combinedArray = courses.map((course) => {
        const sessionCount = sessionCounts.filter((count) =>
          count.course_id !== course.id
            ? count.sessionCount
            : { sessionCount: 0 }
        );
        const moduleCount = moduleCounts.filter((count) =>
          count.course_id !== course.id ? count.moduleCount : { moduleCount: 0 }
        );
        return {
          course,
          sessionCount: sessionCount,
          moduleCount: moduleCount,
        };
      });
      res.status(200).json(combinedArray);
    } else if (
      (is_chargeable !== null && status !== null) ||
      (is_chargeable !== undefined && status !== undefined)
    ) {
      const courses = await Course.findAll({
        where: {
          is_deleted: false,
          is_chargeable,
          status,
        },
      });
      const moduleCounts = await Module.findAll({
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

      const combinedArray = courses.map((course) => {
        const sessionCount = sessionCounts.filter((count) =>
          count.course_id !== course.id
            ? count.sessionCount
            : { sessionCount: 0 }
        );
        const moduleCount = moduleCounts.filter((count) =>
          count.course_id !== course.id ? count.moduleCount : { moduleCount: 0 }
        );
        return {
          course,
          sessionCount: sessionCount,
          moduleCount: moduleCount,
        };
      });
      res.status(200).json(combinedArray);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getCourseById = async (req, res) => {
  // res.send('course by id')
  const courseId = req.params.id;
  try {
    const courseById = await Course.findOne({
      where: { id: courseId, is_deleted: false },
    });

    // const users = await sequelize.query(
    //   "SELECT  COUNT(`course_id`) AS `moduleCount` FROM `modules` where course_id = 5`",
    //   { type: QueryTypes.SELECT }
    // );

    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@", users);

    // const moduleCounts = await Module.findOne({
    //   attributes: [
    //     "course_id",
    //     [Sequelize.fn("COUNT", Sequelize.col("course_id")), "moduleCount"],
    //   ],
    //   where: { course_id: courseId },
    // });

    // const moduleCountsMap = new Map();
    // moduleCounts.forEach((count) => {
    //   moduleCountsMap.set(count.course_id, count.moduleCount);
    // });

  

    // const sessionCounts = await Session.findAll({
    //   attributes: [
    //     "course_id",
    //     [Sequelize.fn("COUNT", Sequelize.col("course_id")), "sessionCount"],
    //   ],
    //   where: { course_id: courseId },
    // });
    // const sessionCountsMap = new Map();
    // sessionCounts.forEach((count) => {
    //   sessionCountsMap.set(count.course_id, count.sessionCount);
    // });

    if (courseById) {
      res.status(200).json(courseById);
    }
    if (!courseById) {
      res.status(404).json("Course not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getCourseBySearch = async (req, res) => {
  // res.send("course Serache")
  try {
    const Sequelize = require("sequelize");
    const Op = Sequelize.Op;
    const search = req.params.search;
    const courseSerached = await Course.findAll({
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
        is_deleted: false,
      },
    });
    res
      .status(200)
      .send({ courseSerached, totalCourses: courseSerached.length });
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createCourse = async (req, res) => {
  const { title, long_description, short_description, status, is_chargeable } =
    req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const user_id = decode.id;

  // const trailer_url = req.file.path

  try {
    courseCreated = await Course.create({
      title,
      short_description,
      long_description,
      status,
      is_chargeable,
      // trailer_url,
      user_id,
      created_by: user_id,
    });

    res.status(201).json(courseCreated);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.updateCourse = async (req, res) => {
  const { title, long_description, short_description, status, is_chargeable } =
    req.body;

  const courseId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const user_id = decode.id;

  try {
    courseUpdate = await Course.update(
      {
        title,
        short_description,
        long_description,
        status,
        is_chargeable,
        user_id,
        updated_by: user_id,
      },
      { where: { id: courseId } }
    );

    const updatedCourse = await Course.findOne({ where: { id: courseId } });
    res.status(201).json(updatedCourse);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;
  try {
    findCourse = await Course.findOne({ where: { id: courseId } });
    if (findCourse) {
      const isDeleted = await Course.update(
        { is_deleted: true, deleted_by: deleted_by },
        { where: { id: courseId } }
      );
      const courseDeleted = await Course.findOne({ where: { id: courseId } });

      const moduleDelete = await Module.update(
        { is_deleted: true, deleted_by: deleted_by },
        { where: { course_id: courseId } }
      );
      const findModuleDeleted = await Module.findOne({
        where: { course_id: courseId },
      });

      const moduleDeletedId = findModuleDeleted.id;
      const sessionDeleted = await Session.update(
        { is_deleted: true, deleted_by: deleted_by },
        { where: { module_id: moduleDeletedId } }
      );
      const findSesssionDeleted = await Session.findOne({
        where: { module_id: moduleDeletedId },
      });

      res.status(200).send({
        courseDeleted: courseDeleted,
        moduleDelete: findModuleDeleted,
        sessionDeleted: findSesssionDeleted,
      });
    }

    if (!findCourse) {
      res.status(404).json("This course not available");
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getCourseByIdConn = async (req, res) => {
  const courseId = req.params.id;
  try {
    const courseById = await Course.findOne({
      where: { id: courseId, is_deleted: false },
      include: [
        {
          model: Module,
          include: [
            {
              model: Session,
              where: { course_id: courseId },
            },
          ],
        },
      ],
    });

    if (courseById) {
      res.status(200).json(courseById);
    }
    if (!courseById) {
      res.status(404).json("Course not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.DownloadReceiptAfterPay = async (req, res) => {
  const { imagename } = req.body;

  if (imagename) {
    var filePath = `${imagename}`;
    fs.access(filePath, fs.constants.F_OK, async (err) => {
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  }
};
