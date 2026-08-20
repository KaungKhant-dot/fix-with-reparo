import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, Footprints, KeyRound, Sparkles, Watch } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | Reparo" },
      {
        name: "description",
        content: "Repair updates, shop replies and Reparo AI suggestions in one place.",
      },
      { property: "og:title", content: "Notifications | Reparo" },
      {
        property: "og:description",
        content: "Repair updates, shop replies and AI suggestions in one place.",
      },
    ],
  }),
  component: NotificationsScreen,
});

const categoryIcons: Record<string, typeof Bell> = {
  bag: Sparkles,
  clothes: Sparkles,
  watches: Watch,
  shoes: Footprints,
  keys: KeyRound,
  glasses: Sparkles,
};

function timeAgo(iso: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}

function NotificationsScreen() {
  const { data: items = [], isLoading, isError } = useNotifications();

  return (
    <div className="app-shell relative pb-28">
      <header className="hero-panel rounded-b-3xl px-6 pb-7 pt-8 text-primary-foreground">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Bell className="size-5" />
          Notifications
        </h1>
        <p className="mt-1 text-xs opacity-80">Your recent repair activity</p>
      </header>

      <main className="space-y-3 px-6 pt-6">
        {items.map((item) => (
          <article key={item.title} className="card-soft flex gap-3 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
              <item.Icon className="size-4 text-secondary-foreground" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold">{item.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">{item.time}</p>
            </div>
          </article>
        ))}
      </main>

      <BottomNav active="alerts" />
    </div>
  );
}
