const express = require("express");
const cors = require("cors");
require("./db");

const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
