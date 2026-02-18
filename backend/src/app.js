import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

const app = express();

const frontendOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

app.use(
  cors({
    origin: frontendOrigins.length > 0 ? frontendOrigins : "*",
  }),
);
app.use(
  express.json({
    limit: "10mb",
  }),
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/settings", settingsRoutes);

export default app;
