/**
 * Reparo admin demo store.
 *
 * Hackathon demo only: admin records live in localStorage so the whole
 * admin -> customer workflow works without a backend. Customer shop data
 * still comes from Supabase; admin edits are applied as an overlay on top.
 */
import { useSyncExternalStore } from "react";
import {
  categoryImages,
  categoryShopLabels,
  categoryLabels,
  type CategorySlug,
  type Shop,
} from "@/lib/shops";

/* ---------------------------------- types --------------------------------- */

export type AdStatus = "active" | "inactive";
export type ShopStatus = "active" | "inactive";
export type NoticeStatus = "published" | "draft";
export type AdPackage = "basic" | "standard" | "premium";

export type AdminShop = {
  id: string;
  name: string;
  category: CategorySlug;
  description: string;
  address: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  rating: number;
  reviewCount: number;
  distance: string;
  paymentMethods: string;
  imageUrl: string;
  services: string[];
  status: ShopStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Advertisement = {
  id: string;
  shopId: string;
  title: string;
  description: string;
  imageUrl: string;
  pkg: AdPackage;
  startDate: string;
  endDate: string;
  status: AdStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  status: NoticeStatus;
  important: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminState = {
  /** Created shops + edits applied over the live Supabase shops, keyed by id. */
  shops: Record<string, AdminShop>;
  /** Ids hidden from the customer app. */
  deletedShopIds: string[];
  ads: Advertisement[];
  notices: Notice[];
};

export const adPackages: Record<AdPackage, { label: string; days: number; perks: string }> = {
  basic: { label: "Basic", days: 7, perks: "Standard placement" },
  standard: { label: "Standard", days: 14, perks: "Higher visibility" },
  premium: { label: "Premium", days: 30, perks: "Featured placement + higher visibility" },
};

/* ------------------------------- seed values ------------------------------ */

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const DEMO_SHOP_ID = "demo-bag-spa";

function seedState(): AdminState {
  const shop: AdminShop = {
    id: DEMO_SHOP_ID,
    name: "ရွှေမန္တလာ သားရေအိတ်ဖာထေးနှင့် Bag Spa",
    category: "bag",
    description: "သားရေအိတ်ဖာထေး၊ ဇစ်လဲလှယ်ခြင်းနှင့် Bag Spa သန့်စင်ဝန်ဆောင်မှု။",
    address: "၇၈ လမ်း၊ ၃၀ x ၃၁ လမ်းကြား၊ မန္တလေးမြို့",
    phone: "09-792012345",
    openingTime: "09:00 AM",
    closingTime: "06:00 PM",
    rating: 4.9,
    reviewCount: 142,
    distance: "0.8 km",
    paymentMethods: "KBZPay, WavePay, Cash",
    imageUrl: categoryImages.bag,
    services: ["ဇစ်လဲလှယ်ခြင်း", "သားရေဖာထေးခြင်း", "Bag Spa သန့်စင်ခြင်း"],
    status: "active",
    featured: true,
    createdAt: now(),
    updatedAt: now(),
  };

  const ad: Advertisement = {
    id: "demo-ad-1",
    shopId: DEMO_SHOP_ID,
    title: "Bag Spa Premium ဝန်ဆောင်မှု",
    description: "သားရေအိတ်များအတွက် ပရော်ဖက်ရှင်နယ် ဖာထေးမှုနှင့် သန့်စင်မှု။",
    imageUrl: categoryImages.bag,
    pkg: "premium",
    startDate: today(),
    endDate: plusDays(30),
    status: "active",
    featured: true,
    createdAt: now(),
    updatedAt: now(),
  };

  const notice: Notice = {
    id: "demo-notice-1",
    title: "New Repair Shops Available in Mandalay",
    content:
      "Reparo has added new repair shops for bags, shoes, watches, clothes, leather products and other wearable items. Find a trusted repair shop near you through Reparo.",
    imageUrl: "",
    date: today(),
    status: "published",
    important: true,
    createdAt: now(),
    updatedAt: now(),
  };

  return { shops: { [shop.id]: shop }, deletedShopIds: [], ads: [ad], notices: [notice] };
}

/* --------------------------------- store ---------------------------------- */

const KEY = "reparo_admin_store_v1";
const EVENT = "reparo-admin-store";

let cache: AdminState | null = null;

function read(): AdminState {
  if (cache) return cache;
  if (typeof window === "undefined") return seedState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminState;
      cache = {
        shops: parsed.shops ?? {},
        deletedShopIds: parsed.deletedShopIds ?? [],
        ads: parsed.ads ?? [],
        notices: parsed.notices ?? [],
      };
      return cache;
    }
  } catch {
    /* ignore corrupt storage */
  }
  cache = seedState();
  window.localStorage.setItem(KEY, JSON.stringify(cache));
  return cache;
}

function write(next: AdminState) {
  cache = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const serverSnapshot = seedState();

export function useAdminState(): AdminState {
  return useSyncExternalStore(subscribe, read, () => serverSnapshot);
}

function update(fn: (state: AdminState) => AdminState) {
  write(fn(read()));
}

const uid = () => `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/* ------------------------------- shop actions ------------------------------ */

export function emptyShop(): AdminShop {
  return {
    id: "",
    name: "",
    category: "bag",
    description: "",
    address: "",
    phone: "",
    openingTime: "09:00 AM",
    closingTime: "06:00 PM",
    rating: 4.5,
    reviewCount: 0,
    distance: "1.0 km",
    paymentMethods: "Cash",
    imageUrl: "",
    services: [],
    status: "active",
    featured: false,
    createdAt: "",
    updatedAt: "",
  };
}

export function saveShop(shop: AdminShop) {
  const id = shop.id || uid();
  const record: AdminShop = {
    ...shop,
    id,
    imageUrl: shop.imageUrl || categoryImages[shop.category],
    createdAt: shop.createdAt || now(),
    updatedAt: now(),
  };
  update((s) => ({
    ...s,
    shops: { ...s.shops, [id]: record },
    deletedShopIds: s.deletedShopIds.filter((d) => d !== id),
  }));
  return record;
}

export function deleteShop(id: string) {
  update((s) => {
    const shops = { ...s.shops };
    delete shops[id];
    return {
      ...s,
      shops,
      deletedShopIds: [...new Set([...s.deletedShopIds, id])],
      ads: s.ads.filter((a) => a.shopId !== id),
    };
  });
}

export function setShopStatus(shop: AdminShop, status: ShopStatus) {
  saveShop({ ...shop, status });
}

/* -------------------------------- ad actions ------------------------------- */

export function emptyAd(): Advertisement {
  return {
    id: "",
    shopId: "",
    title: "",
    description: "",
    imageUrl: "",
    pkg: "basic",
    startDate: today(),
    endDate: plusDays(7),
    status: "active",
    featured: false,
    createdAt: "",
    updatedAt: "",
  };
}

export function saveAd(ad: Advertisement) {
  const id = ad.id || uid();
  const record: Advertisement = { ...ad, id, createdAt: ad.createdAt || now(), updatedAt: now() };
  update((s) => ({
    ...s,
    ads: s.ads.some((a) => a.id === id)
      ? s.ads.map((a) => (a.id === id ? record : a))
      : [record, ...s.ads],
  }));
  return record;
}

export function deleteAd(id: string) {
  update((s) => ({ ...s, ads: s.ads.filter((a) => a.id !== id) }));
}

export function toggleAd(id: string) {
  update((s) => ({
    ...s,
    ads: s.ads.map((a) =>
      a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active", updatedAt: now() } : a,
    ),
  }));
}

/* ------------------------------ notice actions ----------------------------- */

export function emptyNotice(): Notice {
  return {
    id: "",
    title: "",
    content: "",
    imageUrl: "",
    date: today(),
    status: "draft",
    important: false,
    createdAt: "",
    updatedAt: "",
  };
}

export function saveNotice(notice: Notice) {
  const id = notice.id || uid();
  const record: Notice = {
    ...notice,
    id,
    createdAt: notice.createdAt || now(),
    updatedAt: now(),
  };
  update((s) => ({
    ...s,
    notices: s.notices.some((n) => n.id === id)
      ? s.notices.map((n) => (n.id === id ? record : n))
      : [record, ...s.notices],
  }));
  return record;
}

export function deleteNotice(id: string) {
  update((s) => ({ ...s, notices: s.notices.filter((n) => n.id !== id) }));
}

export function toggleNoticeStatus(id: string) {
  update((s) => ({
    ...s,
    notices: s.notices.map((n) =>
      n.id === id
        ? { ...n, status: n.status === "published" ? "draft" : "published", updatedAt: now() }
        : n,
    ),
  }));
}

/* ------------------------------- conversions ------------------------------- */

export function adminToShop(a: AdminShop): Shop {
  const distanceKm = Number.parseFloat(a.distance.replace(/[^\d.]/g, "")) || 1;
  return {
    id: a.id,
    name: a.name,
    category: a.category,
    categoryLabel: categoryLabels[a.category],
    desc: a.description,
    distanceKm,
    distance: a.distance,
    ratingValue: a.rating,
    rating: a.rating.toFixed(1),
    reviews: String(a.reviewCount),
    isOpen: a.status === "active",
    available: a.status === "active",
    services: a.services,
    address: a.address,
    phone: a.phone,
    hours: `${a.openingTime} - ${a.closingTime}`,
    priceRange: "",
    paymentMethods: a.paymentMethods,
    image: a.imageUrl || categoryImages[a.category],
  };
}

export function shopToAdmin(s: Shop): AdminShop {
  const [openingTime = "09:00 AM", closingTime = "06:00 PM"] = (s.hours || "").split(/\s*[-–]\s*/);
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.desc,
    address: s.address,
    phone: s.phone,
    openingTime,
    closingTime,
    rating: s.ratingValue,
    reviewCount: Number(s.reviews) || 0,
    distance: s.distance,
    paymentMethods: s.paymentMethods ?? "",
    imageUrl: s.image,
    services: s.services,
    status: s.isOpen ? "active" : "inactive",
    featured: false,
    createdAt: "",
    updatedAt: "",
  };
}

/** Applies admin overrides/additions/removals on top of the live shop list. */
export function mergeShops(base: Shop[], state: AdminState, opts?: { customerView?: boolean }): Shop[] {
  const deleted = new Set(state.deletedShopIds);
  const merged: Shop[] = [];
  const usedIds = new Set<string>();

  for (const s of base) {
    if (deleted.has(s.id)) continue;
    const override = state.shops[s.id];
    usedIds.add(s.id);
    merged.push(override ? adminToShop(override) : s);
  }
  for (const a of Object.values(state.shops)) {
    if (usedIds.has(a.id) || deleted.has(a.id)) continue;
    merged.unshift(adminToShop(a));
  }

  if (!opts?.customerView) return merged;
  const inactive = new Set(
    Object.values(state.shops).filter((a) => a.status === "inactive").map((a) => a.id),
  );
  return merged.filter((s) => !deleted.has(s.id) && !inactive.has(s.id));
}

/** Admin table rows: live shops converted to admin records, plus admin records. */
export function mergeAdminShops(base: Shop[], state: AdminState): AdminShop[] {
  const deleted = new Set(state.deletedShopIds);
  const rows: AdminShop[] = [];
  const usedIds = new Set<string>();

  for (const s of base) {
    if (deleted.has(s.id)) continue;
    usedIds.add(s.id);
    rows.push(state.shops[s.id] ?? shopToAdmin(s));
  }
  for (const a of Object.values(state.shops)) {
    if (usedIds.has(a.id) || deleted.has(a.id)) continue;
    rows.unshift(a);
  }
  return rows;
}

export function shopTypeLabel(slug: CategorySlug) {
  return categoryShopLabels[slug] ?? slug;
}

/* ------------------------- customer-facing selectors ----------------------- */

export function isAdLive(ad: Advertisement, ref = new Date()) {
  if (ad.status !== "active") return false;
  const start = new Date(`${ad.startDate}T00:00:00`);
  const end = new Date(`${ad.endDate}T23:59:59`);
  return ref >= start && ref <= end;
}

export function useActiveAds(): Advertisement[] {
  const state = useAdminState();
  return state.ads.filter((a) => isAdLive(a));
}

export function usePublishedNotices(): Notice[] {
  const state = useAdminState();
  return [...state.notices]
    .filter((n) => n.status === "published")
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/* --------------------------- demo admin auth (static) ---------------------- */

const ADMIN_KEY = "reparo_admin_session";
const ADMIN_EMAIL = "phoomyat@gmail.com";
const ADMIN_PASSWORD = "12345";

export function adminLogin(email: string, password: string) {
  const ok = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  if (ok && typeof window !== "undefined") {
    window.localStorage.setItem(ADMIN_KEY, email.trim().toLowerCase());
    window.dispatchEvent(new Event(EVENT));
  }
  return ok;
}

export function adminLogout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function readAdminSession(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_KEY);
}

export function useAdminSession(): string | null {
  return useSyncExternalStore(subscribe, readAdminSession, () => null);
}
