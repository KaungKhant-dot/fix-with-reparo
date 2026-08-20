import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  categoryLabels,
  shops as mockShops,
  type CategorySlug,
  type Shop,
} from "@/lib/shops";

/* ---------------------------------- types --------------------------------- */

export type Category = { slug: string; label: string; icon: string | null };

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  categorySlug: string | null;
  isRead: boolean;
  createdAt: string | null;
};

/* -------------------------------- categories ------------------------------- */

export function useCategories(): UseQueryResult<Category[]> {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("slug, name, icon")
        .order("name");
      if (error) throw error;
      return (data ?? [])
        .filter((c) => Boolean(c.slug))
        .map((c) => ({ slug: c.slug as string, label: c.name ?? c.slug, icon: c.icon ?? null }));
    },
    staleTime: 5 * 60_000,
  });
}

/* ---------------------------------- shops --------------------------------- */

function parseDistance(value: string | null): number {
  const n = Number.parseFloat((value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 99;
}

type ShopRow = {
  id: string;
  name: string | null;
  category_slug: string | null;
  rating: number | string | null;
  reviews_count: number | null;
  distance: string | null;
  is_open: boolean | null;
  opening_hours: string | null;
  address: string | null;
  phone: string | null;
  payment_methods: string | null;
};

const shopColumns =
  "id, name, category_slug, rating, reviews_count, distance, is_open, opening_hours, address, phone, payment_methods";

/** Maps a database row onto the presentation `Shop` shape used across the UI. */
function mapShop(row: ShopRow): Shop {
  const slug = (row.category_slug ?? "bag") as CategorySlug;
  const distanceKm = parseDistance(row.distance);
  const ratingValue = Number(row.rating ?? 0);
  const categoryImage = mockShops.find((s) => s.category === slug)?.image;

  return {
    id: row.id,
    name: row.name ?? "Repair shop",
    category: slug,
    categoryLabel: categoryLabels[slug] ?? slug,
    desc: "",
    distanceKm,
    distance: row.distance ?? `${distanceKm.toFixed(1)} km`,
    ratingValue,
    rating: ratingValue.toFixed(1),
    reviews: row.reviews_count != null ? String(row.reviews_count) : "",
    isOpen: row.is_open ?? false,
    available: row.is_open ?? false,
    services: [],
    address: row.address ?? "",
    phone: row.phone ?? "",
    hours: row.opening_hours ?? "",
    priceRange: "",
    paymentMethods: row.payment_methods ?? "",
    image: categoryImage ?? mockShops[0]!.image,
  };
}

export type ShopFilters = { query?: string; category?: string; sort?: string };

export function applyClientFilters(list: Shop[], { query = "", sort = "none" }: ShopFilters) {
  const q = query.trim().toLowerCase();
  let out = q
    ? list.filter((s) =>
        [s.name, s.categoryLabel, s.desc, s.services.join(" "), s.address]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    : list;

  if (sort === "available") out = out.filter((s) => s.isOpen);
  if (sort === "nearest") out = [...out].sort((a, b) => a.distanceKm - b.distanceKm);
  if (sort === "rating") out = [...out].sort((a, b) => b.ratingValue - a.ratingValue);
  return out;
}

async function fetchShops(category: string): Promise<Shop[]> {
  let q = supabase.from("repair_shops").select(shopColumns);
  if (category && category !== "all") q = q.eq("category_slug", category);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((row) => mapShop(row as ShopRow));
}

/** Live shops from Supabase, filtered and sorted on the client. */
export function useShops(filters: ShopFilters = {}) {
  const category = filters.category ?? "all";
  const query = useQuery({
    queryKey: ["repair_shops", category],
    queryFn: () => fetchShops(category),
    staleTime: 60_000,
  });

  return {
    shops: applyClientFilters(query.data ?? [], filters),
    isLoading: query.isLoading,
    offline: query.isError,
  };
}


export function useShop(shopId: string) {
  return useQuery({
    queryKey: ["repair_shop", shopId],
    queryFn: async (): Promise<Shop | null> => {
      const { data, error } = await supabase
        .from("repair_shops")
        .select(shopColumns)
        .eq("id", shopId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return mapShop(data as ShopRow);
    },
  });
}

/* ------------------------------ notifications ------------------------------ */

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationItem[]> => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, message, category_slug, is_read, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((n) => ({
        id: n.id,
        title: n.title ?? "Update",
        message: n.message ?? "",
        categorySlug: n.category_slug ?? null,
        isRead: n.is_read ?? false,
        createdAt: n.created_at ?? null,
      }));
    },
    staleTime: 30_000,
  });
}

/* ----------------------------- repair requests ----------------------------- */

export type NewRepairRequest = {
  shopId?: string | null;
  categorySlug: string;
  itemDescription: string;
  issueType?: string | null;
};

export function useCreateRepairRequest() {
  return useMutation({
    mutationFn: async (input: NewRepairRequest) => {
      const { data, error } = await supabase
        .from("repair_requests")
        .insert({
          shop_id: input.shopId ?? null,
          category_slug: input.categorySlug,
          item_description: input.itemDescription,
          issue_type: input.issueType ?? null,
          status: "pending",
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    },
  });
}
