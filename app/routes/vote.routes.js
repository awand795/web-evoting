const { authJwt } = require("../middlewares");
const controller = require("../controllers/vote.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // User cast vote
  app.post("/api/vote", [authJwt.verifyToken], controller.castVote);

  // Cek status vote user yang sedang login
  app.get("/api/vote/status", [authJwt.verifyToken], controller.getVoteStatus);

  // Hasil voting - semua user terautentikasi bisa lihat
  app.get("/api/hasil", [authJwt.verifyToken], controller.getHasil);
};
