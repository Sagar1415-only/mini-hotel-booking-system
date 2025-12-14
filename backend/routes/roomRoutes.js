const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Booking = require("../models/Booking");

/* ✅ availability FIRST */
router.get("/available", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  const overlappingBookings = await Booking.find({
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
  });

  const bookedRoomIds = overlappingBookings.map(
    b => b.roomId.toString()
  );

  const allRooms = await Room.find();

  const availableRooms = allRooms.filter(
    room => !bookedRoomIds.includes(room._id.toString())
  );

  res.json(availableRooms);
});

/* all rooms */
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

/* ❗ this MUST be LAST */
router.get("/:id", async (req, res) => {
  const room = await Room.findById(req.params.id);
  res.json(room);
});

module.exports = router;
