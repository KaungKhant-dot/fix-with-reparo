import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useShopsQuery } from "@/lib/repair-data";
import {
  deleteShop,
  emptyShop,
  mergeAdminShops,
  saveShop,
  setShopStatus,
  shopTypeLabel,
  useAdminState,
  type AdminShop,
} from "@/lib/admin-store";
import { categoryLabels, categorySlugs, type CategorySlug } from "@/lib/shops";

export const Route = createFileRoute("/admin/shops")({
  component: AdminShopsPage,
});

const phonePattern = /^[0-9+\-\s()]{6,20}$/;

function AdminShopsPage() {
  const state = useAdminState();
  const { data: baseShops = [], isLoading } = useShopsQuery("all");
  const shops = useMemo(() => mergeAdminShops(baseShops, state), [baseShops, state]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [editing, setEditing] = useState<AdminShop | null>(null);
  const [viewing, setViewing] = useState<AdminShop | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminShop | null>(null);

  const rows = shops.filter((s) => {
    const matchesQuery = query
      ? `${s.name} ${s.address} ${s.phone}`.toLowerCase().includes(query.toLowerCase())
      : true;
    const matchesCategory = category === "all" || s.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Shops</h2>
          <p className="text-xs text-muted-foreground">Manage the repair shops customers can find.</p>
        </div>
        <Button className="rounded-full" onClick={() => setEditing(emptyShop())}>
          <Plus className="size-4" /> Add shop
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shops"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", ...categorySlugs].map((slug) => (
            <button
              key={slug}
              onClick={() => setCategory(slug)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                category === slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {slug === "all" ? "All" : categoryLabels[slug as CategorySlug]}
            </button>
          ))}
        </div>
      </div>

      <div className="card-soft overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Shop</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((shop) => (
              <tr key={shop.id} className="border-b border-border/60 last:border-0">
                <td className="max-w-64 px-4 py-3">
                  <p className="truncate font-semibold">{shop.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{shop.address}</p>
                </td>
                <td className="px-4 py-3 text-xs">{shopTypeLabel(shop.category)}</td>
                <td className="px-4 py-3 text-xs">
                  {shop.rating.toFixed(1)} ({shop.reviewCount})
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      setShopStatus(shop, shop.status === "active" ? "inactive" : "active");
                      toast.success("Shop status updated.");
                    }}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      shop.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {shop.status === "active" ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      shop.featured ? "bg-accent/20 text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {shop.featured ? "Featured" : "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" aria-label="View" onClick={() => setViewing(shop)}>
                      <Eye className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(shop)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={() => setPendingDelete(shop)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            {isLoading ? "Loading shops…" : "No shops match this search."}
          </p>
        )}
      </div>

      <ShopFormDialog
        key={editing?.id || (editing ? "new" : "closed")}
        shop={editing}
        onClose={() => setEditing(null)}
      />

      <Dialog open={Boolean(viewing)} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
            <DialogDescription>{viewing ? shopTypeLabel(viewing.category) : ""}</DialogDescription>
          </DialogHeader>
          {viewing && (
            <dl className="space-y-2 text-sm">
              <Row label="Description" value={viewing.description || "—"} />
              <Row label="Address" value={viewing.address} />
              <Row label="Phone" value={viewing.phone} />
              <Row label="Hours" value={`${viewing.openingTime} - ${viewing.closingTime}`} />
              <Row label="Rating" value={`${viewing.rating.toFixed(1)} (${viewing.reviewCount} reviews)`} />
              <Row label="Distance" value={viewing.distance} />
              <Row label="Payment" value={viewing.paymentMethods || "—"} />
              <Row label="Services" value={viewing.services.join(", ") || "—"} />
              <Row label="Status" value={viewing.status} />
              <Row label="Featured" value={viewing.featured ? "Yes" : "No"} />
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this shop?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) deleteShop(pendingDelete.id);
                setPendingDelete(null);
                toast.success("Shop deleted successfully.");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 text-sm">{value}</dd>
    </div>
  );
}

type ShopErrors = { name?: string; address?: string; phone?: string };

function ShopFormDialog({ shop, onClose }: { shop: AdminShop | null; onClose: () => void }) {
  const [draft, setDraft] = useState<AdminShop | null>(shop);
  const [errors, setErrors] = useState<ShopErrors>({});

  const current = draft;
  const set = (patch: Partial<AdminShop>) => current && setDraft({ ...current, ...patch });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    const next: ShopErrors = {};
    if (!current.name.trim()) next.name = "Shop name is required.";
    if (!current.address.trim()) next.address = "Address is required.";
    if (!phonePattern.test(current.phone.trim())) next.phone = "Enter a valid phone number.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const isNew = !current.id;
    saveShop({ ...current, name: current.name.trim() });
    toast.success(isNew ? "Shop added successfully." : "Shop updated successfully.");
    onClose();
  };

  return (
    <Dialog
      open={Boolean(shop)}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{current?.id ? "Edit shop" : "Add shop"}</DialogTitle>
          <DialogDescription>All fields below are visible to customers.</DialogDescription>
        </DialogHeader>

        {current && (
          <form onSubmit={submit} className="space-y-3">
            <Field label="Shop name" error={errors.name}>
              <Input value={current.name} onChange={(e) => set({ name: e.target.value })} />
            </Field>

            <Field label="Category">
              <select
                value={current.category}
                onChange={(e) => set({ category: e.target.value as CategorySlug })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {categorySlugs.map((slug) => (
                  <option key={slug} value={slug}>
                    {categoryLabels[slug]} · {shopTypeLabel(slug)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Description">
              <Textarea
                rows={2}
                value={current.description}
                onChange={(e) => set({ description: e.target.value })}
              />
            </Field>

            <Field label="Address" error={errors.address}>
              <Input value={current.address} onChange={(e) => set({ address: e.target.value })} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" error={errors.phone}>
                <Input value={current.phone} onChange={(e) => set({ phone: e.target.value })} />
              </Field>
              <Field label="Distance">
                <Input value={current.distance} onChange={(e) => set({ distance: e.target.value })} />
              </Field>
              <Field label="Opening time">
                <Input value={current.openingTime} onChange={(e) => set({ openingTime: e.target.value })} />
              </Field>
              <Field label="Closing time">
                <Input value={current.closingTime} onChange={(e) => set({ closingTime: e.target.value })} />
              </Field>
              <Field label="Rating">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={current.rating}
                  onChange={(e) => set({ rating: Number(e.target.value) })}
                />
              </Field>
              <Field label="Review count">
                <Input
                  type="number"
                  min="0"
                  value={current.reviewCount}
                  onChange={(e) => set({ reviewCount: Number(e.target.value) })}
                />
              </Field>
            </div>

            <Field label="Payment methods">
              <Input
                value={current.paymentMethods}
                onChange={(e) => set({ paymentMethods: e.target.value })}
                placeholder="KBZPay, WavePay, Cash"
              />
            </Field>

            <Field label="Services (comma separated)">
              <Input
                value={current.services.join(", ")}
                onChange={(e) =>
                  set({
                    services: e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>

            <Field label="Shop image URL (optional)">
              <Input value={current.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} />
            </Field>

            <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2.5">
              <Label htmlFor="shop-active" className="text-sm">
                Active (visible to customers)
              </Label>
              <Switch
                id="shop-active"
                checked={current.status === "active"}
                onCheckedChange={(v) => set({ status: v ? "active" : "inactive" })}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2.5">
              <Label htmlFor="shop-featured" className="text-sm">
                Featured shop
              </Label>
              <Switch
                id="shop-featured"
                checked={current.featured}
                onCheckedChange={(v) => set({ featured: v })}
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="rounded-full">
                Save shop
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
      {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}
