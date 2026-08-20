import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_KEY = "reparo_user";
const LOCAL_EVENT = "reparo-auth-change";

export type LocalUser = { full_name: string; email: string };

export function readLocalUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocalUser>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      full_name: String(parsed.full_name ?? ""),
      email: String(parsed.email ?? ""),
    };
  } catch {
    return null;
  }
}

export function saveLocalUser(user: LocalUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(LOCAL_EVENT));
}

export function clearLocalUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOCAL_KEY);
  window.dispatchEvent(new Event(LOCAL_EVENT));
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocalUser(readLocalUser());
    setLoading(false);

    const sync = () => setLocalUser(readLocalUser());
    window.addEventListener(LOCAL_EVENT, sync);
    window.addEventListener("storage", sync);

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => undefined)
      .finally(() => setLoading(false));

    return () => {
      window.removeEventListener(LOCAL_EVENT, sync);
      window.removeEventListener("storage", sync);
      sub.subscription.unsubscribe();
    };
  }, []);

  const user: User | null = session?.user ?? null;
  const email = user?.email ?? localUser?.email ?? "";
  const fullName =
    (user?.user_metadata?.["full_name"] as string | undefined)?.trim() ||
    localUser?.full_name?.trim() ||
    "";
  const initials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || (email[0]?.toUpperCase() ?? "U");

  const isAuthenticated = Boolean(session || localUser);

  return { session, user, localUser, isAuthenticated, email, loading, fullName, initials };
}
