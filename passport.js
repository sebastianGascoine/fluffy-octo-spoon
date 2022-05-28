var express = require("express");
var passport = require("passport");
//var path = require("path");
//does something IDK
var LocalStrategy = require("passport-local").Strategy;

//var User = require("./database/user");
var router = express.Router();

//const myDatabase = require('./myDatabase');    //added
//let db = new myDatabase();

//newer imported code from yee
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
//OLD CODE BEFORE IF PROBLEM PERSISTS IDK
/*


//function ensureAuthenticated(req, res, next) {
//  if (req.isAuthenticated()) {
//    next();
//  } else {
//    req.flash("info", "You must be logged in to see this page.");
//    res.redirect("/login");
//  }
//}

router.use(function(req, res, next) {
    res.locals.currentUserjy = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});


router.get("/update", function(req, res) {
    if (req.isAuthenticated()) {
        console.log("routesData update grade is " + req.query.grade);


        return("balllllllllllllllllls");

//          res.json(null);

    } else {
        res.json(null);
    }
});
*/
/*
router.get("/update", function(req, res) {
    if (req.isAuthenticated()) {
          console.log("update grade is " + req.query.grade);
          res.json(null);
      } else {
          res.json(null);
      }
});
*/
/*
router.put('/update', function(req, res){

    if (req.isAuthenticated()) {

        if (req.body.name == "") {
            res.json(null);
            return;
        }
//added below for mongo
    let obj = new Student(req.user.ident,req.user.username,req.body.grade,req.body.volleyball,req.body.basketball,req.body.soccer);
        return(db.putStudent(obj,res));

    }
    else
        res.json(null);
});
*/


module.exports = router;
