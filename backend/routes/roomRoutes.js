const express = require("express");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Room.find());
});

router.get("/available", async (req, res) => {
  const { checkIn, checkOut, beds } = req.query;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const bookings = await Booking.find({
    checkIn: { $lt: end },
    checkOut: { $gt: start }
  });

  const bookedRoomIds = bookings.map(b => b.roomId.toString());

  const rooms = await Room.find({
    capacity: { $gte: Number(beds) },
    _id: { $nin: bookedRoomIds }
  });

  res.json(rooms);
});

module.exports = router;
