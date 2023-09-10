const { DataTypes } = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('User', {
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        group: {
            type: DataTypes.STRING,
        }
    });
}