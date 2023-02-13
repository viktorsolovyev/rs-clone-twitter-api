const controller = require("../controllers/follower.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.post("/api/followers/", [authJwt.verifyToken], controller.follow);
  app.delete("/api/followers/", [authJwt.verifyToken], controller.unfollow);
};
