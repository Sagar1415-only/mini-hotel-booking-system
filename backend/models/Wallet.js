const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 10000 // ✅ initial virtual coins
  }
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);
