module.exports = {
  HOST: "localhost",
  PORT: 27017,
  DB: "db_evoting",
  url: process.env.MONGODB_URI || "mongodb://localhost:27017/db_evoting"
};
