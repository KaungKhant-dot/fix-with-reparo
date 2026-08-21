import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Megaphone, Newspaper, Sparkles, Store } from "lucide-react";
import { useShopsQuery } from "@/lib/repair-data";
import { adPackages, isAdLive, mergeAdminShops, useAdminState } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
}) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-xl bg-secondary">
          <Icon className="size-4 text-secondary-foreground" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function AdminDashboard() {
  const state = useAdminState();
  const { data: baseShops = [] } = useShopsQuery("all");
  const shops = mergeAdminShops(baseShops, state);

  const totalShops = shops.length;
  const activeShops = shops.filter((s) => s.status === "active").length;
  const featuredShops = shops.filter((s) => s.featured).length;
  const activeAds = state.ads.filter((a) => isAdLive(a)).length;
  const publishedNotices = state.notices.filter((n) => n.status === "published").length;

  const recentAds = state.ads.slice(0, 4);
  const recentNotices = [...state.notices].slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Dashboard</h2>
        <p className="text-xs text-muted-foreground">
          Live overview of shops, advertisements and announcements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Shops" value={totalShops} icon={Store} hint="Across all categories" />
        <StatCard label="Active Shops" value={activeShops} icon={CheckCircle2} hint="Visible to customers" />
        <StatCard label="Active Advertisements" value={activeAds} icon={Megaphone} hint="Currently running" />
        <StatCard label="Published Notices" value={publishedNotices} icon={Newspaper} hint="Live on notice board" />
        <StatCard label="Featured Shops" value={featuredShops} icon={Sparkles} hint="Promoted placement" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-soft p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Recent advertisements</h3>
            <Link to="/admin/advertisements" className="text-xs font-medium text-primary">
              Manage
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recentAds.map((ad) => (
              <li key={ad.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{ad.title}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {adPackages[ad.pkg].label} · {ad.startDate} → {ad.endDate}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    isAdLive(ad) ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {isAdLive(ad) ? "Active" : "Inactive"}
                </span>
              </li>
            ))}
            {recentAds.length === 0 && (
              <li className="text-xs text-muted-foreground">No advertisements yet.</li>
            )}
          </ul>
        </section>

        <section className="card-soft p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Recent notices</h3>
            <Link to="/admin/notices" className="text-xs font-medium text-primary">
              Manage
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recentNotices.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{n.title}</span>
                  <span className="block text-[11px] text-muted-foreground">{n.date}</span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    n.status === "published"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {n.status === "published" ? "Published" : "Draft"}
                </span>
              </li>
            ))}
            {recentNotices.length === 0 && <li className="text-xs text-muted-foreground">No notices yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
