const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Site = db.Site;
const User = db.User;

exports.getAllSiteConfig = async (req, res) => {
  try {
    const allSiteConfig = await Site.findAll({ where: { is_deleted: false } });
    res.status(200).json(allSiteConfig);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSiteConfigById = async (req, res) => {
  const siteId = req.params.id;
  try {
    const siteById = await Site.findOne({
      where: { id: siteId, is_deleted: false },
    });

    if (siteById) {
      res.status(200).json(siteById);
    }
    if (!siteById) {
      res.status(404).json("Id not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createSiteConfig = async (req, res) => {
  const { key, value } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;
console.log(req.file,"$4444444444444444",req.body)
//   let attachment_file;
//   if (req.file) {
//     attachment_file = req.file.path;
//   }

  try {
    const findUser = await User.findOne({ where: { id: login_user } });

    if (findUser.role_id == 1) {
      //Admin user
      const site_Create = await Site.create({
        user_id: login_user,
        key: key,
        value: value,
        created_by: login_user,
      });
      res.json(site_Create);
    } else {
      res.json({ message: "Only admins can create" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateSiteConfig = async (req, res) => {
  const siteId = req.params.id;

  const {
    user_id: user_id,
   key,
   value
  } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  try {
    const siteUpdate = await Site.update(
      {
        user_id: user_id,
        key:key,
        value:value,
        updated_by: updated_by,
      },
      { where: { id: siteId } }
    );

    const newUpdateSiteConfig = await Site.findOne({ where: { id: siteId } });
    res.json(newUpdateSiteConfig);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.deleteSiteConfig = async (req, res) => {
  const siteId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;

  try {
    const siteConfigDelete = await Site.update(
      {
        is_deleted: true,
        deleted_by: deleted_by,
      },
      { where: { id: siteId } }
    );

    const siteConfigDeleted = await Site.findOne({ where: { id: siteId } });
    res.json(siteConfigDeleted);
  } catch (e) {
    res.status(400).json(e);
  }
};
