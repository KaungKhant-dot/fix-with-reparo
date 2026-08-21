import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Bell, Megaphone, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { usePublishedNotices, type Notice } from "@/lib/admin-store";

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

function NoticeCard({ notice }: { notice: Notice }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article
      className={`card-soft p-4 ${notice.important ? "border-l-4 border-l-accent" : ""}`}
    >
      <div className="flex gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
          <Megaphone className="size-4 text-secondary-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold">{notice.title}</h2>
            {notice.important && (
              <span className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                <AlertTriangle className="size-3" /> Important
              </span>
            )}
          </div>
          <p className={`mt-1 text-xs text-muted-foreground ${expanded ? "" : "line-clamp-2"}`}>
            {notice.content}
          </p>
          {notice.imageUrl && expanded && (
            <img src={notice.imageUrl} alt="" className="mt-3 w-full rounded-xl object-cover" />
          )}
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">{notice.date}</p>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-[11px] font-semibold text-primary"
            >
              {expanded ? "Show less" : "Read More"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function NotificationsScreen() {
  const notices = usePublishedNotices();

  return (
    <div className="app-shell relative pb-28">
      <header className="hero-panel rounded-b-3xl px-6 pb-7 pt-8 text-primary-foreground">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Bell className="size-5" />
          Notifications
        </h1>
        <p className="mt-1 text-xs opacity-80">Notices and your recent repair activity</p>
      </header>

      <main className="space-y-3 px-6 pt-6">
        {notices.length > 0 && (
          <>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Notice Board
            </h2>
            {notices.map((n) => (
              <NoticeCard key={n.id} notice={n} />
            ))}
            <h2 className="pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Activity
            </h2>
          </>
        )}

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
