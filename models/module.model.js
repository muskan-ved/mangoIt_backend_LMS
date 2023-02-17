const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Module extends Model {
        static associate(model) { }
    }

    Module.init(
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
            isDeleted : {
                type : DataTypes.BOOLEAN,
                defaultValue: false,
            },
            deletedBy : {
                type : DataTypes.INTEGER,
            }
        },
        {
            sequelize,
            modelName: 'modules'
        }
    )

    //  sequelize.sync( { force: true } ).then(() => {
    //     console.log('module table created successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })

      return Module
}
