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
            module_id: {
                type: DataTypes.INTEGER,
            },
            uploads : {
                type : DataTypes.STRING,
            } 

        },
        {
            sequelize,
            modelName: "session"
        }
    )

    //    sequelize.sync( { force: true } ).then(() => {
    //     console.log('session table created successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })


    return Session

}