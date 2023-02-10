const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Op = db.Sequelize.Op;

exports.signup = (req, res) => {
  // save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.name,
    about: req.body.about,
    location: req.body.location,
    site: req.body.site,
    birthday: req.body.birthday,
  })
    .then((user) => {
        res.status(200).send({ message: "User was registered successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        about: user.about,
        location: user.location,
        site: user.site,
        birthday: user.birthday,
        registration_date: user.createdAt,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
