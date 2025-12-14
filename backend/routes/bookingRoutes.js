const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

/* Book a room */
router.post("/", async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.json({ message: "Room booked successfully" });
});

/* View bookings */
router.get("/", async (req, res) => {
  const bookings = await Booking.find().populate("roomId");
  res.json(bookings);
});

/* Cancel booking */
router.delete("/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking cancelled" });
});

module.exports = router;
