const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require('./database/models/User');

module.exports = function() {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use("login", new LocalStrategy(function(username, password, done) {
        console.log("passport use login function callback")
        User.findOne({ username: username }, function(err, user) {
            console.log("User findOne function callback")
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: "No user has that username!" });
            }

            console.log("yes user has that username")

            user.checkPassword(password, function(err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    console.log("yes there is a match")

                    return done(null, user);

                } else {
                    return done(null, false, { message: "Invalid password." });
                }
            });
        });
    }));

};