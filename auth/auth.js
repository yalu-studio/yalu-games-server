const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const User = require("../models/user");

const pathToPublicKey = path.join(__dirname, "id_rsa_pub.pem");
const pathToPrivateKey = path.join(__dirname, "id_rsa_priv.pem");
const PUB_KEY = fs.readFileSync(pathToPublicKey, "utf8");
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, "utf8");

// Local Strategy
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
                  if (err) {
                    return done(err);
                  } else {
                    // Generate user token
                    const payload = {
                      sub: user._id,
                      iat: Date.now(),
                    };
                    const expiresIn = 10 * 60;
                    const signedToken = jwt.sign(payload, PRIV_KEY, {
                      expiresIn: expiresIn,
                      algorithm: "RS256",
                    });
                    const tokenObj = {
                      token: `Bearer ${signedToken}`,
                      expires: expiresIn,
                    };
                    done(null, tokenObj);
                  }
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

// JWT Strategy
passport.use(
  new JWTstrategy(
    {
      secretOrKey: PUB_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      algorithms: ["RS256"],
    },
    (token, done) => {
      console.log(token);

      User.findOne({ _id: token.sub })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          return done(err);
        });
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
