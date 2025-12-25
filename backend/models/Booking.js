const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

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

    bedsRequired: {
      type: Number,
      required: true
    },

    guests: {
      type: [guestSchema],
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

    totalAmount: {
      type: Number,
      required: true
    },

    payment: {
      method: {
        type: String,
        default: "VirtualCoins"
      },
      status: {
        type: String,
        default: "Paid"
      }
    },
    walletOwner: {
  type: String,
  required: true
},


    status: {
      type: String,
      default: "Booked"
    }
  },
  {
    timestamps: true   // ✅ creates createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
