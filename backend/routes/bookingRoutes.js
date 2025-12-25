const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

/* CREATE booking */
router.post("/", async (req, res) => {
  const booking = new Booking({
    roomId: req.body.roomId,
    customerName: req.body.customerName,
    checkIn: new Date(req.body.checkIn),
    checkOut: new Date(req.body.checkOut)
  });

  await booking.save();
  res.json({ message: "Room booked successfully" });
});
const USER_COINS = 1000;

router.post("/", async (req, res) => {
  const room = await Room.findById(req.body.roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });

  if (USER_COINS < room.price) {
    return res.status(400).json({ message: "Insufficient coins" });
  }

  const booking = new Booking(req.body);
  await booking.save();

  res.json({ message: `Booked! ${room.price} coins deducted` });
});


/* VIEW bookings */
router.get("/", async (req, res) => {
  const bookings = await Booking.find().populate("roomId");
  res.json(bookings);
});

/* DELETE booking */
router.delete("/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking cancelled" });
});

module.exports = router;
