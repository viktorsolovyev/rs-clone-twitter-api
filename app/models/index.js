const config = require("../config/db.config.js");
const initUser = require("../models/user.model.js");
const initTweet = require("../models/tweet.model.js");
const initMedia = require("../models/media.model.js");
const initFollower = require("../models/follower.model");
const initLike = require("../models/like.model");
const initView = require("../models/view.model");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://root:a4pDPjMC2iYmw9jqJsKZ9hppgacKRvDH@dpg-cftstt94reb6ks1nkar0-a.frankfurt-postgres.render.com/tweetter");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = initUser(sequelize, Sequelize);
db.tweet = initTweet(sequelize, Sequelize);
db.media = initMedia(sequelize, Sequelize);
db.follower = initFollower(sequelize, Sequelize);
db.like = initLike(sequelize, Sequelize);
db.view = initView(sequelize, Sequelize);

db.user.hasMany(db.tweet, { onDelete: "cascade" });
db.tweet.belongsTo(db.user);

db.tweet.hasMany(db.media, { onDelete: "cascade" });
db.media.belongsTo(db.tweet);

// likes
db.tweet.hasMany(db.like, { onDelete: "cascade" });
db.like.belongsTo(db.tweet);
db.user.hasMany(db.like, { onDelete: "cascade" });
db.like.belongsTo(db.user);

// views
db.tweet.hasMany(db.view, { onDelete: "cascade" });
db.view.belongsTo(db.tweet);
db.user.hasMany(db.view, { onDelete: "cascade" });
db.view.belongsTo(db.user);

module.exports = db;
