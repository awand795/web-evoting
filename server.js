require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS configuration
var corsOptions = {
  origin: function(origin, callback) {
    // Izinkan semua localhost (untuk development)
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["x-access-token", "Origin", "Content-Type", "Accept"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Set base directory for file uploads
global.__basedir = __dirname;

// Serve uploaded files statically
app.use("/resources", express.static(path.join(__dirname, "resources")));

const db = require("./app/models");
const Role = db.role;
const Settings = db.settings;

// Connect to MongoDB using db.config
const dbConfig = require("./app/config/db.config");

db.mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Web E-Voting API." });
});

// routes
const initRoutes = require("./app/routes");
initRoutes(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/kandidat.routes")(app);
require("./app/routes/settings.routes")(app);
require("./app/routes/vote.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    const roleCount = await Role.estimatedDocumentCount();
    if (roleCount === 0) {
      await new Role({ name: "user" }).save();
      console.log("added 'user' to roles collection");

      await new Role({ name: "moderator" }).save();
      console.log("added 'moderator' to roles collection");

      await new Role({ name: "admin" }).save();
      console.log("added 'admin' to roles collection");
    }

    const settingsCount = await Settings.estimatedDocumentCount();
    if (settingsCount === 0) {
      await new Settings({ status: "open" }).save();
      console.log("added 'Status' to Settings collection");
    }
  } catch (err) {
    console.error("Initialization error:", err);
  }
}
