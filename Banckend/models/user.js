const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "manager"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.password;
        delete ret.salt;
        // TODO: move these two things to removeUnAuthorizedData function
        // delete ret.defaultAddress
        // delete ret.rolePermissons
      },
    },
  }
);

UserSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const company = mongoose.model("user", UserSchema); //(name of the  table is locations)it always small letter with 's' at the end
module.exports = company;
