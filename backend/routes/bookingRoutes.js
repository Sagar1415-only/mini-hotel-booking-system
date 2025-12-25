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
