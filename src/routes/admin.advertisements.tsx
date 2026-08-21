import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
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
  adPackages,
  deleteAd,
  emptyAd,
  isAdLive,
  mergeAdminShops,
  saveAd,
  toggleAd,
  useAdminState,
  type AdPackage,
  type Advertisement,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/advertisements")({
  component: AdminAdsPage,
});

function AdminAdsPage() {
  const state = useAdminState();
  const { data: baseShops = [] } = useShopsQuery("all");
  const shops = useMemo(() => mergeAdminShops(baseShops, state), [baseShops, state]);
  const shopName = (id: string) => shops.find((s) => s.id === id)?.name ?? "Unknown shop";

  const [editing, setEditing] = useState<Advertisement | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Advertisement | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Advertisements</h2>
          <p className="text-xs text-muted-foreground">
            Sponsored placements purchased by repair shops.
          </p>
        </div>
        <Button className="rounded-full" onClick={() => setEditing(emptyAd())}>
          <Plus className="size-4" /> Create advertisement
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(adPackages) as AdPackage[]).map((key) => (
          <div key={key} className="card-soft p-4">
            <p className="text-sm font-bold">{adPackages[key].label}</p>
            <p className="text-[11px] text-muted-foreground">
              {adPackages[key].days} days · {adPackages[key].perks}
            </p>
          </div>
        ))}
      </div>

      <div className="card-soft overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Advertisement</th>
              <th className="px-4 py-3 font-medium">Shop</th>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Start</th>
              <th className="px-4 py-3 font-medium">End</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.ads.map((ad) => (
              <tr key={ad.id} className="border-b border-border/60 last:border-0">
                <td className="max-w-56 px-4 py-3">
                  <p className="truncate font-semibold">{ad.title}</p>
                  {ad.featured && (
                    <span className="text-[11px] font-semibold text-accent-foreground">Featured</span>
                  )}
                </td>
                <td className="max-w-48 truncate px-4 py-3 text-xs">{shopName(ad.shopId)}</td>
                <td className="px-4 py-3 text-xs">{adPackages[ad.pkg].label}</td>
                <td className="px-4 py-3 text-xs">{ad.startDate}</td>
                <td className="px-4 py-3 text-xs">{ad.endDate}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      isAdLive(ad) ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {ad.status === "active" ? (isAdLive(ad) ? "Active" : "Scheduled/Expired") : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Toggle status"
                      onClick={() => {
                        toggleAd(ad.id);
                        toast.success("Advertisement status updated.");
                      }}
                    >
                      <Power className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(ad)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={() => setPendingDelete(ad)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {state.ads.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No advertisements yet. Create the first sponsored placement.
          </p>
        )}
      </div>

      <AdFormDialog
        key={editing?.id || (editing ? "new" : "closed")}
        ad={editing}
        shops={shops.map((s) => ({ id: s.id, name: s.name }))}
        onClose={() => setEditing(null)}
      />

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this advertisement?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) deleteAd(pendingDelete.id);
                setPendingDelete(null);
                toast.success("Advertisement deleted successfully.");
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

type AdErrors = { title?: string; shopId?: string; dates?: string };

function AdFormDialog({
  ad,
  shops,
  onClose,
}: {
  ad: Advertisement | null;
  shops: { id: string; name: string }[];
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Advertisement | null>(ad);
  const [errors, setErrors] = useState<AdErrors>({});
  const current = draft;
  const set = (patch: Partial<Advertisement>) => current && setDraft({ ...current, ...patch });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    const next: AdErrors = {};
    if (!current.title.trim()) next.title = "Title is required.";
    if (!current.shopId) next.shopId = "Select a shop.";
    if (!current.startDate || !current.endDate) next.dates = "Start and end dates are required.";
    else if (current.endDate < current.startDate) next.dates = "End date cannot be before start date.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const isNew = !current.id;
    saveAd({ ...current, title: current.title.trim() });
    toast.success(isNew ? "Advertisement created successfully." : "Advertisement updated successfully.");
    onClose();
  };

  return (
    <Dialog open={Boolean(ad)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{current?.id ? "Edit advertisement" : "Create advertisement"}</DialogTitle>
          <DialogDescription>Active ads appear as sponsored content in the app.</DialogDescription>
        </DialogHeader>

        {current && (
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Advertisement title</Label>
              <Input value={current.title} onChange={(e) => set({ title: e.target.value })} />
              {errors.title && <p className="text-[11px] text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Shop</Label>
              <select
                value={current.shopId}
                onChange={(e) => set({ shopId: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select a shop…</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.shopId && <p className="text-[11px] text-destructive">{errors.shopId}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                rows={2}
                value={current.description}
                onChange={(e) => set({ description: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Banner image URL (optional)</Label>
              <Input value={current.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Package</Label>
              <select
                value={current.pkg}
                onChange={(e) => {
                  const pkg = e.target.value as AdPackage;
                  const start = new Date(`${current.startDate}T00:00:00`);
                  start.setDate(start.getDate() + adPackages[pkg].days);
                  set({ pkg, endDate: start.toISOString().slice(0, 10) });
                }}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {(Object.keys(adPackages) as AdPackage[]).map((key) => (
                  <option key={key} value={key}>
                    {adPackages[key].label} — {adPackages[key].days} days · {adPackages[key].perks}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Start date</Label>
                <Input
                  type="date"
                  value={current.startDate}
                  onChange={(e) => set({ startDate: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">End date</Label>
                <Input
                  type="date"
                  value={current.endDate}
                  onChange={(e) => set({ endDate: e.target.value })}
                />
              </div>
            </div>
            {errors.dates && <p className="text-[11px] text-destructive">{errors.dates}</p>}

            <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2.5">
              <Label htmlFor="ad-active" className="text-sm">
                Active
              </Label>
              <Switch
                id="ad-active"
                checked={current.status === "active"}
                onCheckedChange={(v) => set({ status: v ? "active" : "inactive" })}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2.5">
              <Label htmlFor="ad-featured" className="text-sm">
                Featured placement
              </Label>
              <Switch
                id="ad-featured"
                checked={current.featured}
                onCheckedChange={(v) => set({ featured: v })}
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="rounded-full">
                Save advertisement
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
