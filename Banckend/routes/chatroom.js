const router = require("express").Router();
const chatroomController = require("../controllers/chatroomController");
const {
    ensureAuthenticated,
    forwardAuthenticated,
    varifyTokken,
  } = require("../config");

// const auth = require("../middlewares/auth");
const chatRoomModel = require("../models/Chatroom");

router.get("/", varifyTokken, chatroomController.getAllChatrooms);
router.get("/messages/:id", varifyTokken, chatroomController.getAllChatroomMessages);
router.post("/", varifyTokken, chatroomController.createChatroom);

module.exports = router;
