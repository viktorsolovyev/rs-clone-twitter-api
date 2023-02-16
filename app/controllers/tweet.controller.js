const db = require("../models");
const Tweet = db.tweet;
const User = db.user;
const Follower = db.follower;
const Like = db.like;
const Media = db.media;

exports.add = async (req, res) => {
  try {
    const tweet = await Tweet.create({
      userId: req.userId,
      text: req.body.text,
      parentId: req.body.parentId ? req.body.parentId : null,
    });
    if (req.files) {
      const images = [];
      req.files.forEach((file) => {
        images.push({
          tweetId: tweet.id,
          type: file.mimetype,
          name: file.originalname,
          data: file.buffer,
        });
      });
      await Media.bulkCreate(images);
    }
    res.status(201).send({ message: "Tweet was added successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.get = async (req, res) => {
  const order = [["createdAt", "DESC"]];
  const offset = req.query.offset ? req.query.offset : 0;
  const limit = req.query.limit ? req.query.limit : 10;

  const username = req.query.username;
  const tweetId = req.query.tweetId;
  let tweets;

  if (tweetId) {
    tweets = await getTweets(req, order, offset, limit, { parentId: tweetId });
  } else if (username) {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      tweets = await getTweets(req, order, offset, limit, { userId: user.id });
    } else {
      tweets = [];
    }
  } else {
    const followings = await Follower.findAll({
      where: {
        follower: req.userId,
      },
    });
    const followingsId = followings.map((element) => element.leader);
    tweets = await getTweets(req, order, offset, limit, {
      userId: [req.userId, ...followingsId],
    });
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(tweets, null, 2));
};

async function getTweets(req, order, offset, limit, condition) {
  const tweets = await Tweet.findAll({
    order: order,
    offset: offset,
    limit: limit,
    where: condition,
    attributes: ["id", "parentId", "text", "createdAt"],
    include: [
      {
        model: User,
        attributes: ["name", "username"],
      },
    ],
    raw: true,
    nest: true,
  });

  for (let tweet of tweets) {
    // likes
    const amountLikes = await Like.count({
      where: {
        tweetId: tweet.id,
      },
    });
    tweet.likes = amountLikes;

    // liked
    const liked = await Like.findOne({
      where: {
        tweetId: tweet.id,
        userId: req.userId,
      },
    });
    tweet.liked = liked ? true : false;

    // replies
    const amountReplies = await Tweet.count({
      where: {
        parentId: tweet.id,
      },
    });
    tweet.replies = amountReplies;

    // images
    tweet.images = [];
    const images = await Media.findAll({
      where: {
        tweetId: tweet.id,
      },
    });
    for (let image of images) {
      tweet.images.push({
        type: image.type,
        name: image.name,
        data: image.data ? image.data.toString("base64") : "",
      });
    }
  }

  return tweets;
}
