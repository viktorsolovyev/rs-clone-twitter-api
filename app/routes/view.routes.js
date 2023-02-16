const controller = require("../controllers/view.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.post("/api/views/", [authJwt.verifyToken], controller.view);  
};
