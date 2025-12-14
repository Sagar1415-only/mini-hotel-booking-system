const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Booking = require("../models/Booking");

/* Get all rooms */
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

/* Check room availability */
router.get("/available", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  const bookings = await Booking.find({
    $or: [
      { checkOut: { $lte: new Date(checkIn) } },
      { checkIn: { $gte: new Date(checkOut) } }
    ]
  });

  const bookedRoomIds = bookings.map(b => b.roomId.toString());
  const availableRooms = await Room.find({
    _id: { $nin: bookedRoomIds }
  });

  res.json(availableRooms);
});

module.exports = router;
