import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Offer from "../models/Offer.js";
import Article from "../models/Article.js";
import SiteSettings from "../models/SiteSettings.js";
import { v2 as cloudinary } from "cloudinary";
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

const uploadImage = async (imageData, folder) => {
  if (typeof imageData !== "string" || imageData.length === 0) {
    return undefined;
  }

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary configuration missing, storing raw image data instead");
    return imageData;
  }

  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Failed to upload image to Cloudinary", error);
    return undefined;
  }
};

const defaultAboutSectionOneImage =
  "https://via.placeholder.com/640x360.png?text=Pharmacy+Team";
const defaultAboutSectionTwoImage =
  "https://via.placeholder.com/640x360.png?text=Digital+Pharmacy+Experience";

router.get("/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.json(users);
  } catch {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/staff", authenticate, authorize("admin"), async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json(staff);
  } catch {
    return res.status(500).json({ message: "Failed to fetch staff" });
  }
});

router.post("/staff", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: "staff",
    });

    const safeStaff = {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      createdAt: staff.createdAt,
    };

    return res.status(201).json(safeStaff);
  } catch {
    return res.status(500).json({ message: "Failed to create staff" });
  }
});

router.delete("/staff/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findOneAndDelete({ _id: id, role: "staff" });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    return res.json({ message: "Staff member deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete staff" });
  }
});

router.get("/dashboard", authenticate, authorize("admin"), async (req, res) => {
  try {
    const now = new Date();
    const lastSevenDays = new Date(now);
    lastSevenDays.setDate(lastSevenDays.getDate() - 6);

    const lastSixMonths = new Date(now);
    lastSixMonths.setMonth(lastSixMonths.getMonth() - 5);

    const [
      totalSalesAgg,
      totalOrders,
      totalCustomers,
      lowStockItems,
      recentOrders,
      dailyOrdersAgg,
      monthlyRevenueAgg,
      categoryRevenueAgg,
    ] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Product.find({
        isActive: true,
        $expr: { $lte: ["$stock", "$minStock"] },
      })
        .sort({ stock: 1 })
        .limit(5)
        .select("name brand stock minStock"),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("total status createdAt"),
      Order.aggregate([
        { $match: { createdAt: { $gte: lastSevenDays } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
            total: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: lastSixMonths } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            total: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.category",
            total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    const topProductsAgg = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.productId": { $ne: null } } },
      {
        $group: {
          _id: "$items.productId",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    const productIds = topProductsAgg.map((item) => item._id);
    const topProductsDocuments = await Product.find({ _id: { $in: productIds } }).select("name brand");
    const productById = new Map(topProductsDocuments.map((product) => [product.id, product]));

    const topProducts = topProductsAgg.map((item) => {
      const product = productById.get(item._id.toString());

      return {
        productId: item._id,
        name: product ? product.name : "Unknown product",
        brand: product ? product.brand : "",
        quantity: item.quantity,
        revenue: item.revenue,
      };
    });

    const totalSales = totalSalesAgg[0]?.total ?? 0;

    const dailyOrders = dailyOrdersAgg.map((item) => ({
      date: item._id,
      count: item.count,
      total: item.total,
    }));

    const monthlyRevenue = monthlyRevenueAgg.map((item) => ({
      month: item._id,
      total: item.total,
    }));

    const categoryRevenue = categoryRevenueAgg
      .filter((item) => item._id)
      .map((item) => ({
        category: item._id,
        total: item.total,
      }));

    return res.json({
      summary: {
        totalSales,
        totalOrders,
        totalCustomers,
        lowStockItems: lowStockItems.length,
      },
      charts: {
        dailyOrders,
        monthlyRevenue,
        categoryRevenue,
      },
      recentOrders,
      topProducts,
      lowStock: lowStockItems,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load dashboard data" });
  }
});

router.get("/settings/about", authenticate, authorize("admin"), async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({
        aboutSectionOneImage: defaultAboutSectionOneImage,
        aboutSectionTwoImage: defaultAboutSectionTwoImage,
      });
    }

    return res.json({
      aboutSectionOneImage: settings.aboutSectionOneImage || defaultAboutSectionOneImage,
      aboutSectionTwoImage: settings.aboutSectionTwoImage || defaultAboutSectionTwoImage,
    });
  } catch {
    return res.status(500).json({ message: "Failed to load about settings" });
  }
});

router.put("/settings/about", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { sectionOneImageData, sectionTwoImageData } = req.body;

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings();
    }

    if (sectionOneImageData) {
      const url = await uploadImage(sectionOneImageData, "aura-pharmacy/about");
      if (url) {
        settings.aboutSectionOneImage = url;
      }
    }

    if (sectionTwoImageData) {
      const url = await uploadImage(sectionTwoImageData, "aura-pharmacy/about");
      if (url) {
        settings.aboutSectionTwoImage = url;
      }
    }

    if (!settings.aboutSectionOneImage) {
      settings.aboutSectionOneImage = defaultAboutSectionOneImage;
    }

    if (!settings.aboutSectionTwoImage) {
      settings.aboutSectionTwoImage = defaultAboutSectionTwoImage;
    }

    await settings.save();

    return res.json({
      aboutSectionOneImage: settings.aboutSectionOneImage,
      aboutSectionTwoImage: settings.aboutSectionTwoImage,
    });
  } catch {
    return res.status(500).json({ message: "Failed to update about settings" });
  }
});

router.get("/offers", authenticate, authorize("admin"), async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    return res.json(offers);
  } catch {
    return res.status(500).json({ message: "Failed to fetch offers" });
  }
});

router.post("/offers", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { imageData, title, description, code, expiresAt, isActive } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Title is required" });
    }

    let imageUrl;

    if (imageData) {
      imageUrl = await uploadImage(imageData, "aura-pharmacy/offers");
    }

    const offer = await Offer.create(
      {
        title,
        description,
        code,
        expiresAt,
        isActive: typeof isActive === "boolean" ? isActive : true,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    );

    return res.status(201).json(offer);
  } catch {
    return res.status(500).json({ message: "Failed to create offer" });
  }
});

router.put("/offers/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { imageData, ...rest } = req.body;

    const update = { ...rest };

    if (imageData) {
      const imageUrl = await uploadImage(imageData, "aura-pharmacy/offers");
      if (imageUrl) {
        update.image = imageUrl;
      }
    }

    const offer = await Offer.findByIdAndUpdate(id, update, { new: true });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    return res.json(offer);
  } catch {
    return res.status(500).json({ message: "Failed to update offer" });
  }
});

router.delete("/offers/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    return res.json(offer);
  } catch {
    return res.status(500).json({ message: "Failed to delete offer" });
  }
});

router.get("/articles", authenticate, authorize("admin"), async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 });

    return res.json(articles);
  } catch {
    return res.status(500).json({ message: "Failed to fetch articles" });
  }
});

router.post("/articles", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { imageData, title, excerpt, content, category, emoji, readTimeMinutes, isPublished, publishedAt } =
      req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Title is required" });
    }

    let imageUrl;

    if (imageData) {
      imageUrl = await uploadImage(imageData, "aura-pharmacy/articles");
    }

    const article = await Article.create(
      {
        title,
        excerpt,
        content,
        category,
        emoji,
        readTimeMinutes,
        isPublished: typeof isPublished === "boolean" ? isPublished : true,
        publishedAt: publishedAt || new Date(),
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    );

    return res.status(201).json(article);
  } catch {
    return res.status(500).json({ message: "Failed to create article" });
  }
});

router.put("/articles/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { imageData, ...rest } = req.body;

    const update = { ...rest };

    if (imageData) {
      const imageUrl = await uploadImage(imageData, "aura-pharmacy/articles");
      if (imageUrl) {
        update.image = imageUrl;
      }
    }

    const article = await Article.findByIdAndUpdate(id, update, { new: true });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.json(article);
  } catch {
    return res.status(500).json({ message: "Failed to update article" });
  }
});

router.delete("/articles/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.json({ message: "Article deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete article" });
  }
});

export default router;
