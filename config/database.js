const mongoose = require("mongoose");

// Environment variables
require("dotenv").config();

const conn = process.env.DB_STRING;

mongoose.Promise = global.Promise;
const connection = mongoose.connect(conn, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Database connection error"));

db.once("open", () => {
  console.log("Database connected successfully.");
});

module.exports = db;
