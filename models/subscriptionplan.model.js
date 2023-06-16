const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SubscriptionPlan extends Model {
    static associate(model) {}
  }

  SubscriptionPlan.init(
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

      amount: {
        type: DataTypes.FLOAT,
      },
      duration_term: {
        type: DataTypes.STRING,
      },
      duration_value: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "subscription-plan",
    }
  );
  return SubscriptionPlan;
};
