const db = require("../models");
const User = db.user;

exports.getUser = (req, res) => {
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
      res.status(200).send({
        username: user.username,
        email: user.email,
        name: user.name,
        about: user.about,
        location: user.location,
        site: user.site,
        birthday: user.birthday,
        registration_date: user.createdAt,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
