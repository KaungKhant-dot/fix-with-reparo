import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, LogOut, Megaphone, Newspaper, Store, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { adminLogout, useAdminSession } from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reparo Admin Panel" },
      {
        name: "description",
        content: "Manage Reparo repair shops, advertisements and notice board announcements.",
      },
      { property: "og:title", content: "Reparo Admin Panel" },
      {
        property: "og:description",
        content: "Administrator dashboard for Reparo shops, advertisements and notices.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/shops", label: "Shops", icon: Store, exact: false },
  { to: "/admin/advertisements", label: "Advertisements", icon: Megaphone, exact: false },
  { to: "/admin/notices", label: "Notice Board", icon: Newspaper, exact: false },
] as const;

function AdminLayout() {
  const session = useAdminSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) navigate({ to: "/admin-login", replace: true });
  }, [session, navigate]);

  if (!session) return null;

  const logout = () => {
    adminLogout();
    toast.success("Logged out.");
    navigate({ to: "/admin-login", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6 md:flex">
        <div className="flex items-center gap-2 px-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold">Reparo</p>
            <p className="text-[11px] text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-secondary" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
          <div>
            <h1 className="text-base font-bold tracking-tight">Reparo Admin Panel</h1>
            <p className="text-[11px] text-muted-foreground">{session}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/home"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              View app
            </Link>
            <button
              onClick={logout}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground md:hidden"
            >
              Logout
            </button>
          </div>
        </header>

        <nav className="flex gap-2 overflow-x-auto border-b border-border bg-card px-5 py-2 md:hidden">
          {navItems.map(({ to, label, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              inactiveProps={{ className: "bg-secondary text-secondary-foreground" }}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold"
            >
              {label}
            </Link>
          ))}
        </nav>

        <main className="px-5 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
