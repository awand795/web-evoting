const { authJwt } = require("../middlewares");
const controller = require("../controllers/kandidat.controllers");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/kandidat", [authJwt.verifyToken], controller.getAllKandidat);

  app.get("/api/kandidat/:id", [authJwt.verifyToken], controller.getFindKandidat);

  app.post("/api/kandidat", [authJwt.verifyToken, authJwt.isAdmin], controller.createKandidat);

  app.put("/api/kandidat/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.editKandidat);

  app.delete("/api/kandidat/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteKandidat);
};
