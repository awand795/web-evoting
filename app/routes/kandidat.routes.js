const { authJwt } = require("../middlewares");
const controller = require("../controllers/kandidat.controllers");
const multer = require("multer");
const path = require("path");

// Multer memory storage untuk Excel
const uploadExcel = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file Excel (.xlsx, .xls) yang diperbolehkan."));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Multer disk storage untuk foto & video
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__basedir, "resources", "static", "assets", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const uploadFoto = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diperbolehkan."));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadVideo = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file video yang diperbolehkan."));
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/kandidat", [authJwt.verifyToken], controller.getAllKandidat);

  app.get("/api/kandidat/template", [authJwt.verifyToken, authJwt.isAdmin], controller.downloadTemplate);

  app.get("/api/kandidat/:id", [authJwt.verifyToken], controller.getFindKandidat);

  app.post("/api/kandidat", [authJwt.verifyToken, authJwt.isAdmin], controller.createKandidat);

  app.post(
    "/api/kandidat/import-excel",
    [authJwt.verifyToken, authJwt.isAdmin, uploadExcel.single("file")],
    controller.importExcel
  );

  app.post(
    "/api/kandidat/:id/foto",
    [authJwt.verifyToken, authJwt.isAdmin, uploadFoto.single("foto")],
    controller.uploadFoto
  );

  app.post(
    "/api/kandidat/:id/video",
    [authJwt.verifyToken, authJwt.isAdmin, uploadVideo.single("video")],
    controller.uploadVideo
  );

  app.put("/api/kandidat/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.editKandidat);

  app.delete("/api/kandidat/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteKandidat);
};
