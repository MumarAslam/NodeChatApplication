var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
const bCrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { name, password, confirm_password, email } = req.body;
  let errors = [];
  if (!name || !password || !confirm_password || !email) {
    errors.push("Please fill all filed");
  }
  if (password !== confirm_password) {
    errors.push("Please enter same password ");
  }
  if (password.length < 6) {
    errors.push("password length must be 6 or grater");
  }
  if (errors.length > 0) {
    res.status(400).json("Error: " + errors);
  } else {
    user = await userModel.findOne({ email: email });
    if (user) {
      errors.push("User Already exits");
      res.status(400).json("Error: " + errors);
    } else {
      try {
        const post = new userModel({
          name: req.body.name,
          password: req.body.password,
          email: req.body.email,
          role: req.body.role,
        });
        const reponse = await post.save();
        reponse.password=undefined;
        res.json(reponse)
      } catch (e) {
        res.json(e);
      }

      // bCrypt.genSalt(10, async (err, salt) => {
      //   bCrypt.hash(post.password, salt, async (err, hash) => {
      //     if (err) throw err;
      //     post.password = hash;
      //     post.confirm_password = hash;
      //     const reponse = await post.save();
      //     res.json(reponse);
      //   });
      // });
    }
  }
});

router.post("/login", (req, res, next) => {
  try {
    passport.authenticate("local", (err, user, info) => {
      req.login(user, function (error) {
        if (info) {
          res.status(404).send({
            info,
          });
        } else {
          jwt.sign({ user: user }, "shhhhh", (err, token) => {
            res.status(201).send({
              user: user,
              token: token,
            });
          });
        }
      });
    })(req, res, next);
  } catch (error) {
    res.send(error);
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.end("you are logout");
});

module.exports = router;
