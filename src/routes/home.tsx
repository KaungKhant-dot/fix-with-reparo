import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Bike,
  ArrowRight,
  Home as HomeIcon,
  MapPin,
  Search,
  Smartphone,
  Sparkles,
  Star,
  Tv,
  User,
  Watch,
  WashingMachine,
} from "lucide-react";
import shopMoto from "@/assets/shop-moto.jpg";
import shopPhone from "@/assets/shop-phone.jpg";
import shopLeather from "@/assets/shop-leather.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your Repair Home | Reparo" },
      {
        name: "description",
        content:
          "Browse repair categories and nearby trusted repair shops for motorcycles, phones, electronics and home appliances.",
      },
      { property: "og:title", content: "Your Repair Home | Reparo" },
      {
        property: "og:description",
        content: "Browse categories and nearby trusted repair shops on Reparo.",
      },
    ],
  }),
  component: HomeScreen,
});

const categories = [
  { label: "Motorcycle", Icon: Bike },
  { label: "Personal Item", Icon: Watch },
  { label: "Electronics", Icon: Tv },
  { label: "Home Appliances", Icon: WashingMachine },
  { label: "Phone", Icon: Smartphone },
];

const shops = [
  {
    name: "IronWheel Moto Garage",
    desc: "Motorcycle Repair · Engine diagnostics & roadside rescue",
    rating: "4.8",
    reviews: "214",
    distance: "0.8 km",
    image: shopMoto,
  },
  {
    name: "Smart Phone Care",
    desc: "Phone Repair · Screen swaps in 30 minutes",
    rating: "4.6",
    reviews: "297",
    distance: "0.9 km",
    image: shopPhone,
  },
  {
    name: "Premium Shoe & Bag Repair",
    desc: "Personal Item Repair · Leather resoling & restitching",
    rating: "4.8",
    reviews: "189",
    distance: "1.1 km",
    image: shopLeather,
  },
];

const tabs = [
  { label: "Home", Icon: HomeIcon, active: true },
  { label: "Alerts", Icon: Bell, active: false },
  { label: "Search", Icon: Search, active: false },
  { label: "Profile", Icon: User, active: false },
];

function HomeScreen() {
  return (
    <div className="app-shell relative pb-28">
      <header className="hero-panel rounded-b-3xl px-6 pb-8 pt-8 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80">Good morning 👋</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Hey, Stella</h1>
            <p className="mt-1 flex items-center gap-1 text-xs opacity-75">
              <MapPin className="size-3.5" />
              Riverside District
            </p>
          </div>
          <button
            aria-label="Notifications"
            className="relative flex size-10 items-center justify-center rounded-full bg-primary-foreground/10"
          >
            <Bell className="size-5" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-full bg-card px-4 py-3.5 shadow-[var(--shadow-card)]">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="What do you need to repair?"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <main className="px-6">
        <button className="ai-panel mt-6 flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left text-primary-foreground shadow-[var(--shadow-card)]">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent">
            <Sparkles className="size-5 text-accent-foreground" />
          </span>
          <span className="flex-1">
            <span className="block font-bold">Ask Reparo AI</span>
            <span className="block text-xs opacity-80">
              Describe the problem — we'll find the right specialist.
            </span>
          </span>
          <ArrowRight className="size-5 opacity-90" />
        </button>

        <section className="mt-8">
          <h2 className="text-base font-bold">Categories</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {categories.map(({ label, Icon }) => (
              <button key={label} className="card-soft flex flex-col items-center gap-2 px-2 py-5">
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary">
                  <Icon className="size-5 text-secondary-foreground" />
                </span>
                <span className="text-center text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Nearby Repair Shops</h2>
            <button className="text-xs font-medium text-muted-foreground">See all</button>
          </div>

          <div className="mt-4 space-y-4">
            {shops.map((shop) => (
              <article key={shop.name} className="card-soft flex gap-3 p-3">
                <img
                  src={shop.image}
                  alt={shop.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="size-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-bold">{shop.name}</h3>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-success-soft px-2 py-1 text-[10px] font-semibold text-success-foreground">
                      <span className="size-1.5 rounded-full bg-success" />
                      Available
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{shop.desc}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 font-semibold">
                      <Star className="size-3.5 fill-accent text-accent" />
                      {shop.rating}
                      <span className="font-normal text-muted-foreground">({shop.reviews})</span>
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {shop.distance}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-1/2 w-full max-w-[30rem] -translate-x-1/2 border-t border-border bg-card px-6 pb-3 pt-2">
        <div className="relative grid grid-cols-5 items-end text-[10px]">
          {tabs.slice(0, 2).map(({ label, Icon, active }) => (
            <TabItem key={label} label={label} Icon={Icon} active={active} />
          ))}
          <div className="flex flex-col items-center">
            <button
              aria-label="Reparo AI"
              className="-mt-8 flex size-14 items-center justify-center rounded-full bg-primary shadow-[var(--shadow-card)]"
            >
              <Sparkles className="size-6 text-accent" />
            </button>
            <span className="mt-1 text-muted-foreground">AI</span>
          </div>
          {tabs.slice(2).map(({ label, Icon, active }) => (
            <TabItem key={label} label={label} Icon={Icon} active={active} />
          ))}
        </div>
        <Link to="/" className="mt-2 block text-center text-[10px] text-muted-foreground">
          Back to welcome
        </Link>
      </nav>
    </div>
  );
}

function TabItem({
  label,
  Icon,
  active,
}: {
  label: string;
  Icon: typeof HomeIcon;
  active: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 ${active ? "text-foreground" : "text-muted-foreground"}`}
    >
      <Icon className="size-5" />
      {label}
    </button>
  );
}
