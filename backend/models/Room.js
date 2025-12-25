//const mongoose = require("mongoose");

//const roomSchema = new mongoose.Schema({
  //roomNumber: {
    //type: Number,
   // required: true,
   // unique: true
  //},
  //type: String,
  //price: Number,
  //capacity: Number
//});

//module.exports = mongoose.model("Room", roomSchema);
//
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: Number,
  type: String,
  price: Number,
  capacity: Number
});

module.exports = mongoose.model("Room", roomSchema);
