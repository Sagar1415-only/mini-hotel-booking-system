const express = require("express");
const Booking = require("../models/Booking");
const Wallet = require("../models/Wallet");

const router = express.Router();

/* =========================
   GET ALL BOOKINGS (ADMIN)
========================= */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("roomId"); // optional but very useful

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isAdmin = req.query.admin === "true";

    // 👤 USER RULE: can cancel only within 1 hour
    if (!isAdmin) {
      const bookingTime = new Date(booking.createdAt);
      const now = new Date();

      const diffInMinutes = (now - bookingTime) / (1000 * 60);

      if (diffInMinutes > 60) {
        return res.status(403).json({
          message: "Cancellation allowed only within 1 hour"
        });
      }
    }

    // 🧑‍💼 ADMIN: can cancel anytime
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: isAdmin
        ? "Booking cancelled by admin"
        : "Booking cancelled successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});
router.get("/user/:name", async (req, res) => {
  const bookings = await Booking.find({
    customerName: req.params.name
  });
  res.json(bookings);
});




module.exports = router;
