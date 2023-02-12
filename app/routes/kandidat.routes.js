const { authJwt } = require("../middlewares");
const controller = require('../controllers/kandidat.controllers');
const { isAdmin } = require("../middlewares/authJwt");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/kandidat", [authJwt.verifyToken, isAdmin] ,controller.getAllKandidat);

  app.get("/api/kandidat/:id", [authJwt.verifyToken, isAdmin], controller.getFindKandidat);

  app.post("/api/kandidat", [authJwt.verifyToken, isAdmin], controller.createKandidat);

  app.put("/api/kandidat/:id", [authJwt.verifyToken, isAdmin], controller.editKandidat);

  app.delete("/api/kandidat/:id", [authJwt.verifyToken, isAdmin], controller.deleteKandidat);
};
