const config = require("../config/db.config.js");
const initUser = require("../models/user.model.js");
const initTweet = require("../models/tweet.model.js");
const initMedia = require("../models/media.model.js");
const initFollower = require("../models/follower.model");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = initUser(sequelize, Sequelize);
db.tweet = initTweet(sequelize, Sequelize);
db.media = initMedia(sequelize, Sequelize);
db.follower = initFollower(sequelize, Sequelize);

db.user.hasMany(db.tweet, { onDelete: "cascade" });
db.tweet.belongsTo(db.user);

db.tweet.hasMany(db.media, { onDelete: "cascade" });
db.media.belongsTo(db.tweet);

module.exports = db;
