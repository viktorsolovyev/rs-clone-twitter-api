const config = require("../config/db.config.js");
const initUser = require("../models/user.model.js");
const initTweet = require("../models/tweet.model.js");
const initMedia = require("../models/media.model.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgresql://postgres:fHlx86Zyjvew7K3sRjI2@containers-us-west-97.railway.app:6487/railway");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = initUser(sequelize, Sequelize);
db.tweet = initTweet(sequelize, Sequelize);
db.media = initMedia(sequelize, Sequelize);

db.user.hasMany(db.tweet, { onDelete: "cascade" });
db.tweet.belongsTo(db.user);

db.tweet.hasMany(db.media, { onDelete: "cascade" });
db.media.belongsTo(db.tweet);

module.exports = db;
