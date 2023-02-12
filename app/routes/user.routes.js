const { authJwt } = require("../middlewares");
const controller = require('../controllers/user.controller')
const { isAdmin } = require("../middlewares/authJwt");
const controller2 = require('../controllers/auth.controller')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/user", [authJwt.verifyToken, isAdmin] ,controller.getAllUser);

  app.get("/api/user/:id", [authJwt.verifyToken, isAdmin], controller.getFindUser);

  app.post("/api/user", [authJwt.verifyToken, isAdmin], controller2.signup);

  app.put("/api/user/:id", [authJwt.verifyToken, isAdmin], controller.editUser);

  app.delete("/api/user/:id", [authJwt.verifyToken, isAdmin], controller.deleteUser);
};
