const express = require("express");
const cors = require("cors");
require("./db");

const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const walletRoutes = require("./routes/walletRoutes");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/wallet", walletRoutes);

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);





