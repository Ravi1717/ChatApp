const getChatUserModel = (sequelize, { DataTypes }) => {
    const userChat = sequelize.define('chatuser', {
      socketId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      room:{
        type: DataTypes.STRING,
        allowNull: true,
      }
    });
  
    return userChat;
  };
  
  module.exports= getChatUserModel;