import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Heart, MapPin, Settings, Wrench } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { clearLocalUser, useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile | Reparo" },
      {
        name: "description",
        content: "Manage your Reparo profile, saved shops and repair history.",
      },
      { property: "og:title", content: "Your Profile | Reparo" },
      {
        property: "og:description",
        content: "Manage your profile, saved shops and repair history on Reparo.",
      },
    ],
  }),
  component: ProfileScreen,
});

const rows = [
  { Icon: Wrench, label: "Repair history" },
  { Icon: Heart, label: "Saved shops" },
  { Icon: MapPin, label: "Saved addresses" },
  { Icon: Settings, label: "Settings" },
];

function ProfileScreen() {
  const { user, fullName, initials } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="app-shell relative pb-28">
      <header className="hero-panel rounded-b-3xl px-6 pb-8 pt-8 text-primary-foreground">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary-foreground/10 text-xl font-bold">
            {initials}
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{fullName || "Guest"}</h1>
            <p className="text-xs opacity-80">{user?.email ?? "Not signed in"}</p>
          </div>
        </div>
      </header>

      <main className="space-y-3 px-6 pt-6">
        {rows.map(({ Icon, label }) => (
          <button key={label} className="card-soft flex w-full items-center gap-3 p-4 text-left">
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary">
              <Icon className="size-4 text-secondary-foreground" />
            </span>
            <span className="flex-1 text-sm font-medium">{label}</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}

        {user ? (
          <button onClick={signOut} className="btn-pill btn-outline mt-6">
            Log Out
          </button>
        ) : (
          <button
            onClick={() => navigate({ to: "/auth", search: { mode: "login" } })}
            className="btn-pill btn-primary mt-6"
          >
            Log In
          </button>
        )}
      </main>

      <BottomNav active="profile" />
    </div>
  );
}
