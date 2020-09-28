var express = require("express");
var router = express.Router();
var ObjectId = require("mongodb").ObjectID;
const {
  ensureAuthenticated,
  forwardAuthenticated,
  varifyTokken,
} = require("../config");
const postModel = require("../models/Post_Model");
const { post } = require("./user");
const { query, response } = require("express");
const multer = require("multer");
var { upload } = require("../config");

router.get("/", varifyTokken, async (req, res) => {
  try {
    const responce = await postModel.find({ author: req.auth.user._id }).populate({path:"author"});
    res.status(200).send(responce);
  } catch (e) {
    res.status(500).send("internal server error");
  }
});

router.get("/add", (req, res) => {
  res.send("add post");
});

router.post("/", varifyTokken, upload.single("avatar"), async (req, res) => {
  try {
    const post = new postModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      author: req.auth.user._id,
      file: req.file.path,
    });

    await post.save();
    res.status(201).send({ data: post });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
