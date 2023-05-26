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
  const userId = req.params.id;
  console.log(userId,"4444443 id")
  try {
    const siteById = await Site.findOne({
      where: { user_id: userId, is_deleted: false },
    });


      res.status(200).json(siteById);
   
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createSiteConfig = async (req, res) => {
 
console.log(req.files,"valeue",req.body,typeof req.body.data);
  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;

  const dataFormatted = []
  let org_logo,org_favicon;

  if (req.files !== null) {
    org_logo = req?.files?.org_logo && req?.files?.org_logo[0].path;
    org_favicon = req?.files?.org_favicon && req?.files?.org_favicon[0].path;
  }

  for (let index = 0; index < 3; index++) {
    console.log(req?.body[index],"[index]")
    // const element = array[index];
  }




  // try {
  //   // const findUser = await Site.findOne({ where: { user_id: login_user } });

  //   // if (!findUser) {
  //     //Admin user
  //     const site_Create = await Site.create({
  //       user_id: login_user,
  //       key,
  //       value,
  //       // org_favicon,
  //       created_by: login_user,
  //     });
      res.status(201).json('ok');
  //   // } else {
  //   //   res.status(400).json({ message: "User already inserted site configurations" });
  //   // }
  // } catch (e) {
  //   res.status(400).json(e);
  // }
};

exports.updateSiteConfig = async (req, res) => {
  const siteId = req.params.id;
  console.log(siteId,"site Id",req.files)

  const {
    title
  } = req.body;

  let org_logoo,org_favicoon;

  if (req.files !== null) {
    org_logoo = req?.files?.org_logo && req?.files?.org_logo[0].path;
    org_favicoon = req?.files?.org_favicon && req?.files?.org_favicon[0].path;
  }

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

console.log(org_logoo,org_favicoon,"orglggo",updated_by)
  try {
    const siteUpdate = await Site.update(
      {
        title,
        org_logo:org_logoo,
        org_favicon:org_favicoon,
        user_id: updated_by,
        updated_by: updated_by,
      },
      { where: { id: siteId } }
    );

    const newUpdateSiteConfig = await Site.findOne({ where: { id: siteId } });
    console.log(newUpdateSiteConfig,siteUpdate,"333333333333333333")
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
