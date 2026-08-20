import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { frequentSearches } from "@/lib/shops";
import { useShops } from "@/lib/repair-data";
import { ShopListSkeleton } from "@/components/ShopListSkeleton";
import { ShopCard } from "@/components/ShopCard";
import { FilterBar } from "@/components/FilterBar";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
    category: typeof search["category"] === "string" ? (search["category"] as string) : "all",
    sort: typeof search["sort"] === "string" ? (search["sort"] as string) : "none",
  }),
  head: () => ({
    meta: [
      { title: "Search Repair Shops | Reparo" },
      {
        name: "description",
        content: "Search bag, clothes, watch, shoe, key and glasses repair shops near you.",
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
  const { q, category, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  const results = filterAndSortShops({ query: q, category, sort });

  const update = (patch: Record<string, string>) =>
    navigate({ to: ".", search: (prev) => ({ ...prev, ...patch }) });

  return (
    <div className="app-shell relative pb-28">
      <header className="hero-panel rounded-b-3xl px-6 pb-7 pt-8 text-primary-foreground">
        <h1 className="text-xl font-bold tracking-tight">Search</h1>
        <div className="mt-4 flex items-center gap-3 rounded-full bg-card px-4 py-3.5 shadow-[var(--shadow-card)]">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            value={q}
            autoFocus
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search shops or services"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <main className="px-6 pt-6">
        <FilterBar
          category={category}
          sort={sort}
          onCategoryChange={(next) => update({ category: next })}
          onSortChange={(next) => update({ sort: next })}
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {frequentSearches.map((f) => (
            <button
              key={f.label}
              onClick={() => update({ q: f.query })}
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
          {results.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No shops match these filters. Try clearing a filter.
            </p>
          )}
        </div>
      </main>

      <BottomNav active="search" />
    </div>
  );
}
