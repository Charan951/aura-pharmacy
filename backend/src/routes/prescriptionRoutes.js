import express from "express";
import Prescription from "../models/Prescription.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { sendWhatsAppNotification } from "../services/whatsappService.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { imageData, notes } = req.body;

    if (!imageData || typeof imageData !== "string") {
      return res.status(400).json({ message: "Prescription image is required" });
    }

    const prescription = await Prescription.create({
      user: req.user.id,
      imageData,
      notes,
    });

    return res.status(201).json(prescription);
  } catch {
    return res.status(500).json({ message: "Failed to upload prescription" });
  }
});

router.get("/my", authenticate, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-imageData");

    return res.json(prescriptions);
  } catch {
    return res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
});

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.query;

    const filter =
      typeof status === "string" && status.length > 0
        ? {
            status,
          }
        : {};

    const prescriptions = await Prescription.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .select("-imageData");

    return res.json(prescriptions);
  } catch {
    return res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
});

router.get("/:id/image", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    if (prescription.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json({ imageData: prescription.imageData });
  } catch {
    return res.status(500).json({ message: "Failed to fetch prescription image" });
  }
});

router.put("/:id/approve", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { adminComment } = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      {
        status: "approved",
        adminComment,
        decidedAt: new Date(),
      },
      { new: true },
    ).populate("user", "name email");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    await sendWhatsAppNotification(
      prescription.user.email,
      "Your prescription has been approved by the pharmacy.",
    );

    return res.json(prescription);
  } catch {
    return res.status(500).json({ message: "Failed to approve prescription" });
  }
});

router.put("/:id/reject", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { adminComment } = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        adminComment,
        decidedAt: new Date(),
      },
      { new: true },
    ).populate("user", "name email");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    await sendWhatsAppNotification(
      prescription.user.email,
      "Your prescription has been rejected by the pharmacy.",
    );

    return res.json(prescription);
  } catch {
    return res.status(500).json({ message: "Failed to reject prescription" });
  }
});

export default router;

