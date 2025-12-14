const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  customerName: String,
  checkIn: Date,
  checkOut: Date,
  status: {
    type: String,
    default: "Booked"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
