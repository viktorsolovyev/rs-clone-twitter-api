const db = require("../models");
const Tweet = db.tweet;
const User = db.user;
const Follower = db.follower;
const Like = db.like;
const Media = db.media;
const View = db.view;
const { Op } = require("sequelize");

exports.add = async (req, res) => {
  try {
    const tweet = await Tweet.create({
      userId: req.userId,
      text: req.body.text ? req.body.text : "",
      parentId: req.body.parentId ? req.body.parentId : null,
      isRetweet: req.body.isRetweet ? Boolean(req.body.isRetweet) : false,
    });
    if (req.files.length) {
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
  const order = [["id", "DESC"]];
  const offset = req.query.offset ? req.query.offset : 0;
  const limit = req.query.limit ? req.query.limit : 10;

  const username = req.query.username ? req.query.username : undefined;
  const tweetId = req.query.tweetId ? req.query.tweetId : undefined;
  let tweets;
  let countAndTweets;

  if (tweetId) {
    countAndTweets = await getTweets(req, order, offset, limit, {
      parentId: tweetId,
      isRetweet: {
        [Op.not]: true,
      },
    });
    tweets = countAndTweets.rows;
  } else if (username) {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      countAndTweets = await getTweets(req, order, offset, limit, {
        userId: user.id,
        [Op.or]: [
          { parentId: null },
          {
            isRetweet: true,
          },
        ],
      });
      tweets = countAndTweets.rows;
    } else {
      tweets = [];
    }
  } else {
    // const followings = await Follower.findAll({
    //   where: {
    //     follower: req.userId,
    //   },
    // });
    // const followingsId = followings.map((element) => element.leader);
    // const condition = {userId: [req.userId, ...followingsId],};
    countAndTweets = await getTweets(req, order, offset, limit, {
      [Op.or]: [
        { parentId: null },
        {
          parentId: { [Op.gt]: 0 },
          isRetweet: true,
        },
      ],
    });
    tweets = countAndTweets.rows;
  }

  res.setHeader("Content-Type", "application/json");
  res
    .status(200)
    .send(
      JSON.stringify({ count: countAndTweets.count, tweets: tweets }, null, 2)
    );
};

exports.delete = async (req, res) => {
  try {
    await Tweet.destroy({
      where: {
        id: req.body.tweetId,
        userId: req.userId,
      },
    });
    res.status(200).send({ message: "Tweet was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

async function getTweets(req, order, offset, limit, condition = {}) {
  const { count, rows } = await Tweet.findAndCountAll({
    order: order,
    offset: offset,
    limit: limit,
    where: condition,
    attributes: ["id", "parentId", "text", "createdAt", "isRetweet"],
    include: [
      {
        model: User,
        attributes: ["username", "name", "imageType", "imageName", "imageData"],
      },
    ],
    raw: true,
    nest: true,
  });

  for (let tweet of rows) {
    const tweetId = tweet.isRetweet ? tweet.parentId : tweet.id;

    // user avatar
    tweet.user.avatar = {
      imageType: tweet.user.imageType,
      imageName: tweet.user.imageName,
      imageData: tweet.user.imageData
        ? tweet.user.imageData.toString("base64")
        : "",
    };
    delete tweet.user.imageType;
    delete tweet.user.imageName;
    delete tweet.user.imageData;

    tweet.origin = {};
    if (tweet.isRetweet) {
      const origin = await Tweet.findOne({
        where: {
          id: tweet.parentId,
        },
        include: [
          {
            model: User,
            attributes: [
              "username",
              "name",
              "imageType",
              "imageName",
              "imageData",
            ],
          },
        ],
      });
      if (origin) {
        tweet.text = origin.text;
        tweet.origin.createdAt = origin.createdAt;
        tweet.origin.user = {
          username: origin.user.username,
          name: origin.user.name,
          avatar: {
            imageType: origin.user.imageType,
            imageName: origin.user.imageName,
            imageData: origin.user.imageData
              ? origin.user.imageData.toString("base64")
              : "",
          },
        };
      }
    }

    // likes
    const amountLikes = await Like.count({
      where: {
        tweetId: tweetId,
      },
    });
    tweet.likes = amountLikes;

    // liked
    const liked = await Like.findOne({
      where: {
        tweetId: tweetId,
        userId: req.userId,
      },
    });
    tweet.liked = liked ? true : false;

    // replies
    const amountReplies = await Tweet.count({
      where: {
        parentId: tweetId,
        isRetweet: {
          [Op.not]: true,
        },
      },
    });
    tweet.replies = amountReplies;

    // views
    const amountViews = await View.count({
      where: {
        tweetId: tweetId,
      },
    });
    tweet.views = amountViews;

    // viewed
    const viewed = await View.findOne({
      where: {
        tweetId: tweetId,
        userId: req.userId,
      },
    });
    tweet.viewed = viewed ? true : false;

    // retweets
    const amountRetweets = await Tweet.count({
      where: {
        parentId: tweetId,
        isRetweet: true,
      },
    });
    tweet.retweets = amountRetweets;

    // retweeted
    const retweeted = await Tweet.findOne({
      where: {
        parentId: tweetId,
        userId: req.userId,
        isRetweet: true,
      },
    });
    tweet.retweeted = retweeted ? true : false;

    // images
    tweet.images = [];
    const images = await Media.findAll({
      where: {
        tweetId: tweetId,
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

  return { count, rows };
}
