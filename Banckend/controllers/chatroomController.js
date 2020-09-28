const mongoose = require("mongoose");
const Chatroom = require("../models/Chatroom");
const Message = require("../models/Message");

exports.createChatroom = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

  const chatroomExists = await Chatroom.findOne({ name });

  if (chatroomExists) throw "Chatroom with that name already exists!";

  const chatroom = new Chatroom({
    name,
  });

  await chatroom.save();

  res.json({
    message: "Chatroom created!",
  });
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});

  res.json(chatrooms);
};

exports.getAllChatroomMessages = async (req, res) => {
  try {
    const message = await Message.find({ chatroomId: req.params.id }).populate({
      path: "chatroomId",
    });
    res.json(message);
  } catch (e) {
    res.json(e);
    console.log(e);
  }
};
