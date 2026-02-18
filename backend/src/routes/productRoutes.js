import express from "express";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

const uploadProductImage = async (imageData) => {
  if (typeof imageData !== "string" || imageData.length === 0) {
    return undefined;
  }

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary configuration missing, storing raw image data instead");
    return imageData;
  }

  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: "aura-pharmacy/products",
    });

    return result.secure_url;
  } catch (error) {
    console.error("Failed to upload product image to Cloudinary", error);
    return undefined;
  }
};

router.get("/", async (req, res) => {
  try {
    const { includeInactive, category, search } = req.query;

    const filter =
      includeInactive === "true"
        ? {}
        : {
            isActive: true,
          };

    if (typeof category === "string" && category.trim().length > 0) {
      filter.category = category.trim();
    }

    if (typeof search === "string" && search.trim().length > 0) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");

      filter.$or = [
        { name: regex },
        { brand: regex },
        { category: regex },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.json(products);
  } catch {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const payload = req.body;

    const { imageData, ...rest } = payload;

    let imageUrl;

    if (imageData) {
      imageUrl = await uploadProductImage(imageData);
    }

    const product = await Product.create({
      ...rest,
      ...(imageUrl ? { image: imageUrl } : {}),
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Failed to create product", error);
    return res.status(500).json({ message: "Failed to create product" });
  }
});

router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const { imageData, ...rest } = payload;

    const update = { ...rest };

    if (imageData) {
      const imageUrl = await uploadProductImage(imageData);
      if (imageUrl) {
        update.image = imageUrl;
      }
    }

    const product = await Product.findByIdAndUpdate(id, update, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Failed to update product", error);
    return res.status(500).json({ message: "Failed to update product" });
  }
});

router.patch("/:id/status", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const product = await Product.findByIdAndUpdate(id, { isActive }, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch {
    return res.status(500).json({ message: "Failed to update product status" });
  }
});

router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch {
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
