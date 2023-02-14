const db = require("../models");
const Tweet = db.tweet;
const User = db.user;
const Follower = db.follower;
const Like = db.like;

exports.add = (req, res) => {
  // save Tweet to Database
  Tweet.create({
    userId: req.userId,
    text: req.body.text,
  })
    .then((tweet) => {
      res.status(201).send({ message: "Tweet was added successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.get = async (req, res) => {
  const username = req.query.username;
  const userIds = [];

  if (!username) {
    const followings = await Follower.findAll({
      where: {
        follower: req.userId,
      },
    });
    const followingsId = followings.map((element) => element.leader);
    userIds.push(req.userId);
    userIds.push(...followingsId);
  } else {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    userIds.push(user.id);
  }

  const tweets = await Tweet.findAll({
    order: [["createdAt", "DESC"]],
    offset: req.query.offset ? req.query.offset : 0,
    limit: req.query.limit ? req.query.limit : 10,
    where: {
      userId: userIds,
    },
    attributes: ["id", "parent_ID", "text", "createdAt"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
    raw: true,
    nest: true,
  });

  for (let tweet of tweets) {
    const amountLikes = await Like.count({
      where: {
        tweetId: tweet.id,
      },
    });

    const liked = await Like.findOne({
      where: {
        tweetId: tweet.id,
        userId: req.userId,
      },
    });

    tweet.likes = amountLikes;
    tweet.liked = liked ? true : false;
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(tweets, null, 2));
};
