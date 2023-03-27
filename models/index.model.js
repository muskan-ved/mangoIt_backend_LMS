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
db.Order = require('./order.model')(sequelize,Sequelize)
db.Transaction = require('./tranaction.model')(sequelize,Sequelize)
db.Enrollcourse = require('./enrollcourse.model')(sequelize,Sequelize)
db.Payment = require('./payment.model')(sequelize,Sequelize)
db.Token = require('./token.model')(sequelize,Sequelize)

//export deb
module.exports = db