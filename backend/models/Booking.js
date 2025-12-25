const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    customerName: {
      type: String,
      required: true
    },

    customerAge: {
      type: Number,
      required: true
    },

    bedsRequired: {
      type: Number,
      required: true
    },

    checkIn: {
      type: Date,
      required: true
    },

    checkOut: {
      type: Date,
      required: true
    },

    payment: {
      amount: {
        type: Number,
        required: true
      },
      method: {
        type: String,
        default: "VirtualCoins"
      },
      status: {
        type: String,
        default: "Paid"
      }
    },

    status: {
      type: String,
      default: "Booked"
    }
  },
  {
    timestamps: true   // 🔥 VERY IMPORTANT
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
