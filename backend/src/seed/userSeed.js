import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "admin@123";

    let admin = await User.findOne({ email });

    if (!admin) {
      admin = await User.create({
        name: "Administrator",
        email,
        password,
        role: "admin",
      });

      console.log("Admin user created", { email: admin.email });
    } else {
      admin.password = password;
      admin.role = "admin";
      await admin.save();
      console.log("Admin user updated", { email: admin.email });
    }
  } catch (error) {
    console.error("Failed to seed admin user", error);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
