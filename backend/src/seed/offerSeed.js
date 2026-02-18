import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import Offer from "../models/Offer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const seedOffers = async () => {
  try {
    await connectDB();

    const offers = [
      {
        title: "Flat 25% Off",
        description: "On all diabetes care essentials",
        code: "DIABETES25",
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        isActive: true,
        image: "https://via.placeholder.com/200x120.png?text=Diabetes+Care",
      },
      {
        title: "Buy 2 Get 1 Free",
        description: "On vitamins and daily supplements",
        code: "VITABOOST",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        image: "https://via.placeholder.com/200x120.png?text=Vitamins",
      },
      {
        title: "Free Health Checkup",
        description: "Complimentary basic health checkup on orders above ₹1999",
        code: "HEALTH1999",
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        isActive: true,
        image: "https://via.placeholder.com/200x120.png?text=Checkup",
      },
      {
        title: "30% Off First Order",
        description: "For new customers ordering medicines online",
        code: "NEW30",
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        isActive: true,
        image: "https://via.placeholder.com/200x120.png?text=First+Order",
      },
      {
        title: "Flat ₹200 Off",
        description: "On baby care essentials above ₹1499",
        code: "BABY200",
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        isActive: true,
        image: "https://via.placeholder.com/200x120.png?text=Baby+Care",
      },
    ];

    await Offer.deleteMany({});
    await Offer.insertMany(offers);

    console.log("Seeded offers:", offers.map((offer) => offer.title));
  } catch (error) {
    console.error("Failed to seed offers", error);
  } finally {
    process.exit(0);
  }
};

seedOffers();

