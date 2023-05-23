const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Site extends Model {
        static assocaite(model) { }
    }

    Site.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            key: {
                type: DataTypes.STRING,
            },
            
            value: {
                type: DataTypes.STRING,
            },
            user_id: {
                type: DataTypes.INTEGER,
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
                defaultValue: 0,
            }
        },
        {
            sequelize,
            modelName: 'site-options'
        }
    )


    return Site
}
