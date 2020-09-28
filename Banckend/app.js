const express = require("express");
const mongoose = require("mongoose");
const app = express();
const postRoutes = require("./routes/post");
const signUPRoutes = require("./routes/user");
var bodyParser = require("body-parser");
const { response } = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
require("./passport-config")(passport);
require("./models/user");
require("./models/Chatroom");
require("./models/Message");
var cors = require("cors");

const Message = mongoose.model("Message");
const User = mongoose.model("user");

// connect db and check its status
mongoose.connect("mongodb://localhost/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTION") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
    return res.status(200).json({});
  }
  next();
});
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Multer static
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// Connect flash
app.use(flash());

// app.use(auth);
// middleware
app.use(bodyParser.json());
app.use("/post", postRoutes);
app.use("/user", signUPRoutes);
app.use("/chatroom", require("./routes/chatroom"));

app.get("/", (req, res) => {
  res.send("we are at home");
});

const server = app.listen(4000);

const io = require("socket.io")(server);
const jwt = require("jwt-then");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, "shhhhh");
    socket.userId = payload.user._id;
    socket.user = payload.user;
    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.user.name);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", async ({ chatroomId }) => {
    socket.join(chatroomId);
    const message = await Message.find({ chatroomId: chatroomId }).populate({
      path: "chatroomId",
    });
    io.to(chatroomId).emit("newMessage", message);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("typing", async ({ chatroomId, typing }) => {
    if (typing) {
      io.to(chatroomId).emit("isTyping", {
        typing,
        user: socket.userId,
        name: socket.user.name,
      });
    } else {
      io.to(chatroomId).emit("isTyping", {
        typing,
      });
    }
  });

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const newMessage = new Message({
        chatroomId: chatroomId,
        userId: socket.userId,
        name: socket.user.name,
        message,
      });

      io.to(chatroomId).emit("newMessage", [
        {
          message,
          name: socket.user.name,
          userId: socket.userId,
        },
      ]);
      await newMessage.save();
    }
  });
});
