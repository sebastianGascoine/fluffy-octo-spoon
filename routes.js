const path = require("path");
const express = require("express");
const shared = require("./shared");
const valid = require("./valid");

const router = express.Router();

var passport = require("passport");



const Game = require("./database/Game");
const Player = require("./database/Player");

router.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname + "/public/views/index.html")); //changed
});

router.get("/board", function (req, res) {
  res.sendFile(path.resolve(__dirname + "/public/views/board.html")); //changed
});

router.get("/cool", function (req, res) {
  res.sendFile(path.resolve(__dirname + "/public/views/cool.html")); //changed
});

router.get("/3d", function (req, res) {
  res.sendFile(path.resolve(__dirname + "/public/views/threejstest.html")); //changed
});

router.get("/login", function (req, res) {
  res.sendFile(path.resolve(__dirname + "/public/views/login.html")); //changed
});

router.get("/signup", function (req, res) {
  res.sendFile(path.resolve(__dirname + "/public/views/signup.html")); //changed
});

router.post("/create", function (req, res) {
  let gameID = String(req.body.gameID).trim();
  let name = String(req.body.name).trim();
  let fen = String(req.body.fen).trim();

  if (!gameID) {
    res.json({
      error: true,
      errorCode: 1,
      errorMessage: "Missing a Game ID",
    });
    return;
  }

  if (!name) {
    res.json({
      error: true,
      errorCode: 2,
      errorMessage: "Missing a Player Name",
    });
    return;
  }

  if (!fen) {
    res.json({
      error: true,
      errorCode: 3,
      errorMessage: "Missing a FEN String",
    });
    return;
  }

  // TODO: Need to validate FEN String
  if (valid.ValidateFEN(fen)) {
    res.json({
      error: true,
      errorCode: 4,
      errorMessage: valid.errorcode(),
    });
    return;
  }
  let game = new Game(gameID, [], fen);
  let success = shared.database.newGame(game);

  if (!success) {
    res.json({
      error: true,
      errorCode: 4,
      errorMessage: "Duplicate of existing Game ID",
    });
    return;
  }

  res.json({ error: false });
});

router.post("/join", function (req, res) {
  let gameID = String(req.body.gameID).trim();
  let name = String(req.body.name).trim();

  let game = shared.database.getGame(gameID);

  if (!game) {
    res.json({
      error: true,
      errorCode: 5,
      errorMessage: "Game does not exist",
    });
    return;
  }

  if (game.players.length == 2) {
    res.json({
      error: true,
      errorCode: 6,
      errorMessage: "Game already has two players",
    });
    return;
  }

  let player = new Player(name, game.players.length ? "b" : "w");
  game.players.push(player);

  shared.database.putGame(game);

  res.json({ error: false, code: player.uuid });
});

module.exports = router;
//STOLEN FROM YEE START -------------------------------------------------------------

router.get("/successroot", function (req, res) {
  console.log("get successroot");
  res.json({ redirect: "/" });
});

router.get("/failroot", function (req, res) {
  console.log("get failroot");
  res.json({ redirect: "/login" });
});

router.get("/successsignup", function (req, res) {
  console.log("get successsignup");
  res.json({ redirect: "/session" });
});

router.get("/failsignup", function (req, res) {
  console.log("get failsignup");
  res.json({ redirect: "/login" });
});

router.get("/successlogin", function (req, res) {
  console.log("get successlogin");
  res.json({ redirect: "/session" });
});
router.get("/faillogin", function (req, res) {
  console.log("get failsignup");
  res.json({ redirect: "/login" });
});

router.get("/session", function (req, res) {
  console.log("get session");
  if (req.isAuthenticated()) {
    console.log("sendFile session.html");
    let thePath = path.resolve(__dirname, "public/views/index.html");
    res.sendFile(thePath);
  } else {
    console.log("sendFile login.html");
    let thePath = path.resolve(__dirname, "public/views/login.html");
    res.sendFile(thePath);
  }
});

router.get("/userInfo", function (req, res) {
  console.log("get userInfo");
  if (req.isAuthenticated()) {
    console.log("req isAuthenticated");
    console.log("valueJY = " + req.user.valueJY); /* user defined value */
    res.json({ username: req.user.username });
  } else {
    console.log("req is not Authenticated");
    res.json(null);
  }
});

router.get("/logout", function (req, res) {
  console.log("get logout");
  if (req.isAuthenticated()) {
    console.log("req isAuthenticated");
    req.logout();
    res.redirect("/successroot");
  } else {
    console.log("req is not Authenticated");
    res.redirect("/failroot");
  }
});

router.post(
  "/signup",
  function (req, res, next) {
    console.log("post signup");

    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ username: username }, function (err, user) {
      console.log("User findOne function callback");
      if (err) {
        console.log("err");
        return next(err);
      }
      if (user) {
        console.log("user");
        req.flash("error", "User already exists");
        return res.redirect("/failsignup");
      }

      console.log("new User");
      var newUser = new User({
        username: username,
        password: password,
      });
      newUser.save(next); //goes to user.js (userSchema.pre(save))
    });
  },
  passport.authenticate("login", {
    //goes to setuppassport.js  (passport.use("login"))
    successRedirect: "/successsignup",
    failureRedirect: "/failsignup",
    failureFlash: true,
  })
);





router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/successlogin",
    failureRedirect: "/faillogin",
    failureFlash: true,
  })
);
//STOLEN FROM YEE END ---------------------------------------------------------------
