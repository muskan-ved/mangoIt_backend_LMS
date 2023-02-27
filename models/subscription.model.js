const { Model, STRING } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Subscription extends Model {
        static associate(model) { }
    }

    Subscription.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            price: {
                type: DataTypes.FLOAT,
            },
            duration_term: {
                type: DataTypes.STRING,
            },
            duration_value: {
                type: DataTypes.INTEGER,
            },
            created_by: {
                type: DataTypes.STRING,
            },
            updated_by: {
                type: DataTypes.STRING,
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            deletedBy: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'subscription'
        }
    )

    //    sequelize.sync( { force: true } ).then(() => {
    //         console.log('subscribtion table created successfully!');
    //       }).catch((error) => {
    //         console.error('Unable to create table : ', error);
    //       })


    return Subscription
}
