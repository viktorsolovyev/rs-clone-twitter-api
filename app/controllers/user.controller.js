const db = require("../models");
const User = db.user;
const Follower = db.follower;
const Tweet = db.tweet;

exports.getUser = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await exports.getUserProfileByUsername(username);
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    res.status(200).send(user);
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

exports.changeAvatar = async (req, res) => {
  try {
    const num = await User.update(
      {
        imageType: req.file.mimetype,
        imageName: req.file.originalname,
        imageData: req.file.buffer,
      },
      {
        where: { id: req.userId },
      }
    );
    if (num.length === 1) {
      res.status(200).send({
        message: "Avatar was updated successfully.",
      });
    } else {
      res.status(500).send({
        message: `Cannot update avatar!`,
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getUserProfileByUsername = async (username) => {
  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  if (!user) {
    return undefined;
  }

  // followers
  const followers = await Follower.findAll({
    where: {
      leader: user.id,
    },
    raw: true,
    nest: true,
  });
  const followersIds = followers.map((follower) => follower.follower);
  let followersUsers = await User.findAll({
    where: {
      id: followersIds,
    },
    attributes: ["username", "name", "imageType", "imageName", "imageData"],
    raw: true,
    nest: true,
  });

  followersUsers = followersUsers.map((follower) => {
    return {
      username: follower.username,
      name: follower.name,
      avatar: {
        imageType: follower.imageType,
        imageName: follower.imageName,
        imageData: follower.imageData
          ? follower.imageData.toString("base64")
          : "",
      },
    };
  });

  // following
  const following = await Follower.findAll({
    where: {
      follower: user.id,
    },
    raw: true,
    nest: true,
  });
  const followingIds = following.map((follow) => follow.leader);
  let followingUsers = await User.findAll({
    where: {
      id: followingIds,
    },
    attributes: ["username", "name", "imageType", "imageName", "imageData"],
    raw: true,
    nest: true,
  });

  followingUsers = followingUsers.map((follow) => {
    return {
      username: follow.username,
      name: follow.name,
      avatar: {
        imageType: follow.imageType,
        imageName: follow.imageName,
        imageData: follow.imageData ? follow.imageData.toString("base64") : "",
      },
    };
  });

  // tweets
  const totalTweets = await Tweet.count({
    where: {
      userId: user.id,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    about: user.about ? user.about : "",
    location: user.location ? user.location : "",
    site: user.site ? user.site : "",
    birthday: user.birthday,
    registration_date: user.createdAt,
    followers: followersUsers,
    following: followingUsers,
    tweets: totalTweets,
    avatar: {
      imageType: user.imageType,
      imageName: user.imageName,
      imageData: user.imageData ? user.imageData.toString("base64") : "",
    },
  };
};
