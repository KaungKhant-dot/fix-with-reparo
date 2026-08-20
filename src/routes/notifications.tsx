import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, Sparkles, Wrench } from "lucide-react";
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

const items = [
  {
    Icon: CheckCircle2,
    title: "Golden Motor Service is available now",
    body: "They accept walk-ins until 7:00 PM today.",
    time: "12 min ago",
  },
  {
    Icon: Sparkles,
    title: "Reparo AI found 3 matches",
    body: "Motorcycle engine issue — shops within 1 km.",
    time: "1 hr ago",
  },
  {
    Icon: Wrench,
    title: "Premium Shoe & Bag Repair replied",
    body: "Leather resoling takes about 2 days.",
    time: "Yesterday",
  },
];

function NotificationsScreen() {
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
