const express = require("express");
const Booking = require("../models/Booking");
const Wallet = require("../models/Wallet");

const router = express.Router();

/* =========================
   CREATE BOOKING + PAY
========================= */
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

    // ✅ Validation
    if (
      !roomId ||
      !walletOwner ||
      !customerName ||
      !bedsRequired ||
      !Array.isArray(guests) ||
      guests.length !== bedsRequired
    ) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    // 1️⃣ Wallet (auto-create)
    let wallet = await Wallet.findOne({ owner: walletOwner });
    if (!wallet) {
      wallet = new Wallet({ owner: walletOwner });
      await wallet.save();
    }

    // 2️⃣ Balance check
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   CANCEL BOOKING (≤ 1 HR)
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.sendStatus(404);

    // ⏱ Time check
    if (Date.now() - booking.createdAt > 60 * 60 * 1000) {
      return res.status(403).json({ message: "Too late to cancel" });
    }

    // 💰 Refund
    let wallet = await Wallet.findOne({ owner: booking.walletOwner });
    if (wallet) {
      wallet.balance += booking.totalAmount;
      await wallet.save();
    }

    await booking.deleteOne();

    res.json({ message: "Cancelled & refunded" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
