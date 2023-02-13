const db = require("../models");
const Like = db.like;

exports.like = async (req, res) => {
  try {
    await Like.create({
      tweetId: req.body.tweetId,
      userId: req.userId,
    });
    res.status(201).send({ message: "Like was added successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.unlike = async (req, res) => {
  try {
    await Like.destroy({
      where: {
        tweetId: req.body.tweetId,
        userId: req.userId,
      },
    });
    res.status(200).send({ message: "Like was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
