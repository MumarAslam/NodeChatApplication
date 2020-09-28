const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatroomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Chatroom is required!",
      ref: "Chatroom",
    },
    name: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: "userId is required!",
      ref: "user",
    },
    message: {
      type: String,
      required: "Message is required!",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

module.exports = mongoose.model("Message", messageSchema);
