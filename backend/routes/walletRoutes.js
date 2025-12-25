const express = require("express");
const Wallet = require("../models/Wallet");

const router = express.Router();

router.post("/init", async (req, res) => {
  const wallet = await Wallet.create({ owner: req.body.owner });
  res.json(wallet);
});

router.get("/:owner", async (req, res) => {
  const wallet = await Wallet.findOne({ owner: req.params.owner });
  res.json(wallet);
});

module.exports = router;
