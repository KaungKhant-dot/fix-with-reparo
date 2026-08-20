import { useCategories } from "@/lib/repair-data";
import { cn } from "@/lib/utils";

const sorts = [
  { key: "nearest", label: "Nearest" },
  { key: "available", label: "Available Now" },
  { key: "rating", label: "Highest Rated" },
];

export function FilterBar({
  category,
  sort,
  onCategoryChange,
  onSortChange,
}: {
  category: string;
  sort: string;
  onCategoryChange: (next: string) => void;
  onSortChange: (next: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {["all", ...categorySlugs].map((slug) => {
          const active = category === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => onCategoryChange(slug)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {slug === "all" ? "All" : categoryLabels[slug as keyof typeof categoryLabels]}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {sorts.map((s) => {
          const active = sort === s.key;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={active}
              onClick={() => onSortChange(active ? "none" : s.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
