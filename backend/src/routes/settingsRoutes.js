import express from "express";
import SiteSettings from "../models/SiteSettings.js";

const router = express.Router();

const defaultAboutSectionOneImage =
  "https://via.placeholder.com/640x360.png?text=Pharmacy+Team";
const defaultAboutSectionTwoImage =
  "https://via.placeholder.com/640x360.png?text=Digital+Pharmacy+Experience";

router.get("/about", async (req, res) => {
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
    return res.status(500).json({ message: "Failed to load settings" });
  }
});

export default router;

