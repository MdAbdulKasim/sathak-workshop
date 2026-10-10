import "reflect-metadata";
import fs from "fs";
import path from "path";
import { AppDataSource } from "./data-source";
import { Product } from "./entity";
import { ensureProductsBucket, uploadProductImage } from "./storage";

type SeedProduct = {
  productName: string;
  description: string;
  category: string;
  price: number;
  /** Local filename under public/products (also storage object key) */
  image: string;
  features: string[];
  stock: number;
};

function localImagePath(fileName: string) {
  const imagesDir =
    process.env.PRODUCTS_IMAGE_DIR ||
    path.resolve(process.cwd(), "../../E-commerce/e-commerce/public/products");
  return path.join(imagesDir, fileName);
}

function contentTypeFor(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

const PRODUCTS: SeedProduct[] = [
  {
    productName: "Floral Summer Dress",
    description:
      "Light and breezy floral print dress for everyday wear and outings. Soft fabric, flattering fit, and easy to pair with sandals or sneakers.",
    category: "Fashion",
    price: 1499,
    image: "dress-1.jpg",
    features: [
      "Soft rayon blend",
      "Machine washable",
      "Available in S–XL",
      "Knee-length flare cut",
    ],
    stock: 42,
  },
  {
    productName: "Elegant Party Wear Dress",
    description:
      "Stylish party wear dress with a modern silhouette — perfect for dinners, celebrations, and festive evenings.",
    category: "Fashion",
    price: 2499,
    image: "dress-2.jpg",
    features: [
      "Premium stretch fabric",
      "Zip closure",
      "Dry clean recommended",
      "Statement look",
    ],
    stock: 28,
  },
  {
    productName: "Banarasi Silk Saree",
    description:
      "Traditional Banarasi silk saree with intricate zari work. Ideal for weddings, festivals, and formal occasions.",
    category: "Fashion",
    price: 5999,
    image: "banarasi-saree.jpg",
    features: [
      "Pure silk blend",
      "Rich zari border",
      "Blouse piece included",
      "Festive occasion ready",
    ],
    stock: 15,
  },
  {
    productName: "Cotton Printed Kurti",
    description:
      "Comfortable cotton kurti with vibrant prints. Breathable everyday ethnic wear for college, office, and casual outings.",
    category: "Fashion",
    price: 899,
    image: "kurti.jpg",
    features: [
      "100% cotton",
      "Side slits for ease",
      "Machine washable",
      "Regular fit",
    ],
    stock: 60,
  },
  {
    productName: "Kantha Stitch Tote Bag",
    description:
      "Handcrafted kantha stitch tote with roomy compartments. A practical everyday bag with artisan charm.",
    category: "Fashion",
    price: 799,
    image: "kantha-tote.jpg",
    features: [
      "Hand-stitched kantha",
      "Inner pocket",
      "Durable cotton canvas",
      "Shoulder-friendly straps",
    ],
    stock: 35,
  },
  {
    productName: "Jhumka Earrings",
    description:
      "Classic oxidized jhumka earrings with traditional detailing. Pair with ethnic or fusion outfits.",
    category: "Fashion",
    price: 499,
    image: "jhumka-earrings.jpg",
    features: [
      "Lightweight alloy",
      "Oxidized finish",
      "Push-back closure",
      "Gift-ready packaging",
    ],
    stock: 80,
  },
  {
    productName: "Smartphone Pro 128GB",
    description:
      "Sleek smartphone with a sharp display, dual camera, and all-day battery — built for everyday performance.",
    category: "Mobiles",
    price: 18999,
    image: "mobile-1.jpg",
    features: [
      "6.5-inch AMOLED display",
      "128GB storage",
      "5000 mAh battery",
      "Dual SIM + 5G ready",
    ],
    stock: 40,
  },
  {
    productName: "Smartphone Lite 64GB",
    description:
      "Budget-friendly smartphone for calls, social apps, and entertainment without compromise on battery life.",
    category: "Mobiles",
    price: 9999,
    image: "mobile-2.jpg",
    features: [
      "6.4-inch HD+ display",
      "64GB expandable storage",
      "Fast charging support",
      "Side fingerprint sensor",
    ],
    stock: 55,
  },
  {
    productName: "Ultrabook 14-inch",
    description:
      "Lightweight ultrabook for students and professionals. Fast boot, crisp display, and long battery life.",
    category: "Laptops",
    price: 54999,
    image: "laptop-1.jpg",
    features: [
      "Intel Core i5 / Ryzen 5",
      "16GB RAM",
      "512GB SSD",
      "Backlit keyboard",
    ],
    stock: 22,
  },
  {
    productName: "Creator Laptop 15.6-inch",
    description:
      "Powerful laptop for coding, design, and multitasking with a large Full HD screen.",
    category: "Laptops",
    price: 69999,
    image: "laptop-2.jpg",
    features: [
      "15.6-inch FHD IPS",
      "16GB RAM",
      "1TB SSD",
      "Dedicated graphics option",
    ],
    stock: 18,
  },
  {
    productName: "Kitchen Mixer Grinder",
    description:
      "Powerful mixer grinder for everyday Indian cooking — chutneys, batters, and dry grinding.",
    category: "Kitchen",
    price: 3499,
    image: "kitchen-mixer.jpg",
    features: [
      "750W motor",
      "3 stainless steel jars",
      "Overload protection",
      "2-year warranty",
    ],
    stock: 45,
  },
  {
    productName: "Non-Stick Cookware Set",
    description:
      "Complete non-stick cookware set for everyday meals. Even heat distribution and easy cleanup.",
    category: "Kitchen",
    price: 2999,
    image: "kitchen-cookware.jpg",
    features: [
      "PFOA-free coating",
      "Induction compatible",
      "Cool-touch handles",
      "Dishwasher safe lids",
    ],
    stock: 30,
  },
  {
    productName: "Electric Kettle 1.5L",
    description:
      "Fast-boil electric kettle with auto shut-off. Ideal for tea, coffee, and instant noodles.",
    category: "Kitchen",
    price: 1299,
    image: "kitchen-kettle.jpg",
    features: [
      "1.5 litre capacity",
      "Auto cut-off",
      "Boil-dry protection",
      "Cordless serving",
    ],
    stock: 70,
  },
  {
    productName: "Non-Stick Frying Pan",
    description:
      "Durable non-stick frying pan for dosa, omelettes, and stir-fries with less oil.",
    category: "Kitchen",
    price: 899,
    image: "kitchen-pan.jpg",
    features: [
      "Thick aluminium base",
      "Stay-cool handle",
      "Gas & induction ready",
      "Easy to clean",
    ],
    stock: 65,
  },
  {
    productName: "Wireless Headphones",
    description:
      "Over-ear wireless headphones with deep bass and long playtime for music, calls, and travel.",
    category: "Electronics",
    price: 2499,
    image: "headphones.jpg",
    features: [
      "Bluetooth 5.2",
      "40-hour battery",
      "Folding design",
      "Built-in mic",
    ],
    stock: 50,
  },
  {
    productName: "Smartwatch Fitness",
    description:
      "Fitness smartwatch with heart-rate tracking, sleep insights, and smartphone notifications.",
    category: "Electronics",
    price: 3499,
    image: "smartwatch.jpg",
    features: [
      "1.4-inch colour display",
      "SpO2 & heart rate",
      "IP68 water resistant",
      "Multi-sport modes",
    ],
    stock: 48,
  },
  {
    productName: "Smart LED TV 43-inch",
    description:
      "Full HD smart LED TV with streaming apps, crisp picture, and slim bezel design for living rooms.",
    category: "Electronics",
    price: 27999,
    image: "tv.jpg",
    features: [
      "43-inch Full HD",
      "Built-in Wi-Fi & apps",
      "Multiple HDMI/USB",
      "Dolby Audio support",
    ],
    stock: 20,
  },
  {
    productName: "Running Shoes",
    description:
      "Lightweight running shoes with cushioned soles for daily jogs, gym, and casual wear.",
    category: "Footwear",
    price: 1999,
    image: "shoes.jpg",
    features: [
      "Breathable mesh upper",
      "Cushioned midsole",
      "Anti-slip outsole",
      "Sizes UK 6–11",
    ],
    stock: 55,
  },
  {
    productName: "Kolhapuri Chappal",
    description:
      "Handcrafted Kolhapuri chappals in genuine leather. Classic ethnic footwear with lasting comfort.",
    category: "Footwear",
    price: 1299,
    image: "kolhapuri-chappal.jpg",
    features: [
      "Genuine leather",
      "Traditional braid design",
      "Durable sole",
      "Handcrafted finish",
    ],
    stock: 40,
  },
  {
    productName: "Comfort Sandals",
    description:
      "Everyday comfort sandals with soft footbed — ideal for walks, travel, and casual outings.",
    category: "Footwear",
    price: 999,
    image: "sandals.jpg",
    features: [
      "Soft cushioned footbed",
      "Adjustable strap",
      "Lightweight build",
      "All-day wear",
    ],
    stock: 62,
  },
  {
    productName: "Skincare Essentials Kit",
    description:
      "Daily skincare essentials for clean, hydrated skin. Suitable for most Indian skin types.",
    category: "Beauty",
    price: 1499,
    image: "beauty.jpg",
    features: [
      "Cleanser + moisturizer",
      "Dermatologist tested",
      "Paraben-free",
      "Travel-friendly sizes",
    ],
    stock: 38,
  },
  {
    productName: "Gulab Jal Rose Water",
    description:
      "Pure rose water (gulab jal) for skin toning, refreshing mists, and festive rituals.",
    category: "Beauty",
    price: 249,
    image: "gulab-jal.jpg",
    features: [
      "Steam-distilled",
      "No added alcohol",
      "200 ml bottle",
      "Multi-use toner",
    ],
    stock: 100,
  },
  {
    productName: "Double Door Refrigerator",
    description:
      "Energy-efficient double door fridge with ample freezer space for family kitchens.",
    category: "Home Appliances",
    price: 28999,
    image: "fridge.jpg",
    features: [
      "Frost-free cooling",
      "Large vegetable crisper",
      "Inverter compressor",
      "3-star energy rating",
    ],
    stock: 12,
  },
  {
    productName: "Jaipuri Printed Bedsheet",
    description:
      "Soft cotton Jaipuri printed bedsheet set with pillow covers — vibrant patterns for your bedroom.",
    category: "Home Appliances",
    price: 1299,
    image: "jaipuri-bedsheet.jpg",
    features: [
      "100% cotton",
      "Double bed size",
      "2 pillow covers",
      "Fade-resistant print",
    ],
    stock: 45,
  },
  {
    productName: "Brass Diya Set",
    description:
      "Traditional brass diya set for pooja, Diwali, and home décor. Warm festive glow for every occasion.",
    category: "Home Appliances",
    price: 699,
    image: "brass-diya.jpg",
    features: [
      "Solid brass build",
      "Set of 4",
      "Easy to clean",
      "Gift packaging",
    ],
    stock: 75,
  },
  {
    productName: "Terracotta Kulhad Set",
    description:
      "Earthy terracotta kulhad cups for chai and desserts. Adds authentic chai-stall charm at home.",
    category: "Home Appliances",
    price: 399,
    image: "terracotta-kulhad.jpg",
    features: [
      "Natural clay",
      "Set of 6",
      "Microwave unsafe — hand wash",
      "Eco-friendly",
    ],
    stock: 90,
  },
  {
    productName: "Handcrafted Home Décor Accent",
    description:
      "Artisan home décor piece to brighten living rooms and shelves with warm Indian craft aesthetics.",
    category: "Home Appliances",
    price: 1199,
    image: "home-decor.jpg",
    features: [
      "Handcrafted finish",
      "Lightweight display piece",
      "Unique artisan design",
      "Ready to gift",
    ],
    stock: 33,
  },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    await ensureProductsBucket();
    console.log("Supabase storage bucket ready");

    const repo = AppDataSource.getRepository(Product);
    const existing = await repo.count();

    if (existing > 0) {
      console.log(`Clearing ${existing} existing product(s)...`);
      await repo.clear();
    }

    const seeded: Product[] = [];

    for (const product of PRODUCTS) {
      const fileName = product.image;
      const filePath = localImagePath(fileName);

      if (!fs.existsSync(filePath)) {
        throw new Error(`Image not found: ${filePath}`);
      }

      const buffer = fs.readFileSync(filePath);
      const publicUrl = await uploadProductImage({
        path: fileName,
        body: buffer,
        contentType: contentTypeFor(fileName),
        upsert: true,
      });

      console.log(`Uploaded ${fileName}`);
      seeded.push(
        repo.create({
          ...product,
          image: publicUrl,
        })
      );
    }

    await repo.save(seeded);
    console.log(`Seeded ${seeded.length} products with Supabase image URLs`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();
