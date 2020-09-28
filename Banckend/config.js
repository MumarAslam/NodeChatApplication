const jwt = require("jsonwebtoken");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = {
  upload: multer({ storage: storage }),
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(400).json("error_msg', 'Please log in to view that resource");
  },
  varifyTokken: function (req, res, next) {
    try {
      const bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const berarerToken = bearer[1];
        const verified = jwt.verify(berarerToken, "shhhhh");
        if (!verified) {
          throw new Error("Not verified");
        }
        req.auth = jwt.decode(berarerToken);
        next();
      } else {
        res.sendStatus(403);
      }
    } catch (e) {
      res.sendStatus(403);
    }
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
  },
};
