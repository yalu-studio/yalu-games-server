const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const db = require("./config/database");

// Environment variables
require("dotenv").config();

// Create Express app
const app = express();

// Body Parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// CORS
app.use(cors());

// Sessions
const sessionStore = new MongoStore({
  mongooseConnection: db,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: false, httpOnly: true, maxAge: 1000 * 60 // 1 min
    },
  })
);

// Load user models
// require('./models/user')

// passport
require("./auth/auth");

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user)
  next()
})

// routes
const gameRoute = require("./routes/game.route");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");

app.use("/api", gameRoute);
app.use("/", authRoute);
app.use("/", passport.authenticate("jwt", { session: false }), userRoute);

app.get("/", (req, res) => {
  res.json("invalid endpoint");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).json({ message: err.message });
});

module.exports = app;
