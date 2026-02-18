export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  discount: number;
  tag?: string;
  category: string;
}

export const allProducts: Product[] = [
  { id: 1, name: "Dolo 650mg Tablet", brand: "Micro Labs", price: 28, originalPrice: 35, rating: 4.5, reviews: 2340, image: "💊", discount: 20, tag: "Bestseller", category: "Medicines" },
  { id: 2, name: "Paracetamol 500mg", brand: "Cipla", price: 18, originalPrice: 25, rating: 4.3, reviews: 1900, image: "💊", discount: 28, category: "Medicines" },
  { id: 3, name: "Azithromycin 500mg", brand: "Zydus", price: 95, originalPrice: 130, rating: 4.4, reviews: 1200, image: "💊", discount: 27, category: "Medicines" },
  { id: 4, name: "Cough Syrup 100ml", brand: "Benadryl", price: 110, originalPrice: 140, rating: 4.2, reviews: 980, image: "🧴", discount: 21, category: "Medicines" },

  { id: 5, name: "Blood Pressure Monitor", brand: "Omron", price: 1299, originalPrice: 1899, rating: 4.7, reviews: 4200, image: "💉", discount: 32, tag: "Top Rated", category: "Heart Care" },
  { id: 6, name: "Aspirin 75mg", brand: "Bayer", price: 45, originalPrice: 60, rating: 4.5, reviews: 3100, image: "💊", discount: 25, category: "Heart Care" },
  { id: 7, name: "Omega-3 Fish Oil", brand: "HealthVit", price: 499, originalPrice: 699, rating: 4.4, reviews: 2600, image: "🧴", discount: 29, category: "Heart Care" },
  { id: 8, name: "Heart Health Kit", brand: "Apollo", price: 899, originalPrice: 1299, rating: 4.6, reviews: 1800, image: "❤️", discount: 31, tag: "Hot Deal", category: "Heart Care" },

  { id: 9, name: "Baby Lotion 200ml", brand: "Johnson's", price: 199, originalPrice: 250, rating: 4.6, reviews: 3400, image: "🧴", discount: 20, category: "Baby Care" },
  { id: 10, name: "Baby Diapers (Pack of 40)", brand: "Pampers", price: 699, originalPrice: 899, rating: 4.5, reviews: 5200, image: "👶", discount: 22, tag: "Bestseller", category: "Baby Care" },
  { id: 11, name: "Baby Shampoo 200ml", brand: "Himalaya", price: 135, originalPrice: 175, rating: 4.4, reviews: 2100, image: "🧴", discount: 23, category: "Baby Care" },
  { id: 12, name: "Gripe Water 130ml", brand: "Woodward's", price: 80, originalPrice: 100, rating: 4.3, reviews: 1700, image: "🍼", discount: 20, category: "Baby Care" },

  { id: 13, name: "Eye Drops 10ml", brand: "Cipla", price: 85, originalPrice: 110, rating: 4.4, reviews: 1600, image: "👁️", discount: 23, category: "Eye Care" },
  { id: 14, name: "Eye Vitamin Capsules", brand: "Bausch+Lomb", price: 450, originalPrice: 599, rating: 4.3, reviews: 1200, image: "💊", discount: 25, category: "Eye Care" },
  { id: 15, name: "Contact Lens Solution", brand: "Renu", price: 320, originalPrice: 400, rating: 4.5, reviews: 2300, image: "🧴", discount: 20, category: "Eye Care" },

  { id: 16, name: "Moisturizer SPF 30", brand: "Cetaphil", price: 599, originalPrice: 799, rating: 4.6, reviews: 3800, image: "🧴", discount: 25, tag: "Bestseller", category: "Skin Care" },
  { id: 17, name: "Sunscreen SPF 50", brand: "La Shield", price: 450, originalPrice: 599, rating: 4.5, reviews: 2900, image: "🧴", discount: 25, category: "Skin Care" },
  { id: 18, name: "Vitamin C Serum", brand: "Plum", price: 399, originalPrice: 549, rating: 4.4, reviews: 2100, image: "🧴", discount: 27, category: "Skin Care" },

  { id: 19, name: "Whey Protein 1kg", brand: "MuscleBlaze", price: 1499, originalPrice: 2199, rating: 4.5, reviews: 3400, image: "🥤", discount: 32, tag: "Top Rated", category: "Fitness" },
  { id: 20, name: "Resistance Bands Set", brand: "Boldfit", price: 399, originalPrice: 599, rating: 4.3, reviews: 1800, image: "🏋️", discount: 33, category: "Fitness" },
  { id: 21, name: "Yoga Mat 6mm", brand: "Strauss", price: 499, originalPrice: 799, rating: 4.4, reviews: 2500, image: "🧘", discount: 38, category: "Fitness" },

  { id: 22, name: "Digital Thermometer", brand: "Dr. Morepen", price: 149, originalPrice: 250, rating: 4.6, reviews: 3100, image: "🌡️", discount: 40, tag: "Hot Deal", category: "Devices" },
  { id: 23, name: "Pulse Oximeter", brand: "BPL", price: 799, originalPrice: 1200, rating: 4.5, reviews: 2700, image: "📟", discount: 33, category: "Devices" },
  { id: 24, name: "Nebulizer Machine", brand: "Omron", price: 1899, originalPrice: 2799, rating: 4.7, reviews: 1900, image: "💨", discount: 32, category: "Devices" },

  { id: 25, name: "Vitamin D3 Supplement", brand: "HealthKart", price: 420, originalPrice: 599, rating: 4.3, reviews: 1820, image: "🧴", discount: 30, category: "Nutrition" },
  { id: 26, name: "Multivitamin Tablets", brand: "Centrum", price: 680, originalPrice: 850, rating: 4.4, reviews: 2100, image: "💊", discount: 20, category: "Nutrition" },
  { id: 27, name: "Calcium + D3 Tablets", brand: "Shelcal", price: 320, originalPrice: 420, rating: 4.5, reviews: 2800, image: "💊", discount: 24, category: "Nutrition" },
  { id: 28, name: "N95 Face Mask (Pack of 5)", brand: "MedPlus", price: 199, originalPrice: 350, rating: 4.4, reviews: 980, image: "😷", discount: 43, category: "Medicines" },
];

export const categories = [
  "Medicines", "Heart Care", "Baby Care", "Eye Care", "Skin Care", "Fitness", "Devices", "Nutrition"
] as const;

export type CategoryName = typeof categories[number];
