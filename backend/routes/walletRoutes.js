const express = require("express");
const Wallet = require("../models/Wallet");

const router = express.Router();

/* =========================
   GET / CREATE WALLET
========================= */
router.get("/:owner", async (req, res) => {
  try {
    const { owner } = req.params;

    let wallet = await Wallet.findOne({ owner });

    // 🧠 Auto-create wallet if not exists
    if (!wallet) {
      wallet = new Wallet({ owner });
      await wallet.save();
    }

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
