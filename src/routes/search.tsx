import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { frequentSearches, searchShops } from "@/lib/shops";
import { ShopCard } from "@/components/ShopCard";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Search Repair Shops | Reparo" },
      {
        name: "description",
        content: "Search motorcycle, phone, electronics, appliance and personal item repair shops.",
      },
      { property: "og:title", content: "Search Repair Shops | Reparo" },
      {
        property: "og:description",
        content: "Find the right repair specialist by service, shop name or category.",
      },
    ],
  }),
  component: SearchScreen,
});

function SearchScreen() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const results = searchShops(q);

  return (
    <div className="app-shell relative pb-28">
      <header className="hero-panel rounded-b-3xl px-6 pb-7 pt-8 text-primary-foreground">
        <h1 className="text-xl font-bold tracking-tight">Search</h1>
        <div className="mt-4 flex items-center gap-3 rounded-full bg-card px-4 py-3.5 shadow-[var(--shadow-card)]">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            value={q}
            autoFocus
            onChange={(e) =>
              navigate({ to: ".", search: (prev) => ({ ...prev, q: e.target.value }) })
            }
            placeholder="Search shops or services"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <main className="px-6 pt-6">
        <div className="flex flex-wrap gap-2">
          {frequentSearches.map((f) => (
            <button
              key={f.label}
              onClick={() => navigate({ to: ".", search: (prev) => ({ ...prev, q: f.query }) })}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">{results.length} results</p>
        <div className="mt-3 space-y-4">
          {results.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </main>

      <BottomNav active="search" />
    </div>
  );
}
