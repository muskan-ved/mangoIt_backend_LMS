const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Site = db.Site;
const User = db.User;

exports.getAllSiteConfig = async (req, res) => {
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    const search = req.params.search;
    
  try {
    let allSiteConfig;
    if (search) {
     allSiteConfig = await Site.findAll({ where: {
        title: {
            [Op.like]: `%${search}%`
        },
        is_deleted: false,
    }, });
}else{
    allSiteConfig = await Site.findAll({ where: {    is_deleted: false,  }, });  
}
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
  const {title } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;

  let org_logo,org_favicon;

  if (req.files !== null) {
    org_logo = req?.files?.org_logo && req?.files?.org_logo[0].path;
    org_favicon = req?.files?.org_favicon && req?.files?.org_favicon[0].path;
  }

  try {
    const findUser = await User.findOne({ where: { id: login_user } });

    if (!findUser) {
      //Admin user
      const site_Create = await Site.create({
        user_id: login_user,
        title,
        org_logo,
        org_favicon,
        created_by: login_user,
      });
      res.status(201).json(site_Create);
    } else {
      res.status(404).json({ message: "User already inserted site configurations" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateSiteConfig = async (req, res) => {
  const siteId = req.params.id;

  const {
    title
  } = req.body;

  let org_logo,org_favicon;

  if (req.files !== null) {
    org_logo = req?.files?.org_logo && req?.files?.org_logo[0].path;
    org_favicon = req?.files?.org_favicon && req?.files?.org_favicon[0].path;
    
  }

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  try {
    const siteUpdate = await Site.update(
      {
        user_id: updated_by,
        title,
        org_logo,
        org_favicon,
        updated_by: updated_by,
      },
      { where: { id: siteId } }
    );

    const newUpdateSiteConfig = await Site.findOne({ where: { id: siteId } });
    res.status(201).json(newUpdateSiteConfig);
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
    res.status(200).json(siteConfigDeleted);
  } catch (e) {
    res.status(400).json(e);
  }
};
