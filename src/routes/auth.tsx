import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Wrench } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

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
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        if (!data.session) {
          const retry = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (retry.error || !retry.data.session) {
            setPendingEmail(true);
            toast.success("Account created — check your email to confirm.");
            return;
          }
        }
        toast.success("Welcome to Reparo!");
        navigate({ to: "/home", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Logged in.");
        navigate({ to: "/home", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary";

  return (
    <div className="app-shell flex min-h-screen flex-col px-6 pb-10 pt-8">
      <header className="flex items-center justify-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary">
          <Wrench className="size-4 text-primary-foreground" />
        </span>
        <span className="text-xl font-bold tracking-tight">
          Repar<span className="text-accent">o</span>
        </span>
      </header>

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
          <form onSubmit={submit} className="mt-8 space-y-3">
            {isSignup && (
              <input
                className={inputCls}
                placeholder="Full name"
                value={fullName}
                autoComplete="name"
                onChange={(e) => setFullName(e.target.value)}
              />
            )}
            <input
              className={inputCls}
              type="email"
              required
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={inputCls}
              type="password"
              required
              placeholder="Password"
              value={password}
              autoComplete={isSignup ? "new-password" : "current-password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSignup && (
              <input
                className={inputCls}
                type="password"
                required
                placeholder="Confirm password"
                value={confirm}
                autoComplete="new-password"
                onChange={(e) => setConfirm(e.target.value)}
              />
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
