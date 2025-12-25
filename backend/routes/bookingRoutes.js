const express = require("express");
const Booking = require("../models/Booking");
const Wallet = require("../models/Wallet");
const Room = require("../models/Room");

const router = express.Router();

/* ===========================
   CREATE BOOKING + PAY
=========================== */
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

    /* 1️⃣ Basic validation */
    if (
      !roomId ||
      !customerName ||
      !walletOwner ||
      !bedsRequired ||
      !guests ||
      guests.length !== bedsRequired ||
      !checkIn ||
      !checkOut ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    /* 2️⃣ Ensure room exists */
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    /* 3️⃣ Prevent overlapping booking (server-side safety) */
    const overlap = await Booking.findOne({
      roomId,
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) }
    });

    if (overlap) {
      return res.status(409).json({ message: "Room already booked for selected dates" });
    }

    /* 4️⃣ Wallet check */
    const wallet = await Wallet.findOne({ owner: walletOwner });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < totalAmount) {
      return res.status(403).json({ message: "Insufficient virtual coins" });
    }

    /* 5️⃣ Deduct coins */
    wallet.balance -= totalAmount;
    await wallet.save();

    /* 6️⃣ Create booking */
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

    res.status(201).json({
      message: "Booking confirmed & payment successful",
      bookingId: booking._id,
      remainingBalance: wallet.balance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

/* ===========================
   VIEW ALL BOOKINGS (ADMIN)
=========================== */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("roomId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

/* ===========================
   CANCEL BOOKING (≤ 1 HOUR)
=========================== */
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    /* 1️⃣ Check cancellation window */
    const diffMs = Date.now() - new Date(booking.createdAt);
    const oneHour = 60 * 60 * 1000;

    if (diffMs > oneHour) {
      return res.status(403).json({ message: "Cancellation window expired" });
    }

    /* 2️⃣ Refund wallet */
    const wallet = await Wallet.findOne({ owner: booking.walletOwner });
    if (wallet) {
      wallet.balance += booking.totalAmount;
      await wallet.save();
    }

    /* 3️⃣ Delete booking */
    await booking.deleteOne();

    res.json({
      message: "Booking cancelled & refunded",
      refundedAmount: booking.totalAmount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cancellation failed" });
  }
});

module.exports = router;
