const db = require("../models");
const Follower = db.follower;
const User = db.user;

exports.follow = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      where: {
        id: req.userId,
      },
    });
    const follower = await Follower.create({
      leader: req.body.username,
      follower: currentUser.username,
    });
    res.status(201).send({ message: "Follower was added successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      where: {
        id: req.userId,
      },
    });
    await Follower.destroy({
      where: {
        leader: req.body.username,
        follower: currentUser.username,
      },
    });
    res.status(200).send({ message: "Follower was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
