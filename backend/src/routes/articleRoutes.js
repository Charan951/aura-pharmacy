import express from "express";
import Article from "../models/Article.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .select("title excerpt category emoji readTimeMinutes publishedAt image");

    return res.json(articles);
  } catch {
    return res.status(500).json({ message: "Failed to fetch articles" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findOne({ _id: id, isPublished: true });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.json(article);
  } catch {
    return res.status(500).json({ message: "Failed to fetch article" });
  }
});

export default router;
