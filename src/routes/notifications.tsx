import { createFileRoute } from "@tanstack/react-router";
import { Bell, Sparkles } from "lucide-react";
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

const welcomeNotification = {
  id: "welcome",
  title: "Reparo မှ နွေးထွေးစွာ ကြိုဆိုပါတယ်",
  message:
    "သင့်အကောင့် ဖွင့်လှစ်ခြင်း အောင်မြင်ပါသည်။ အနီးဆုံး ပြုပြင်ရေးဆိုင်များကို Reparo တွင် အလွယ်တကူ ရှာဖွေနိုင်ပါပြီ။",
  time: "Just now",
};

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
        <article className="card-soft flex gap-3 p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Sparkles className="size-4 text-secondary-foreground" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold">{welcomeNotification.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{welcomeNotification.message}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">{welcomeNotification.time}</p>
          </div>
        </article>
      </main>

      <BottomNav active="alerts" />
    </div>
  );
}
