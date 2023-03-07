const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(model) { }
    }

    Course.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            title: {
                type: DataTypes.STRING,
                // allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
            trailer_url: {
                type: DataTypes.STRING,
            },
            isVisible: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isChargeable: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            created_by: {
                type: DataTypes.INTEGER,
            },
            updated_by: {
                type: DataTypes.INTEGER,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            deleted_by: {
                type: DataTypes.INTEGER,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'courses'
        }
    )

    //  sequelize.sync( {  alter: true } ).then(() => {
    //     console.log('course table alter successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })


    return Course
}
