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
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            
            org_logo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            org_favicon: {
                type: DataTypes.STRING,
                allowNull: false,
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
    // sequelize.sync( {  alter: true } ).then(() => {
    //     console.log(' table alter successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })

    return Site
}
