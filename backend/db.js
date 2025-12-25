const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/hotelDB");

mongoose.connection.on("connected", () =>
  console.log("MongoDB Connected")
);

module.exports = mongoose;
