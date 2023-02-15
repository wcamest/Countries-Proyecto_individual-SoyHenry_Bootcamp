const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('activity', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        difficulty: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        duration: {
            type: DataTypes.TIME,
            defaultValue: "00:00:00",
            allowNull: false
        },
        season : {
            type: DataTypes.ENUM(["summer", "autumn", "winter", "spring"])
        }
    },{
        timestamps: false
    });
}