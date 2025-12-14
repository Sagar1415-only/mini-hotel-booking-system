const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* Admin login */
router.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ message: "Login successful" });
});

module.exports = router;
