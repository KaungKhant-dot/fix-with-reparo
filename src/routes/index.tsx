import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Wrench } from "lucide-react";
import { ReparoToolMark } from "@/components/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reparo — Find Trusted Repair Shops Near You" },
      {
        name: "description",
        content:
          "Reparo matches you with trusted bag, clothes, watch, shoe, key and glasses repair shops in seconds.",
      },
      { property: "og:title", content: "Reparo — Find Trusted Repair Shops Near You" },
      {
        property: "og:description",
        content:
          "Trusted repair shops for your bags, clothes, watches, shoes, keys and glasses — matched to you in seconds.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="app-shell flex flex-col px-6 pb-10 pt-8">
      <header className="flex items-center justify-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary">
          <Wrench className="size-4 text-primary-foreground" />
        </span>
        <span className="text-xl font-bold tracking-tight">
          Repar<span className="text-accent">o</span>
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <div className="flex size-36 items-center justify-center rounded-full bg-secondary">
          <ReparoToolMark className="size-20" />
        </div>
        <h1 className="mt-8 text-3xl font-bold leading-tight tracking-tight">
          Find & Repair.
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Trusted repair shops for your bags, clothes, watches, shoes, keys and glasses — matched
          to you in seconds.
        </p>
      </main>

      <div className="space-y-3">
        <Link to="/auth" search={{ mode: "signup" }} className="btn-pill btn-primary">
          Get Started
        </Link>
        <Link to="/auth" search={{ mode: "login" }} className="btn-pill btn-outline">
          Log In
        </Link>

        <div className="flex items-center gap-3 pt-2">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">Sign up with</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link to="/auth" search={{ mode: "signup" }} className="btn-pill btn-outline">
          <Mail className="size-4" />
          Email
        </Link>
      </div>

    </div>
  );
}
