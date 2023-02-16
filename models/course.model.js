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
                type: DataTypes.STRING
            },
            isVisible: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isChargeable: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
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

    //  sequelize.sync( { force: true } ).then(() => {
    //     console.log('course table created successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })


    return Course
}
