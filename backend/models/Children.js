const { Sequelize, DataTypes } = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Children = sequelize.define(
    "Children",
    {
      ChildrenId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        field: "ChildrenId"
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Name"
      },
      Age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Age"
      },
      ParentId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "ParentId"
      }
    },
    {
      tableName: "Children",
      timestamps: false
    }
  );
  
  Children.associate = (models) => {
    Children.hasMany(models.Card, {
      foreignKey: "ChildrenCardId"
    }); 
  };
  
  return Children;
};
