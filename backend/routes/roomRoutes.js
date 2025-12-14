const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Booking = require("../models/Booking");

/* Get all rooms */
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

/* Get available rooms (CORRECT LOGIC) */
router.get("/available", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  const overlappingBookings = await Booking.find({
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
  });

  const bookedRoomIds = overlappingBookings.map(b => b.roomId);

  const availableRooms = await Room.find({
    _id: { $nin: bookedRoomIds }
  });

  res.json(availableRooms);
});

module.exports = router;
