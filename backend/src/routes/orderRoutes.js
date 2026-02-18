import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!shippingAddress || typeof shippingAddress !== "object") {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const allowedPaymentMethods = ["cod", "online"];
    const normalizedPaymentMethod = typeof paymentMethod === "string" ? paymentMethod.toLowerCase() : "cod";

    if (!allowedPaymentMethods.includes(normalizedPaymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const productIds = items
      .map((item) => item.productId)
      .filter((id) => typeof id === "string");

    const products = await Product.find({ _id: { $in: productIds } }).select("id category");
    const productCategoryMap = new Map(products.map((product) => [product.id, product.category]));

    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity,
      category: item.category || productCategoryMap.get(item.productId) || undefined,
    }));

    const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items: normalizedItems,
      total,
      shippingAddress: {
        line1: shippingAddress.line1,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
      },
      paymentMethod: normalizedPaymentMethod,
    });

    return res.status(201).json(order);
  } catch {
    return res.status(500).json({ message: "Failed to create order" });
  }
});

router.get("/my", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.json(orders);
  } catch {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { status, from, to } = req.query;

    const filter = {};

    if (typeof status === "string" && status.length > 0) {
      filter.status = status;
    }

    if (typeof from === "string" || typeof to === "string") {
      filter.createdAt = {};

      if (typeof from === "string") {
        const fromDate = new Date(from);
        if (!Number.isNaN(fromDate.getTime())) {
          filter.createdAt.$gte = fromDate;
        }
      }

      if (typeof to === "string") {
        const toDate = new Date(to);
        if (!Number.isNaN(toDate.getTime())) {
          toDate.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = toDate;
        }
      }
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate("user", "name email");

    return res.json(orders);
  } catch {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.patch("/:id/status", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      },
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch {
    return res.status(500).json({ message: "Failed to update status" });
  }
});

export default router;
