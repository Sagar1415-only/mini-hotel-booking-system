const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Wallet = require("../models/Wallet");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      roomId,
      customerName,
      walletOwner,
      bedsRequired,
      guests,
      checkIn,
      checkOut,
      totalAmount
    } = req.body;

    if (!walletOwner || !roomId || !bedsRequired || guests.length !== bedsRequired) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    // 1️⃣ Get wallet (auto-create safety)
    let wallet = await Wallet.findOne({ owner: walletOwner });
    if (!wallet) {
      wallet = new Wallet({ owner: walletOwner });
      await wallet.save();
    }

    // 2️⃣ Check balance
    if (wallet.balance < totalAmount) {
      return res.status(403).json({ message: "Insufficient virtual coins" });
    }

    // 3️⃣ Deduct coins
    wallet.balance -= totalAmount;
    await wallet.save();

    // 4️⃣ Save booking
    const booking = new Booking({
      roomId,
      customerName,
      walletOwner,
      bedsRequired,
      guests,
      checkIn,
      checkOut,
      totalAmount
    });

    await booking.save();

    res.json({
      message: "Payment successful & booking confirmed",
      remainingBalance: wallet.balance
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.sendStatus(404);

  if (Date.now() - booking.createdAt > 3600000) {
    return res.status(403).json({ message: "Too late to cancel" });
  }

  const wallet = await Wallet.findOne({ owner: booking.walletOwner });
  wallet.balance += booking.totalAmount;
  await wallet.save();

  await booking.deleteOne();
  res.json({ message: "Cancelled & refunded" });
});

module.exports = router;
