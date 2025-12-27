const express = require("express");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

const router = express.Router();

/* =========================
   GET all rooms
========================= */
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE room (ADMIN / SEED)
========================= */
router.post("/", async (req, res) => {
  try {
    const { roomNumber, type, price, capacity } = req.body;

    if (!roomNumber || !type || !price || !capacity) {
      return res.status(400).json({ message: "All fields required" });
    }

    const room = new Room({
      roomNumber,
      type,
      price,
      capacity
    });

    await room.save();
    res.status(201).json({ message: "Room created", room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET available rooms
========================= */
router.get("/available", async (req, res) => {
  try {
    const { checkIn, checkOut, beds } = req.query;

    if (!checkIn || !checkOut || !beds) {
      return res.status(400).json({ message: "Missing query params" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const bedsRequired = Number(beds);

    if (isNaN(bedsRequired)) {
      return res.status(400).json({ message: "Invalid beds value" });
    }

    const bookings = await Booking.find({
      checkIn: { $lt: end },
      checkOut: { $gt: start }
    });

    const bookedRoomIds = bookings.map(b => b.roomId.toString());

    const rooms = await Room.find({
      capacity: { $gte: bedsRequired },
      _id: { $nin: bookedRoomIds }
    });

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
