import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { categoryLabels, type CategorySlug } from "@/lib/shops";
import { useShops } from "@/lib/repair-data";
import { ShopListSkeleton } from "@/components/ShopListSkeleton";
import { ShopCard } from "@/components/ShopCard";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/category/$categorySlug")({
  head: () => ({
    meta: [
      { title: "Repair Shops by Category | Reparo" },
      {
        name: "description",
        content: "Browse trusted repair shops filtered by category near you on Reparo.",
      },
      { property: "og:title", content: "Repair Shops by Category | Reparo" },
      {
        property: "og:description",
        content: "Browse trusted repair shops filtered by category near you.",
      },
    ],
  }),
  component: CategoryScreen,
});

function CategoryScreen() {
  const { categorySlug } = Route.useParams();
  const label = categoryLabels[categorySlug as CategorySlug] ?? "Repair";
  const { shops: list, isLoading } = useShops({ category: categorySlug, sort: "nearest" });

  return (
    <div className="app-shell relative pb-28">
      <header className="hero-panel rounded-b-3xl px-6 pb-7 pt-8 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            aria-label="Back"
            className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/10"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{label} Repair</h1>
            <p className="text-xs opacity-80">{list.length} shops near you</p>
          </div>
        </div>
      </header>

      <main className="space-y-4 px-6 pt-6">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No shops in this category yet.</p>
        ) : (
          list.map((shop) => <ShopCard key={shop.id} shop={shop} />)
        )}
      </main>

      <BottomNav active="home" />
    </div>
  );
}
