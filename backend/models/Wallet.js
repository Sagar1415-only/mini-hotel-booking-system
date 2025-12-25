const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  owner: String,
  balance: { type: Number, default: 10000 } // virtual coins
});

module.exports = mongoose.model("Wallet", walletSchema);
