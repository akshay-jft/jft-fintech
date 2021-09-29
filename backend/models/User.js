const { Sequelize, DataTypes } = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
    {
      UserId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        field: "UserId"
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Name"
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Email"
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Password"
      }
    },
    {
      tableName: "User",
      timestamps: false
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Children, {
      foreignKey: "ParentId"
    });
  };
  return User;
};
