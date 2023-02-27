const db = require("../models");
const Follower = db.follower;
const User = db.user;

exports.follow = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    await Follower.findOrCreate({
      where: {
         leader: user.id,
         follower: req.userId,
      },
    });
    res.status(201).send({ message: "Follower was added successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    await Follower.destroy({
      where: {
        leader: user.id,
        follower: req.userId,
      },
    });
    res.status(200).send({ message: "Follower was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
