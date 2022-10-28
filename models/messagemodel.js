const getMessageModel = (sequelize, { DataTypes }) => {
    const Message = sequelize.define('message', {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    });
  
    return Message;
  };
  
  module.exports = getMessageModel;
  