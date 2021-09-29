const { Sequelize, DataTypes } = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Card = sequelize.define(
    "Card",
    {
      CardId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        field: "CardId"
      },
      Type: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Type"
      },
      Number: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Number"
      },
      SecurityCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "SecurityCode"
      },
      ExpirationDate: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "ExpirationDate"
      },
      MonthlyLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "MonthlyLimit"
      },
      ChildrenCardId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "ChildrenCardId"
      },
      Balance: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Balance"
      }
    },
    {
      tableName: "Card",
      timestamps: false
    }
  );
  return Card;
};
