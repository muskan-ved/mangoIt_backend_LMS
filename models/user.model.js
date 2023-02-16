'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {

    class User extends Model {
        static associate(model){}
    }
    User.init({
            id : {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            first_name : {
                type: DataTypes.STRING,
            },
            last_name : {
                type: DataTypes.STRING,
            },
            email : {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            password : {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role_id : {
                type: DataTypes.INTEGER,
            },

        },
        {
            sequelize,
            modelName: "users"
        })
    // sequelize.sync( { force: true } ).then(() => {
    //     console.log('User table created successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })

    return User
}
