const util = require("util");
const multer = require("multer");
const path = require("path");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__basedir, "resources", "static", "assets", "uploads"));
  },
  filename: (req, file, cb) => {
    // Add timestamp to prevent filename conflicts
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
