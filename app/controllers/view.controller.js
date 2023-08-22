const db = require("../models");
const View = db.view;

exports.view = async (req, res) => {
  try {
    await View.findOrCreate({
      where: {
        tweetId: req.body.tweetId,
        userId: req.userId,
      },
    });
    res.status(201).send({ message: "View was added successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
