const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Session extends Model {
        static associate(model) { }
    }

    Session.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            title: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            course_id: {
                type: DataTypes.INTEGER,
            },
            module_id: {
                type: DataTypes.INTEGER,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            type: {
                type: DataTypes.STRING,
            },
            attachment : {
                type : DataTypes.STRING,
            },
            created_by: {
                type: DataTypes.INTEGER,
            },
            updated_by: {
                type: DataTypes.INTEGER,
            },
            is_deleted: {
                type : DataTypes.BOOLEAN,
                defaultValue: false,
            },
            deleted_by :{
                type: DataTypes.INTEGER,
            }
        },
        {
            sequelize,
            modelName: "session"
        }
    )

    //    sequelize.sync( { alter: true } ).then(() => {
    //     console.log('session table created successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })


    return Session

}