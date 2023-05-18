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

// User.hasMany(Invoice);
// Invoice.belongsTo(User);

db.Course.hasMany(db.Session, {foreignKey: 'course_id'});
db.Session.belongsTo(db.Course, {foreignKey: 'course_id'})

db.Module.hasMany(db.Session, {foreignKey: 'module_id'});
db.Session.belongsTo(db.Module, {foreignKey: 'module_id'})

db.Course.hasMany(db.Module, {foreignKey: 'course_id'});
db.Module.belongsTo(db.Course, {foreignKey: 'course_id'})

// db.Session.hasMany(db.Module, {foreignKey: 'session_id'});
// db.Module.belongsTo(db.Session, {foreignKey: 'session_id'})


//export deb
module.exports = db
