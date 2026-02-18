import express from "express";
import Category from "../models/Category.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { includeInactive } = req.query;

    const filter =
      includeInactive === "true"
        ? {}
        : {
            isActive: true,
          };

    const categories = await Category.find(filter).sort({ name: 1 });

    return res.json(categories);
  } catch {
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const payload = req.body;

    const category = await Category.create(payload);

    return res.status(201).json(category);
  } catch {
    return res.status(500).json({ message: "Failed to create category" });
  }
});

router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const category = await Category.findByIdAndUpdate(id, payload, { new: true });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json(category);
  } catch {
    return res.status(500).json({ message: "Failed to update category" });
  }
});

router.patch("/:id/status", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const category = await Category.findByIdAndUpdate(id, { isActive }, { new: true });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json(category);
  } catch {
    return res.status(500).json({ message: "Failed to update category status" });
  }
});

router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json(category);
  } catch {
    return res.status(500).json({ message: "Failed to delete category" });
  }
});

export default router;

