const { Sequelize } = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Transaction = sequelize.define(
    "Transaction",
    {
      TransactionId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        field: "TransactionId"
      },
      CardNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "CardNumber"
      },
      Amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Amount"
      }
    },
    {
      tableName: "Transaction"
    }
  );

  return Transaction;
};
