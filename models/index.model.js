const Sequelize = require('sequelize')
require('dotenv').config()
const sequelize = new Sequelize (process.env.DATABASE, "root", process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.User = require("./user.model")(sequelize, Sequelize);
db.Course = require('./course.model')(sequelize, Sequelize)
db.Module = require('./module.model')(sequelize, Sequelize)
db.Session = require('./session.model')(sequelize, Sequelize)
db.Subscription = require('./subscription.model')(sequelize, Sequelize)

module.exports = db