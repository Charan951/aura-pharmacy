import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import Article from "../models/Article.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const seedArticles = async () => {
  try {
    await connectDB();

    const articles = [
      {
        title: "Understanding Diabetes Medicines",
        excerpt: "Learn how common diabetes medicines work and when to take them.",
        content:
          "Diabetes medicines help control your blood sugar in different ways. Some tablets help your body use insulin better, while others reduce the amount of sugar your liver releases. It is important to take them at the same time every day, usually with food, and to never stop them suddenly without talking to your doctor. Always keep a small snack with you in case your sugar levels drop. Regular blood sugar monitoring and yearly eye, kidney and foot checks are key parts of long term diabetes care.",
        category: "Diabetes care",
        emoji: "🩸",
        readTimeMinutes: 6,
        isPublished: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        image: "https://via.placeholder.com/600x360.png?text=Diabetes+Care",
      },
      {
        title: "Building a Simple Daily Vitamin Routine",
        excerpt: "A practical guide to choosing and taking daily vitamin supplements.",
        content:
          "A good vitamin routine starts with understanding what your diet already provides. If you eat plenty of fruits, vegetables and whole grains, you may only need a basic multivitamin. Take vitamins at the same time every day, preferably with a meal and a glass of water, to help absorption and avoid stomach upset. Avoid taking high doses of single vitamins without medical advice, because more is not always better. If you are pregnant, breastfeeding or on long term medication, speak with your doctor before starting any new supplement.",
        category: "Vitamins and supplements",
        emoji: "💊",
        readTimeMinutes: 5,
        isPublished: true,
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        image: "https://via.placeholder.com/600x360.png?text=Vitamins",
      },
      {
        title: "When Should You Visit a Pharmacy Clinic?",
        excerpt: "Know when a pharmacist can help you instead of waiting for a doctor visit.",
        content:
          "Pharmacists are trained to manage many common health problems such as colds, minor skin allergies, acidity, simple pain and small wounds. Visiting a pharmacy clinic can save time when you need quick advice or when appointments are not easily available. Your pharmacist can also review all your medicines together, check for interactions and help you organise them into a simple schedule. For high fever, chest pain, shortness of breath or sudden weakness, you should always seek emergency medical care instead of a pharmacy visit.",
        category: "Primary care",
        emoji: "🏥",
        readTimeMinutes: 4,
        isPublished: true,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        image: "https://via.placeholder.com/600x360.png?text=Pharmacy+Clinic",
      },
      {
        title: "Safe Use of Pain Relief Tablets",
        excerpt: "Tips to use pain relievers safely for headaches, back pain and fevers.",
        content:
          "Pain relief tablets such as paracetamol and ibuprofen are very effective when used correctly. Always check the strength on the strip and do not take more tablets than the label recommends in twenty four hours. Take ibuprofen after food and avoid it if you have kidney disease, stomach ulcers or are in the last three months of pregnancy. Never mix multiple painkillers without checking with your pharmacist, as many cold and flu medicines already contain paracetamol. Keep all pain medicines away from children and do not share your prescription pain medicines with others.",
        category: "Pain management",
        emoji: "🤕",
        readTimeMinutes: 7,
        isPublished: true,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        image: "https://via.placeholder.com/600x360.png?text=Pain+Relief",
      },
      {
        title: "Skin Care Basics During Summer",
        excerpt: "Simple steps to protect your skin from heat, sweat and pollution.",
        content:
          "During summer your skin loses more water and is exposed to stronger sunlight. Use a broad spectrum sunscreen with at least SPF 30 on all exposed areas, and reapply it every two to three hours if you are outdoors. Choose a gentle, fragrance free cleanser and avoid very hot showers, which can dry out the skin. Lightweight gel or lotion moisturisers work better than heavy creams in humid weather. Drink enough water through the day and wear loose cotton clothing to reduce rashes. Visit your doctor if you notice new moles, severe itching or persistent rashes.",
        category: "Skin care",
        emoji: "🌞",
        readTimeMinutes: 6,
        isPublished: true,
        publishedAt: new Date(),
        image: "https://via.placeholder.com/600x360.png?text=Skin+Care",
      },
    ];

    await Article.deleteMany({});
    await Article.insertMany(articles);

    console.log("Seeded articles:", articles.map((article) => article.title));
  } catch (error) {
    console.error("Failed to seed articles", error);
  } finally {
    process.exit(0);
  }
};

seedArticles();

