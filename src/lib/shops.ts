import shopBag from "@/assets/shop-bag.jpg";
import shopClothes from "@/assets/shop-clothes.jpg";
import shopWatch from "@/assets/shop-watch.jpg";
import shopShoes from "@/assets/shop-shoes.jpg";
import shopKeys from "@/assets/shop-keys.jpg";
import shopGlasses from "@/assets/shop-glasses.jpg";

export type CategorySlug = "bag" | "clothes" | "watches" | "shoes" | "keys" | "glasses";

export type SortKey = "none" | "nearest" | "available" | "rating";

export type Shop = {
  id: string;
  name: string;
  category: CategorySlug;
  categoryLabel: string;
  desc: string;
  distanceKm: number;
  /** Formatted distance, e.g. "0.6 km" */
  distance: string;
  ratingValue: number;
  /** Formatted rating, e.g. "4.9" */
  rating: string;
  reviews: string;
  isOpen: boolean;
  /** Alias of isOpen used by presentation components. */
  available: boolean;
  services: string[];
  address: string;
  phone: string;
  hours: string;
  priceRange: string;
  paymentMethods?: string;
  image: string;

};

export const categoryLabels: Record<CategorySlug, string> = {
  bag: "Bag",
  clothes: "Clothes",
  watches: "Watches",
  shoes: "Shoes",
  keys: "Keys",
  glasses: "Glasses",
};

export const categorySlugs: CategorySlug[] = [
  "bag",
  "clothes",
  "watches",
  "shoes",
  "keys",
  "glasses",
];

const categoryImages: Record<CategorySlug, string> = {
  bag: shopBag,
  clothes: shopClothes,
  watches: shopWatch,
  shoes: shopShoes,
  keys: shopKeys,
  glasses: shopGlasses,
};

type RawShop = Omit<
  Shop,
  "categoryLabel" | "distance" | "rating" | "available" | "image"
>;

/** All data below is fictional mock data for demo purposes only. */
const rawShops: RawShop[] = [
  // Bag
  {
    id: "master-leather-bag-spa",
    name: "Master Leather & Bag Spa",
    category: "bag",
    desc: "Leather restoration, bag spa cleaning & hardware replacement",
    distanceKm: 0.5,
    ratingValue: 4.9,
    reviews: "312",
    isOpen: true,
    services: ["Zipper repair", "Leather restoration", "Bag spa", "Hardware replacement"],
    address: "No. 24, 78th Street, Chan Aye Thar Zan, Mandalay",
    phone: "+95 9 771 220 145",
    hours: "Mon–Sat · 9:00 AM – 7:00 PM",
    priceRange: "5,000 – 45,000 MMK",
  },
  {
    id: "shwe-bag-care",
    name: "Shwe Bag Care",
    category: "bag",
    desc: "Everyday backpack & handbag repairs while you wait",
    distanceKm: 1.2,
    ratingValue: 4.6,
    reviews: "184",
    isOpen: true,
    services: ["Zipper replacement", "Strap repair", "Lining repair"],
    address: "No. 8, Thiri Street, Mingalar Quarter, Mandalay",
    phone: "+95 9 442 883 019",
    hours: "Daily · 8:30 AM – 6:30 PM",
    priceRange: "3,000 – 25,000 MMK",
  },
  {
    id: "heritage-bag-atelier",
    name: "Heritage Bag Atelier",
    category: "bag",
    desc: "Designer bag colour restoration & edge painting",
    distanceKm: 2.4,
    ratingValue: 4.8,
    reviews: "141",
    isOpen: false,
    services: ["Colour restoration", "Edge painting", "Deep cleaning"],
    address: "No. 19, Shwe Gone Daing Road, Bahan, Yangon",
    phone: "+95 9 330 912 774",
    hours: "Tue–Sun · 10:00 AM – 6:00 PM",
    priceRange: "15,000 – 80,000 MMK",
  },
  {
    id: "city-bag-fix",
    name: "City Bag Fix",
    category: "bag",
    desc: "Budget-friendly school & travel bag repair",
    distanceKm: 3.1,
    ratingValue: 4.3,
    reviews: "96",
    isOpen: true,
    services: ["Zipper repair", "Wheel replacement", "Handle repair"],
    address: "No. 112, Maha Bandula Street, Downtown, Yangon",
    phone: "+95 9 250 774 611",
    hours: "Mon–Sat · 9:00 AM – 5:30 PM",
    priceRange: "2,000 – 18,000 MMK",
  },

  // Clothes
  {
    id: "quick-stitch-tailoring",
    name: "Quick Stitch Tailoring",
    category: "clothes",
    desc: "Same-day alterations, resizing & zipper replacement",
    distanceKm: 0.7,
    ratingValue: 4.8,
    reviews: "268",
    isOpen: true,
    services: ["Pants resizing", "Hemming", "Zipper replacement", "Stitching"],
    address: "No. 45, 26th Street, Aung Myay Thar Zan, Mandalay",
    phone: "+95 9 688 401 552",
    hours: "Daily · 9:00 AM – 8:00 PM",
    priceRange: "2,000 – 20,000 MMK",
  },
  {
    id: "thiri-tailor-house",
    name: "Thiri Tailor House",
    category: "clothes",
    desc: "Traditional longyi & formal wear tailoring",
    distanceKm: 1.6,
    ratingValue: 4.7,
    reviews: "175",
    isOpen: true,
    services: ["Tailoring", "Alteration", "Button & seam repair"],
    address: "No. 6, Sein Lann Street, Kamayut, Yangon",
    phone: "+95 9 512 668 903",
    hours: "Mon–Sat · 9:30 AM – 7:00 PM",
    priceRange: "5,000 – 60,000 MMK",
  },
  {
    id: "style-fix-workshop",
    name: "Style Fix Workshop",
    category: "clothes",
    desc: "Denim repair, patching & garment restyling",
    distanceKm: 2.2,
    ratingValue: 4.5,
    reviews: "97",
    isOpen: false,
    services: ["Denim repair", "Patching", "Restyling"],
    address: "No. 77, Yadanar Street, Thingangyun, Yangon",
    phone: "+95 9 790 145 228",
    hours: "Mon–Fri · 10:00 AM – 5:30 PM",
    priceRange: "3,000 – 30,000 MMK",
  },
  {
    id: "urban-thread-studio",
    name: "Urban Thread Studio",
    category: "clothes",
    desc: "Knitwear mending & invisible stitching specialists",
    distanceKm: 3.5,
    ratingValue: 4.4,
    reviews: "88",
    isOpen: true,
    services: ["Invisible stitching", "Knitwear mending", "Lining repair"],
    address: "No. 31, Kabar Aye Pagoda Road, Yankin, Yangon",
    phone: "+95 9 405 883 116",
    hours: "Daily · 10:00 AM – 7:00 PM",
    priceRange: "4,000 – 28,000 MMK",
  },

  // Watches
  {
    id: "precision-watch-horology",
    name: "Precision Watch & Horology",
    category: "watches",
    desc: "Certified movement servicing & mechanical overhaul",
    distanceKm: 0.9,
    ratingValue: 4.9,
    reviews: "231",
    isOpen: true,
    services: ["Battery replacement", "Movement servicing", "Strap fix", "Water seal test"],
    address: "No. 52, 35th Street, Chan Aye Thar Zan, Mandalay",
    phone: "+95 9 620 118 447",
    hours: "Mon–Sat · 9:00 AM – 7:00 PM",
    priceRange: "5,000 – 120,000 MMK",
  },
  {
    id: "golden-time-watch-care",
    name: "Golden Time Watch Care",
    category: "watches",
    desc: "Battery change in 10 minutes & strap sizing",
    distanceKm: 1.4,
    ratingValue: 4.6,
    reviews: "163",
    isOpen: true,
    services: ["Watch battery change", "Strap sizing", "Glass polish"],
    address: "No. 29, Sule Pagoda Road, Pabedan, Yangon",
    phone: "+95 9 660 447 209",
    hours: "Daily · 9:30 AM – 8:00 PM",
    priceRange: "3,000 – 35,000 MMK",
  },
  {
    id: "classic-dial-repair",
    name: "Classic Dial Repair",
    category: "watches",
    desc: "Vintage dial restoration & crystal replacement",
    distanceKm: 2.7,
    ratingValue: 4.7,
    reviews: "112",
    isOpen: false,
    services: ["Dial restoration", "Crystal replacement", "Crown repair"],
    address: "No. 5, 35th Street, Kyauktada, Yangon",
    phone: "+95 9 315 880 472",
    hours: "Tue–Sat · 10:00 AM – 6:00 PM",
    priceRange: "10,000 – 150,000 MMK",
  },
  {
    id: "tick-tock-service-point",
    name: "Tick Tock Service Point",
    category: "watches",
    desc: "Smartwatch screens & quartz repairs",
    distanceKm: 3.8,
    ratingValue: 4.2,
    reviews: "74",
    isOpen: true,
    services: ["Smartwatch screen", "Quartz repair", "Battery replacement"],
    address: "No. 3, Waizayanta Road, South Okkalapa, Yangon",
    phone: "+95 9 977 462 380",
    hours: "Daily · 10:00 AM – 7:30 PM",
    priceRange: "6,000 – 90,000 MMK",
  },

  // Shoes
  {
    id: "pro-sole-shoe-repair",
    name: "Pro Sole Shoe Repair",
    category: "shoes",
    desc: "Sole replacement, heel repair & sneaker spa",
    distanceKm: 0.6,
    ratingValue: 4.8,
    reviews: "289",
    isOpen: true,
    services: ["Sole replacement", "Heel repair", "Shoe cleaning", "Recolouring"],
    address: "No. 21, 62nd Street, Mahaaungmyay, Mandalay",
    phone: "+95 9 260 774 118",
    hours: "Daily · 8:30 AM – 7:30 PM",
    priceRange: "4,000 – 40,000 MMK",
  },
  {
    id: "sneaker-lab-mandalay",
    name: "Sneaker Lab Mandalay",
    category: "shoes",
    desc: "Sneaker deep cleaning & midsole restoration",
    distanceKm: 1.8,
    ratingValue: 4.7,
    reviews: "196",
    isOpen: true,
    services: ["Sneaker spa", "Midsole restoration", "Deodorising"],
    address: "No. 58, Thumingalar Road, Thingangyun, Yangon",
    phone: "+95 9 512 043 776",
    hours: "Mon–Sat · 10:00 AM – 8:00 PM",
    priceRange: "6,000 – 35,000 MMK",
  },
  {
    id: "royal-leather-cobbler",
    name: "Royal Leather Cobbler",
    category: "shoes",
    desc: "Hand-finished leather resoling & polish",
    distanceKm: 2.5,
    ratingValue: 4.6,
    reviews: "134",
    isOpen: false,
    services: ["Leather resoling", "Stitch repair", "Mirror polish"],
    address: "No. 66, Strand Road, Kyauktada, Yangon",
    phone: "+95 9 703 118 950",
    hours: "Mon–Fri · 9:00 AM – 5:00 PM",
    priceRange: "8,000 – 60,000 MMK",
  },
  {
    id: "step-up-shoe-clinic",
    name: "Step Up Shoe Clinic",
    category: "shoes",
    desc: "Heel tips, sandal straps & school shoe fixes",
    distanceKm: 3.3,
    ratingValue: 4.3,
    reviews: "102",
    isOpen: true,
    services: ["Heel tip", "Strap repair", "Glue & press"],
    address: "No. 12, Min Nandar Road, Dawbon, Yangon",
    phone: "+95 9 448 992 305",
    hours: "Daily · 9:00 AM – 7:00 PM",
    priceRange: "1,500 – 15,000 MMK",
  },

  // Keys
  {
    id: "apex-lock-key-247",
    name: "24/7 Apex Lock & Key",
    category: "keys",
    desc: "Round-the-clock key cutting, lockouts & lock repair",
    distanceKm: 0.8,
    ratingValue: 4.9,
    reviews: "254",
    isOpen: true,
    services: ["Key duplication", "Lock repair", "Emergency lockout", "Transponder key"],
    address: "No. 40, 84th Street, Chan Aye Thar Zan, Mandalay",
    phone: "+95 9 250 118 664",
    hours: "Open 24 hours",
    priceRange: "2,000 – 70,000 MMK",
  },
  {
    id: "safe-key-locksmith",
    name: "Safe Key Locksmith",
    category: "keys",
    desc: "Digital door locks & smart lock installation",
    distanceKm: 1.5,
    ratingValue: 4.6,
    reviews: "148",
    isOpen: true,
    services: ["Digital key", "Smart lock setup", "Lock rekeying"],
    address: "No. 14, Anawrahta Road, Lanmadaw, Yangon",
    phone: "+95 9 881 320 596",
    hours: "Daily · 8:00 AM – 8:00 PM",
    priceRange: "10,000 – 250,000 MMK",
  },
  {
    id: "downtown-key-cutting",
    name: "Downtown Key Cutting",
    category: "keys",
    desc: "Walk-in key copies in under five minutes",
    distanceKm: 2.1,
    ratingValue: 4.4,
    reviews: "119",
    isOpen: false,
    services: ["Key cutting", "Padlock repair", "Cabinet keys"],
    address: "No. 90, 78th Street, Chan Aye Thar Zan, Mandalay",
    phone: "+95 9 344 906 271",
    hours: "Mon–Fri · 9:30 AM – 6:00 PM",
    priceRange: "1,500 – 12,000 MMK",
  },
  {
    id: "guardian-lock-service",
    name: "Guardian Lock Service",
    category: "keys",
    desc: "Home & office lock servicing with site visits",
    distanceKm: 3.6,
    ratingValue: 4.5,
    reviews: "131",
    isOpen: true,
    services: ["On-site visit", "Deadbolt install", "Master key system"],
    address: "No. 21, Parami Road, Mayangone, Yangon",
    phone: "+95 9 448 220 178",
    hours: "Daily · 8:00 AM – 7:00 PM",
    priceRange: "15,000 – 180,000 MMK",
  },

  // Glasses
  {
    id: "clearvision-eyewear-repair",
    name: "ClearVision Eyewear Repair",
    category: "glasses",
    desc: "Frame tightening, hinge welding & lens replacement",
    distanceKm: 0.9,
    ratingValue: 4.8,
    reviews: "207",
    isOpen: true,
    services: ["Frame adjustment", "Hinge repair", "Lens replacement", "Scratch care"],
    address: "No. 30, 27th Street, Chan Aye Thar Zan, Mandalay",
    phone: "+95 9 977 118 402",
    hours: "Mon–Sat · 9:00 AM – 7:00 PM",
    priceRange: "3,000 – 90,000 MMK",
  },
  {
    id: "optic-care-studio",
    name: "Optic Care Studio",
    category: "glasses",
    desc: "Anti-glare coating & prescription lens fitting",
    distanceKm: 1.7,
    ratingValue: 4.7,
    reviews: "156",
    isOpen: true,
    services: ["Lens fitting", "Anti-glare coating", "Nose pad replacement"],
    address: "No. 52, Insein Road, Hlaing, Yangon",
    phone: "+95 9 620 774 331",
    hours: "Daily · 9:30 AM – 8:00 PM",
    priceRange: "8,000 – 150,000 MMK",
  },
  {
    id: "frame-fix-optical",
    name: "Frame Fix Optical",
    category: "glasses",
    desc: "Titanium & metal frame soldering repairs",
    distanceKm: 2.9,
    ratingValue: 4.5,
    reviews: "98",
    isOpen: false,
    services: ["Frame soldering", "Arm replacement", "Screw repair"],
    address: "No. 9, Bo Aung Kyaw Street, Kyauktada, Yangon",
    phone: "+95 9 315 402 668",
    hours: "Mon–Fri · 10:00 AM – 6:00 PM",
    priceRange: "5,000 – 60,000 MMK",
  },
  {
    id: "bright-eye-glasses-clinic",
    name: "Bright Eye Glasses Clinic",
    category: "glasses",
    desc: "Kids & sports eyewear repair with same-day pickup",
    distanceKm: 3.4,
    ratingValue: 4.2,
    reviews: "71",
    isOpen: true,
    services: ["Frame tightening", "Sports strap", "Lens polishing"],
    address: "No. 18, Waizayanta Road, Thingangyun, Yangon",
    phone: "+95 9 703 664 205",
    hours: "Daily · 9:00 AM – 7:00 PM",
    priceRange: "2,000 – 40,000 MMK",
  },
];

export const shops: Shop[] = rawShops.map((s) => ({
  ...s,
  categoryLabel: categoryLabels[s.category],
  distance: `${s.distanceKm.toFixed(1)} km`,
  rating: s.ratingValue.toFixed(1),
  available: s.isOpen,
  image: categoryImages[s.category],
}));

export const frequentSearches: { label: string; query: string }[] = [
  { label: "Zipper replacement", query: "zipper" },
  { label: "Shoe sole repair", query: "sole" },
  { label: "Watch battery change", query: "battery" },
  { label: "Pants resizing & alteration", query: "resizing" },
  { label: "Key cutting & lock fix", query: "key" },
  { label: "Glasses frame adjustment", query: "frame" },
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

export function filterAndSortShops({
  query = "",
  category = "all",
  sort = "none",
}: {
  query?: string;
  category?: string;
  sort?: string;
}): Shop[] {
  let list = searchShops(query);

  if (category !== "all") {
    list = list.filter((s) => s.category === category);
  }

  if (sort === "available") return list.filter((s) => s.isOpen);
  if (sort === "nearest") return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
  if (sort === "rating") return [...list].sort((a, b) => b.ratingValue - a.ratingValue);

  return list;
}
