const express = require("express");
const passport = require("passport");

const authRoute = express.Router();

authRoute.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

authRoute.post("/login", (req, res) => {
  passport.authenticate("login", (err, token) => {
    if (err) {
      return res.status(500).send();
    }
    if (!token) {
      return res.status(401).json({ success: false, msg: "Incorrect username or password." });
    }
    return res.status(200).json({ success: true, token: token.token, expiresIn: token.expires, msg: "Login successful." });
  })(req, res);
});

authRoute.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoute;
