const controller = require("../controllers/tweet.controller");
const { authJwt } = require("../middleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.post("/api/tweets/", [authJwt.verifyToken, upload.array("images")], controller.add);
  app.get("/api/tweets/", [authJwt.verifyToken], controller.get);
  app.delete("/api/tweets/", [authJwt.verifyToken], controller.delete);
};
