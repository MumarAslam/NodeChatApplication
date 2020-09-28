const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("./models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        user.comparePassword(password, function (err, isMatch) {
          if (!isMatch)
            return done(null, false, { message: "Password incorrect" });
          return done(null, user); // -&gt; Password123: true
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
