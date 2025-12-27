const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    customerName: String,
    bedsRequired: Number,
    guests: [{ name: String, age: Number }],
    checkIn: Date,
    checkOut: Date,
    totalAmount: Number,
    walletOwner: String,
    status: { type: String, default: "Booked" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
