const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TitleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  file: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});
const company = mongoose.model("posts", TitleSchema); //(name of the  table is locations)it always small letter with 's' at the end
module.exports = company;
