import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin, useAdminSession } from "@/lib/admin-store";

export const Route = createFileRoute("/admin-login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login | Reparo Admin Panel" },
      {
        name: "description",
        content: "Sign in to the Reparo admin control panel to manage shops, advertisements and notices.",
      },
      { property: "og:title", content: "Admin Login | Reparo Admin Panel" },
      {
        property: "og:description",
        content: "Reparo administrator sign-in for shop, advertisement and notice management.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginScreen,
});

function AdminLoginScreen() {
  const navigate = useNavigate();
  const session = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) navigate({ to: "/admin", replace: true });
  }, [session, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(email, password)) {
      toast.success("Welcome back, admin.");
      navigate({ to: "/admin", replace: true });
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="card-soft p-7">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-6" />
          </span>
          <h1 className="mt-5 text-xl font-bold tracking-tight">Reparo Admin Panel</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Demo administrator sign-in — for hackathon demonstration only.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full rounded-full">
              <Lock className="size-4" />
              Log in as Admin
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Static demo authentication. Not production-grade security.
        </p>
      </div>
    </div>
  );
}
