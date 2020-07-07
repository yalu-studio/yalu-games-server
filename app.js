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
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: false, httpOnly: false, maxAge: 1000 * 60 // 1 min
    },
  })
);

const User = require("./models/user");
require("./auth/auth");
const gameRoute = require("./routes/game.route");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");

// app.use(express.static(path.join(__dirname, "dist/gamelib")));

app.use("/api", gameRoute);
app.use("/", authRoute);
app.use("/user", passport.authenticate("jwt", { session: false }), userRoute);

// app.use((req, res, next) => {
//   next(createError(404))
// })

app.get("/", (req, res) => {
  res.send("invalid endpoint");
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/gamelib/index.html'))
// })

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).json({ message: err.message });
});

module.exports = app;
