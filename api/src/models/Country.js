const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

  sequelize.define('country', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag_icon: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    continent: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capital: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sub_region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    area: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
  });
};
