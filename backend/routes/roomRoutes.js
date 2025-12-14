const mongoose = require("mongoose");

router.get("/available", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  const overlappingBookings = await Booking.find({
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
  });

  const bookedRoomIds = overlappingBookings.map(
    b => new mongoose.Types.ObjectId(b.roomId)
  );

  const availableRooms = await Room.find({
    _id: { $nin: bookedRoomIds }
  });

  res.json(availableRooms);
});
