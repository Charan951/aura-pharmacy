import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const products = [
  { name: "Dolo 650mg Tablet", brand: "Micro Labs", price: 28, originalPrice: 35, category: "Medicines", stock: 100, isActive: true },
  { name: "Paracetamol 500mg", brand: "Cipla", price: 18, originalPrice: 25, category: "Medicines", stock: 150, isActive: true },
  { name: "Azithromycin 500mg", brand: "Zydus", price: 95, originalPrice: 130, category: "Medicines", stock: 50, isActive: true },
  { name: "Cough Syrup 100ml", brand: "Benadryl", price: 110, originalPrice: 140, category: "Medicines", stock: 60, isActive: true },
  { name: "Blood Pressure Monitor", brand: "Omron", price: 1299, originalPrice: 1899, category: "Heart Care", stock: 30, isActive: true },
  { name: "Aspirin 75mg", brand: "Bayer", price: 45, originalPrice: 60, category: "Heart Care", stock: 200, isActive: true },
  { name: "Omega-3 Fish Oil", brand: "HealthVit", price: 499, originalPrice: 699, category: "Heart Care", stock: 80, isActive: true },
  { name: "Heart Health Kit", brand: "Apollo", price: 899, originalPrice: 1299, category: "Heart Care", stock: 40, isActive: true },
  { name: "Baby Lotion 200ml", brand: "Johnson's", price: 199, originalPrice: 250, category: "Baby Care", stock: 120, isActive: true },
  { name: "Baby Diapers (Pack of 40)", brand: "Pampers", price: 699, originalPrice: 899, category: "Baby Care", stock: 100, isActive: true },
  { name: "Baby Shampoo 200ml", brand: "Himalaya", price: 135, originalPrice: 175, category: "Baby Care", stock: 90, isActive: true },
  { name: "Gripe Water 130ml", brand: "Woodward's", price: 80, originalPrice: 100, category: "Baby Care", stock: 110, isActive: true },
  { name: "Eye Drops 10ml", brand: "Cipla", price: 85, originalPrice: 110, category: "Eye Care", stock: 70, isActive: true },
  { name: "Eye Vitamin Capsules", brand: "Bausch+Lomb", price: 450, originalPrice: 599, category: "Eye Care", stock: 50, isActive: true },
  { name: "Contact Lens Solution", brand: "Renu", price: 320, originalPrice: 400, category: "Eye Care", stock: 65, isActive: true },
  { name: "Moisturizer SPF 30", brand: "Cetaphil", price: 599, originalPrice: 799, category: "Skin Care", stock: 85, isActive: true },
  { name: "Sunscreen SPF 50", brand: "La Shield", price: 450, originalPrice: 599, category: "Skin Care", stock: 75, isActive: true },
  { name: "Vitamin C Serum", brand: "Plum", price: 399, originalPrice: 549, category: "Skin Care", stock: 95, isActive: true },
  { name: "Whey Protein 1kg", brand: "MuscleBlaze", price: 1499, originalPrice: 2199, category: "Fitness", stock: 40, isActive: true },
  { name: "Resistance Bands Set", brand: "Boldfit", price: 399, originalPrice: 599, category: "Fitness", stock: 60, isActive: true },
  { name: "Yoga Mat 6mm", brand: "Strauss", price: 499, originalPrice: 799, category: "Fitness", stock: 55, isActive: true },
  { name: "Digital Thermometer", brand: "Dr. Morepen", price: 149, originalPrice: 250, category: "Devices", stock: 130, isActive: true },
  { name: "Pulse Oximeter", brand: "BPL", price: 799, originalPrice: 1200, category: "Devices", stock: 70, isActive: true },
  { name: "Nebulizer Machine", brand: "Omron", price: 1899, originalPrice: 2799, category: "Devices", stock: 35, isActive: true },
  { name: "Vitamin D3 Supplement", brand: "HealthKart", price: 420, originalPrice: 599, category: "Nutrition", stock: 80, isActive: true },
  { name: "Multivitamin Tablets", brand: "Centrum", price: 680, originalPrice: 850, category: "Nutrition", stock: 90, isActive: true },
  { name: "Calcium + D3 Tablets", brand: "Shelcal", price: 320, originalPrice: 420, category: "Nutrition", stock: 100, isActive: true },
  { name: "N95 Face Mask (Pack of 5)", brand: "MedPlus", price: 199, originalPrice: 350, category: "Medicines", stock: 200, isActive: true }
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Failed to seed products", error);
  } finally {
    process.exit(0);
  }
};

seedProducts();
