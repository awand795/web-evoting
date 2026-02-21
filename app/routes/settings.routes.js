const { authJwt } = require("../middlewares");
const controller = require("../controllers/settings.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/settings", [authJwt.verifyToken, authJwt.isAdmin], controller.getSettingsStatus);

  // Fixed: was incorrectly /api/kandidat/:id
  app.put("/api/settings/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.editSettings);
};
