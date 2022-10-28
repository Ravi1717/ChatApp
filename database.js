const Sequelize = require ('sequelize');
require("dotenv").config();

const getUserModel = require('./models/usersmodel')
const getMessageModel =  require('./models/messagemodel');
const getChatUserModel = require('./models/chatusermodel');

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);

const models = {
  User: getUserModel(sequelize, Sequelize),
  Message: getMessageModel(sequelize, Sequelize),
  chatUser: getChatUserModel(sequelize, Sequelize)
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };

