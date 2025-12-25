const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Booking = require("../models/Booking");

/* GET all rooms */
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

/* GET available rooms (FINAL CORRECT LOGIC) */
router.get("/available", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  // 1️⃣ Find bookings that overlap
  const overlappingBookings = await Booking.find({
    checkIn: { $lt: end },
    checkOut: { $gt: start }
  });

  // 2️⃣ Extract booked room IDs (SAFE for populated or not)
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
