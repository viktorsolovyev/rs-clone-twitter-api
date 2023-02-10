const controller = require("../controllers/user.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.get("/api/users/:username", [authJwt.verifyToken], controller.getUser);
};
