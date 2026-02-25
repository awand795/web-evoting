if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set. Please create a .env file.");
}

module.exports = {
  HOST: "localhost",
  PORT: 27017,
  DB: "db_evoting",
  url: process.env.MONGODB_URI
};
