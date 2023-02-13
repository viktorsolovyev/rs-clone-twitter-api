const db = require("../models");
const User = db.user;
const Follower = db.follower;

exports.getUser = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    const amountFollowers = await Follower.count({
      where: {
        leader: username,
      },
    });
    const amountFollowing = await Follower.count({
      where: {
        follower: username,
      },
    });
    res.status(200).send({
      username: user.username,
      email: user.email,
      name: user.name,
      about: user.about,
      location: user.location,
      site: user.site,
      birthday: user.birthday,
      registration_date: user.createdAt,
      followers: amountFollowers,
      following: amountFollowing,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.update = (req, res) => {
  const username = req.params.username;

  User.findOne({
    where: {
      username: username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (user.id !== req.userId) {
        return res.status(403).send({ message: "Write access forbidden." });
      }
      User.update(req.body, {
        where: { username: username },
      }).then((num) => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update User with username=${username}. Maybe User was not found or req.body is empty!`,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error updating User with username=${username}`,
      });
    });
};
