import express from "express";
import Offer from "../models/Offer.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });

    return res.json(offers);
  } catch {
    return res.status(500).json({ message: "Failed to fetch offers" });
  }
});

export default router;

