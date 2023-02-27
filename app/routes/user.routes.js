const controller = require("../controllers/user.controller");
const { authJwt } = require("../middleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.get("/api/users/:username", [authJwt.verifyToken], controller.getUser);
  app.patch("/api/users/:username", [authJwt.verifyToken], controller.update);
  app.post(
    "/api/users/avatar",
    [authJwt.verifyToken, upload.single("avatar")],
    controller.changeAvatar
  );
};
