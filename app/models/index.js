const config = require("../config/db.config.js");
const initUser = require("../models/user.model.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres:fHlx86Zyjvew7K3sRjI2@containers-us-west-97.railway.app:6487/railway");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = initUser(sequelize, Sequelize);

module.exports = db;
