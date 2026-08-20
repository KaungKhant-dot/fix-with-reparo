import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { readLocalUser, saveLocalUser, useAuth } from "@/lib/use-auth";


type Mode = "login" | "signup";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: (search["mode"] === "login" ? "login" : "signup") as Mode,
  }),
  head: () => ({
    meta: [
      { title: "Sign In or Create Account | Reparo" },
      {
        name: "description",
        content:
          "Log in or create your Reparo account to find trusted repair shops in Mandalay.",
      },
      { property: "og:title", content: "Sign In or Create Account | Reparo" },
      {
        property: "og:description",
        content: "Access your Reparo account to find trusted repair shops nearby.",
      },
    ],
  }),
  component: AuthScreen,
});

function AuthScreen() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(false);

  useEffect(() => {
    if (!sessionLoading && session) {
      navigate({ to: "/home", replace: true });
    }
  }, [session, sessionLoading, navigate]);

  const isSignup = mode === "signup";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    if (isSignup) {
      if (!fullName.trim()) {
        toast.error("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    setBusy(true);

    const cleanEmail = email.trim();
    const existing = readLocalUser();
    const nameForSession = isSignup
      ? fullName.trim()
      : (existing?.email === cleanEmail && existing.full_name) ||
        cleanEmail.split("@")[0] ||
        "User";

    // Local-first session: works even when the network/Supabase is unreachable.
    saveLocalUser({ full_name: nameForSession, email: cleanEmail });

    // Best-effort Supabase sync in the background — never blocks the redirect.
    void (async () => {
      try {
        if (isSignup) {
          const { data } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: { full_name: fullName.trim() },
              emailRedirectTo: window.location.origin,
            },
          });
          if (!data.session) {
            await supabase.auth.signInWithPassword({ email: cleanEmail, password });
          }
        } else {
          await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        }
      } catch {
        // offline / blocked network — local session already active
      }
    })();

    toast.success(isSignup ? "Welcome to Reparo!" : "Logged in.");
    setBusy(false);
    navigate({ to: "/home", replace: true });
  };

  const inputCls =
    "w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary";

  return (
    <div className="app-shell flex min-h-screen flex-col px-6 pb-10 pt-12">
      <main className="flex flex-1 flex-col justify-center py-8">

        <h1 className="text-2xl font-bold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSignup
            ? "Sign up to find trusted repair shops near you."
            : "Log in to continue to Reparo."}
        </p>

        {pendingEmail ? (
          <div className="card-soft mt-8 p-5 text-sm">
            <p className="font-semibold">Check your email</p>
            <p className="mt-2 text-muted-foreground">
              We sent a confirmation link to {email}. Confirm it, then log in.
            </p>
            <Link
              to="/auth"
              search={{ mode: "login" }}
              onClick={() => setPendingEmail(false)}
              className="btn-pill btn-outline mt-4"
            >
              Go to log in
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            {isSignup && (
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="fullName"
                  className={inputCls}
                  placeholder="e.g. Aung Aung"
                  value={fullName}
                  autoComplete="name"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                className={inputCls}
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                className={inputCls}
                type="password"
                required
                placeholder={isSignup ? "Min. 6 characters" : "Your password"}
                value={password}
                autoComplete={isSignup ? "new-password" : "current-password"}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isSignup && (
              <div className="space-y-1.5">
                <label htmlFor="confirm" className="text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  className={inputCls}
                  type="password"
                  required
                  placeholder="Re-enter your password"
                  value={confirm}
                  autoComplete="new-password"
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-pill btn-primary mt-2">
              {busy && <Loader2 className="size-4 animate-spin" />}
              {isSignup ? "Create Account" : "Log In"}
            </button>
          </form>

        )}
      </main>

      <div className="space-y-3 text-center">
        <p className="text-xs text-muted-foreground">
          {isSignup ? "Already have an account?" : "New to Reparo?"}
        </p>
        <Link
          to="/auth"
          search={{ mode: isSignup ? "login" : "signup" }}
          className="btn-pill btn-outline"
        >
          {isSignup ? "Log In" : "Create Account"}
        </Link>
      </div>
    </div>
  );
}
