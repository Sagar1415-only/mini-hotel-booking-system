router.get("/available", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  // 1. Find overlapping bookings
  const overlappingBookings = await Booking.find({
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
  });

  // 2. Convert roomIds properly
  const bookedRoomIds = overlappingBookings.map(
    b => b.roomId.toString()
  );

  // 3. Fetch all rooms
  const allRooms = await Room.find();

  // 4. Manually filter unavailable rooms (SAFE & CLEAR)
  const availableRooms = allRooms.filter(
    room => !bookedRoomIds.includes(room._id.toString())
  );

  res.json(availableRooms);
});
