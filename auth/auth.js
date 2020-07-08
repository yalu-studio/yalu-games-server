const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // Validate email
        let user = await User.findOne({ email });
        if (user) {
          return done({ message: "Email already exists." });
        }

        // Validate username
        user = await User.findOne({ username: req.body.username });
        if (user) {
          return done({ message: "Username already exists." });
        }

        // Create new user
        const num = await User.countDocuments({});
        user = await User.create({
          email: email,
          username: req.body.username,
          password: password,
          userNum: num,
        });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false);
          }

          user.isValidPassword(password).then((isValid) => {
            if (!isValid) {
              return done(null, false);
            } else {
              // Update login time
              User.findOneAndUpdate(
                { _id: user._id },
                { $set: { lastActiveAt: Date() } },
                { returnOriginal: false },
                (err, user) => {
                  return done(null, user);
                }
              );
            }
          });
        })
        .catch((err) => {
          done(err);
        });
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "top_secret",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
