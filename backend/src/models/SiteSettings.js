import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    aboutSectionOneImage: {
      type: String,
      trim: true,
    },
    aboutSectionTwoImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;

