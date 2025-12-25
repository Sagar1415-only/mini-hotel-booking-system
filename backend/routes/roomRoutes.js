const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Booking = require("../models/Booking");

/* =========================
   CREATE A ROOM (ADMIN)
   POST /rooms
========================= */
router.post("/", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =========================
   GET ALL ROOMS
   GET /rooms
========================= */
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

/* =========================
   GET AVAILABLE ROOMS
   GET /rooms/available
========================= */
router.get("/available", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  // 1️⃣ Find overlapping bookings
  const overlappingBookings = await Booking.find({
    checkIn: { $lt: end },
    checkOut: { $gt: start }
  });

  // 2️⃣ Extract booked room IDs
  const bookedRoomIds = overlappingBookings.map(b =>
    b.roomId.toString()
  );

  // 3️⃣ Exclude booked rooms
  const availableRooms = await Room.find({
    _id: { $nin: bookedRoomIds }
  });

  res.json(availableRooms);
});

module.exports = router;
