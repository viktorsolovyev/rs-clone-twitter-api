const controller = require("../controllers/tweet.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.post("/api/tweets/", [authJwt.verifyToken], controller.add);
  app.get("/api/tweets/", [authJwt.verifyToken], controller.get);
};
