import shopMoto from "@/assets/shop-moto.jpg";
import shopPhone from "@/assets/shop-phone.jpg";
import shopLeather from "@/assets/shop-leather.jpg";
import shopElectronics from "@/assets/shop-electronics.jpg";
import shopAppliance from "@/assets/shop-appliance.jpg";

export type CategorySlug =
  | "motorcycle"
  | "personal-item"
  | "electronics"
  | "home-appliances"
  | "phone";

export type Shop = {
  id: string;
  name: string;
  category: CategorySlug;
  categoryLabel: string;
  desc: string;
  distance: string;
  rating: string;
  reviews: string;
  available: boolean;
  services: string[];
  address: string;
  phone: string;
  hours: string;
  image: string;
};

export const categoryLabels: Record<CategorySlug, string> = {
  motorcycle: "Motorcycle",
  "personal-item": "Personal Item",
  electronics: "Electronics",
  "home-appliances": "Home Appliances",
  phone: "Phone",
};

/** All data below is fictional mock data for demo purposes only. */
export const shops: Shop[] = [
  // Motorcycle
  {
    id: "golden-motor-service",
    name: "Golden Motor Service",
    category: "motorcycle",
    categoryLabel: "Motorcycle",
    desc: "Engine diagnostics, tune-ups & roadside rescue",
    distance: "0.6 km",
    rating: "4.9",
    reviews: "312",
    available: true,
    services: ["Engine repair", "Tire repair", "Oil change", "Brake service"],
    address: "No. 24, Bogyoke Road, Riverside Township, Yangon",
    phone: "+95 9 771 220 145",
    hours: "Mon–Sat · 8:00 AM – 7:00 PM",
    image: shopMoto,
  },
  {
    id: "aung-motor-care",
    name: "Aung Motor Care",
    category: "motorcycle",
    categoryLabel: "Motorcycle",
    desc: "Family-run garage for daily commuter bikes",
    distance: "0.9 km",
    rating: "4.7",
    reviews: "188",
    available: true,
    services: ["Engine tune-up", "Chain & sprocket", "Battery replacement"],
    address: "No. 8, Thiri Street, Mingalar Quarter, Mandalay",
    phone: "+95 9 442 883 019",
    hours: "Daily · 7:30 AM – 6:30 PM",
    image: shopMoto,
  },
  {
    id: "city-bike-repair",
    name: "City Bike Repair",
    category: "motorcycle",
    categoryLabel: "Motorcycle",
    desc: "Fast tire patching & electrical fixes downtown",
    distance: "1.4 km",
    rating: "4.5",
    reviews: "146",
    available: false,
    services: ["Tire repair", "Electrical wiring", "Headlight repair"],
    address: "No. 112, Maha Bandula Street, Downtown, Yangon",
    phone: "+95 9 250 774 611",
    hours: "Mon–Fri · 9:00 AM – 5:00 PM",
    image: shopMoto,
  },
  {
    id: "fast-wheel-motorcycle-service",
    name: "Fast Wheel Motorcycle Service",
    category: "motorcycle",
    categoryLabel: "Motorcycle",
    desc: "Same-day servicing with pickup & drop-off",
    distance: "2.1 km",
    rating: "4.6",
    reviews: "204",
    available: true,
    services: ["Full service", "Suspension", "Pickup & drop-off"],
    address: "No. 45, Pyay Road, Hlaing Township, Yangon",
    phone: "+95 9 688 401 552",
    hours: "Daily · 8:00 AM – 8:00 PM",
    image: shopMoto,
  },

  // Personal Item (bags, shoes, clothes, watches)
  {
    id: "premium-shoe-bag-repair",
    name: "Premium Shoe & Bag Repair",
    category: "personal-item",
    categoryLabel: "Personal Item",
    desc: "Leather resoling & restitching for shoes and bags",
    distance: "1.1 km",
    rating: "4.8",
    reviews: "189",
    available: true,
    services: ["Shoe resoling", "Bag restitching", "Leather polish"],
    address: "No. 19, Shwe Gone Daing Road, Bahan, Yangon",
    phone: "+95 9 330 912 774",
    hours: "Mon–Sat · 9:30 AM – 7:00 PM",
    image: shopLeather,
  },
  {
    id: "watch-leather-care",
    name: "Watch & Leather Care",
    category: "personal-item",
    categoryLabel: "Personal Item",
    desc: "Watch servicing, strap replacement & leather care",
    distance: "1.5 km",
    rating: "4.7",
    reviews: "132",
    available: true,
    services: ["Watch battery", "Movement service", "Strap replacement"],
    address: "No. 6, Sein Lann Street, Kamayut, Yangon",
    phone: "+95 9 512 668 903",
    hours: "Tue–Sun · 10:00 AM – 6:00 PM",
    image: shopLeather,
  },
  {
    id: "style-fix-workshop",
    name: "Style Fix Workshop",
    category: "personal-item",
    categoryLabel: "Personal Item",
    desc: "Clothing alterations, zipper & garment repair",
    distance: "1.8 km",
    rating: "4.5",
    reviews: "97",
    available: false,
    services: ["Clothing alteration", "Zipper repair", "Hemming"],
    address: "No. 77, Yadanar Street, Thingangyun, Yangon",
    phone: "+95 9 790 145 228",
    hours: "Mon–Fri · 10:00 AM – 5:30 PM",
    image: shopLeather,
  },
  {
    id: "bag-shoe-service-center",
    name: "Bag & Shoe Service Center",
    category: "personal-item",
    categoryLabel: "Personal Item",
    desc: "Handbag hardware, cleaning & sneaker restoration",
    distance: "2.4 km",
    rating: "4.6",
    reviews: "158",
    available: true,
    services: ["Sneaker restoration", "Bag hardware", "Deep cleaning"],
    address: "No. 31, Kabar Aye Pagoda Road, Yankin, Yangon",
    phone: "+95 9 405 883 116",
    hours: "Daily · 9:00 AM – 7:00 PM",
    image: shopLeather,
  },

  // Electronics
  {
    id: "smarttech-repair-center",
    name: "SmartTech Repair Center",
    category: "electronics",
    categoryLabel: "Electronics",
    desc: "Laptop, TV & audio repair by certified techs",
    distance: "0.7 km",
    rating: "4.8",
    reviews: "241",
    available: true,
    services: ["Laptop repair", "TV repair", "Data recovery"],
    address: "No. 52, Insein Road, Hlaing, Yangon",
    phone: "+95 9 620 118 447",
    hours: "Mon–Sat · 9:00 AM – 7:00 PM",
    image: shopElectronics,
  },
  {
    id: "digital-care-service",
    name: "Digital Care Service",
    category: "electronics",
    categoryLabel: "Electronics",
    desc: "Board-level repair for laptops and consoles",
    distance: "1.2 km",
    rating: "4.6",
    reviews: "176",
    available: true,
    services: ["Motherboard repair", "Console repair", "Screen replacement"],
    address: "No. 14, Anawrahta Road, Lanmadaw, Yangon",
    phone: "+95 9 881 320 596",
    hours: "Mon–Sat · 10:00 AM – 8:00 PM",
    image: shopElectronics,
  },
  {
    id: "city-electronics-fix",
    name: "City Electronics Fix",
    category: "electronics",
    categoryLabel: "Electronics",
    desc: "Speakers, monitors & small electronics",
    distance: "1.9 km",
    rating: "4.4",
    reviews: "119",
    available: false,
    services: ["Speaker repair", "Monitor repair", "Power supply"],
    address: "No. 90, 78th Street, Chan Aye Thar Zan, Mandalay",
    phone: "+95 9 344 906 271",
    hours: "Mon–Fri · 9:30 AM – 6:00 PM",
    image: shopElectronics,
  },
  {
    id: "techpoint-repair",
    name: "TechPoint Repair",
    category: "electronics",
    categoryLabel: "Electronics",
    desc: "Walk-in diagnostics with 90-day warranty",
    distance: "2.6 km",
    rating: "4.7",
    reviews: "205",
    available: true,
    services: ["Diagnostics", "Camera repair", "Printer repair"],
    address: "No. 3, Waizayanta Road, South Okkalapa, Yangon",
    phone: "+95 9 977 462 380",
    hours: "Daily · 9:00 AM – 7:30 PM",
    image: shopElectronics,
  },

  // Home Appliances
  {
    id: "homefix-appliance-service",
    name: "HomeFix Appliance Service",
    category: "home-appliances",
    categoryLabel: "Home Appliances",
    desc: "Washing machine, fridge & AC home visits",
    distance: "0.9 km",
    rating: "4.8",
    reviews: "263",
    available: true,
    services: ["Washing machine", "Refrigerator", "Air conditioner"],
    address: "No. 21, Parami Road, Mayangone, Yangon",
    phone: "+95 9 260 774 118",
    hours: "Daily · 8:00 AM – 7:00 PM",
    image: shopAppliance,
  },
  {
    id: "golden-home-appliance-care",
    name: "Golden Home Appliance Care",
    category: "home-appliances",
    categoryLabel: "Home Appliances",
    desc: "Trusted fridge & freezer specialists",
    distance: "1.3 km",
    rating: "4.7",
    reviews: "187",
    available: true,
    services: ["Refrigerator", "Freezer", "Gas refill"],
    address: "No. 58, Thumingalar Road, Thingangyun, Yangon",
    phone: "+95 9 512 043 776",
    hours: "Mon–Sat · 8:30 AM – 6:30 PM",
    image: shopAppliance,
  },
  {
    id: "city-appliance-repair",
    name: "City Appliance Repair",
    category: "home-appliances",
    categoryLabel: "Home Appliances",
    desc: "Microwave, oven & rice cooker repair",
    distance: "2.0 km",
    rating: "4.5",
    reviews: "141",
    available: false,
    services: ["Microwave", "Oven", "Rice cooker"],
    address: "No. 66, Strand Road, Kyauktada, Yangon",
    phone: "+95 9 703 118 950",
    hours: "Mon–Fri · 9:00 AM – 5:00 PM",
    image: shopAppliance,
  },
  {
    id: "quickfix-home-service",
    name: "QuickFix Home Service",
    category: "home-appliances",
    categoryLabel: "Home Appliances",
    desc: "Same-day home visits across the city",
    distance: "2.8 km",
    rating: "4.6",
    reviews: "224",
    available: true,
    services: ["Home visit", "Water heater", "Electric fan"],
    address: "No. 12, Min Nandar Road, Dawbon, Yangon",
    phone: "+95 9 448 992 305",
    hours: "Daily · 8:00 AM – 8:00 PM",
    image: shopAppliance,
  },

  // Phone
  {
    id: "smart-phone-care",
    name: "Smart Phone Care",
    category: "phone",
    categoryLabel: "Phone",
    desc: "Screen swaps in 30 minutes",
    distance: "0.9 km",
    rating: "4.6",
    reviews: "297",
    available: true,
    services: ["Screen replacement", "Battery", "Charging port"],
    address: "No. 40, Bo Aung Kyaw Street, Kyauktada, Yangon",
    phone: "+95 9 250 118 664",
    hours: "Daily · 9:00 AM – 8:00 PM",
    image: shopPhone,
  },
  {
    id: "mobile-doctor-hub",
    name: "Mobile Doctor Hub",
    category: "phone",
    categoryLabel: "Phone",
    desc: "Water damage recovery & software fixes",
    distance: "1.6 km",
    rating: "4.7",
    reviews: "163",
    available: true,
    services: ["Water damage", "Software fix", "Camera repair"],
    address: "No. 29, Sule Pagoda Road, Pabedan, Yangon",
    phone: "+95 9 660 447 209",
    hours: "Mon–Sat · 10:00 AM – 7:00 PM",
    image: shopPhone,
  },
  {
    id: "pyi-phone-service",
    name: "Pyi Phone Service",
    category: "phone",
    categoryLabel: "Phone",
    desc: "Genuine parts with 60-day warranty",
    distance: "2.3 km",
    rating: "4.5",
    reviews: "128",
    available: false,
    services: ["Screen replacement", "Speaker repair", "Unlocking"],
    address: "No. 5, 35th Street, Kyauktada, Yangon",
    phone: "+95 9 315 880 472",
    hours: "Mon–Fri · 9:30 AM – 6:00 PM",
    image: shopPhone,
  },
];

export const frequentSearches = [
  { label: "Motorcycle Repair", query: "motorcycle" },
  { label: "Tire Repair", query: "tire" },
  { label: "Phone Repair", query: "phone" },
  { label: "Watch Repair", query: "watch" },
  { label: "Shoe Repair", query: "shoe" },
];

export function getShop(id: string) {
  return shops.find((s) => s.id === id);
}

export function shopsByCategory(category: string) {
  return shops.filter((s) => s.category === category);
}

export function searchShops(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return shops;
  return shops.filter((s) =>
    [s.name, s.categoryLabel, s.desc, s.services.join(" "), s.address]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
