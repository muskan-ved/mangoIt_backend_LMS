const db = require("../models/index.model");

//function for get stripe key
exports.getStripeKeys = async () => {
  var attributes = ["key", "value"];
  stripeKeys = await db.Site.findAll({
    where: { key: `org_sk` },
    attributes: attributes,
  });
  return stripeKeys;
};
