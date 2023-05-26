const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Site = db.Site;
const User = db.User;

exports.getAllSiteConfig = async (req, res) => {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const search = req.params.search;

  try {
    let allSiteConfig;
    if (search) {
      allSiteConfig = await Site.findAll({
        where: {
          title: {
            [Op.like]: `%${search}%`,
          },
          is_deleted: false,
        },
      });
    } else {
      allSiteConfig = await Site.findAll({ where: { is_deleted: false } });
    }
    res.status(200).json(allSiteConfig);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSiteConfigById = async (req, res) => {
  const userId = req.params.id;
  console.log(userId, "4444443 id");
  try {
    const siteById = await Site.findAll({
      where: { user_id: userId, is_deleted: false },
    });

    res.status(200).json(siteById);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createSiteConfig = async (req, res) => {

  let org_logo, org_favicon, site_Create;
  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;


  if (req.files !== null) {
    org_logo = req?.files?.org_logo && req?.files?.org_logo[0].path;
    org_favicon = req?.files?.org_favicon && req?.files?.org_favicon[0].path;
  }

  const obj = {
    title: req.body.title,
    org_logo: org_logo,
    org_favicon: org_favicon,
  };

  const arrayOfObjects = Object.entries(obj).map(([key, value]) => ({
    key,
    value,
  }));

  try {
    const findUser = await Site.findOne({ where: { user_id: login_user } });
    if (!findUser) {
      for (let index = 0; index < arrayOfObjects.length; index++) {
        console.log(arrayOfObjects[index], "[index]");
        site_Create = await Site.create({
          user_id: login_user,
          key: arrayOfObjects[index].key,
          value: arrayOfObjects[index].value,
          created_by: login_user,
        });
      }
      res.status(201).json(site_Create);
    } else {
      res
        .status(400)
        .json({ message: "User already inserted site configurations" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateSiteConfig = async (req, res) => {
  let org_logo, org_favicon;

  if (req.files !== null) {
    org_logo = req?.files?.org_logo && req?.files?.org_logo[0].path;
    org_favicon = req?.files?.org_favicon && req?.files?.org_favicon[0].path;
  }

  const obj = {
    title: req.body.title,
    org_logo: org_logo,
    org_favicon: org_favicon,
  };

  const arrayOfObjects = Object.entries(obj).map(([key, value]) => ({
    key,
    value,
  }));

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;
  
  try {
    for (let index = 0; index < arrayOfObjects.length; index++) {
     
      const siteOption = await Site.findOne({
        where: { key: arrayOfObjects[index].key },
        attributes: ['id']
      });
console.log(siteOption,"site option")
      if (siteOption) {
        const siteId = siteOption.id;

     await Site.update(
      {
        key: arrayOfObjects[index].key,
        value: arrayOfObjects[index].value,
        user_id: updated_by,
        updated_by: updated_by,
      },
      { where: { id: siteId } }
    );
    }else {
      console.log(`Site-option with key ${key} not found.`);
    }
  
  }
    const newUpdateSiteConfig = await Site.findAll({ where: { user_id: updated_by ,is_deleted: false} });
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
