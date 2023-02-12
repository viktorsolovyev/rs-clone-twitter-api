const db = require("../models");
const Tweet = db.tweet;
const User = db.user;

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

exports.get = (req, res) => {
  User.findOne({
    where: {
      id: req.userId,
    },
  }).then((user) => {
    Tweet.findAll({
      order: [["createdAt", "DESC"]],
      offset: req.params.offset ? req.params.offset : 0,
      limit: req.params.limit ? req.params.limit : 10,
      where: {
        userId: user.id,
      },
    })
      .then((tweets) => {
        res.status(200).send(JSON.stringify(tweets, null, 2));
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  });
};
