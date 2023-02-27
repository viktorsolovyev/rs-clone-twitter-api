const controller = require("../controllers/like.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.post("/api/likes/", [authJwt.verifyToken], controller.like);
  app.delete("/api/likes/", [authJwt.verifyToken], controller.unlike);
};
