const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: Number,
  type: String,
  price: Number,
  capacity: Number
});

module.exports = mongoose.model("Room", roomSchema);
