router.get("/available", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  console.log("CHECK:", checkIn, checkOut);

  const overlappingBookings = await Booking.find({
    checkIn: { $lte: new Date(checkOut) },
    checkOut: { $gte: new Date(checkIn) }
  });

  console.log("OVERLAPS:", overlappingBookings);

  const bookedRoomIds = overlappingBookings.map(b => b.roomId);

  const availableRooms = await Room.find({
    _id: { $nin: bookedRoomIds }
  });

  res.json(availableRooms);
});
