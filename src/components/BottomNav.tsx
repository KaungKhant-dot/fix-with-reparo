import { Link } from "@tanstack/react-router";
import { Bell, Home as HomeIcon, Search, Sparkles, User } from "lucide-react";

export function BottomNav({ active }: { active: "home" | "alerts" | "ai" | "search" | "profile" }) {
  const cls = (key: string) =>
    `flex flex-col items-center gap-1 ${active === key ? "text-primary" : "text-muted-foreground"}`;

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[30rem] -translate-x-1/2 border-t border-border bg-card px-6 pb-3 pt-2">
      <div className="grid grid-cols-5 items-end text-[10px]">
        <Link to="/home" className={cls("home")}>
          <HomeIcon className="size-5" />
          Home
        </Link>
        <Link to="/notifications" className={cls("alerts")}>
          <Bell className="size-5" />
          Alerts
        </Link>
        <div className="flex flex-col items-center">
          <Link
            to="/ai"
            aria-label="Reparo AI"
            className="-mt-8 flex size-14 items-center justify-center rounded-full bg-primary shadow-[var(--shadow-card)]"
          >
            <Sparkles className="size-6 text-accent" />
          </Link>
          <span className={`mt-1 ${active === "ai" ? "text-primary" : "text-muted-foreground"}`}>
            AI
          </span>
        </div>
        <Link to="/search" search={{ q: "" }} className={cls("search")}>
          <Search className="size-5" />
          Search
        </Link>
        <Link to="/profile" className={cls("profile")}>
          <User className="size-5" />
          Profile
        </Link>
      </div>
    </nav>
  );
}
