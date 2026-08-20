import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import logoAsset from "@/assets/reparo-logo.png.asset.json";


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
    <div className="app-shell flex flex-col px-6 pb-10 pt-12">
      <main className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <div className="flex w-full items-center justify-center px-6">
          <img
            src={logoAsset.url}
            alt="Reparo"
            className="max-h-44 w-auto object-contain"
          />
        </div>
        <h1 className="mt-8 text-3xl font-semibold leading-tight tracking-tight">
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
