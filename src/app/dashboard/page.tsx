"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/config";

type User = {
  id: string;
  email: string;
  name: string | null;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load profile.");
        }

        const data = await response.json();
        setUser(data.user);

        const dashboardResponse = await fetch(`${API_URL}/api/dashboard`, {
          credentials: "include",
        });
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setMessage(dashboardData.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile.");
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold">Your trading command center</h1>
          <p className="text-sm text-slate-400">
            This route is protected by JWT authentication.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          {error ? (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          ) : null}

          {user ? (
            <div className="space-y-3">
              <p className="text-lg font-semibold">
                Welcome, {user.name || user.email}.
              </p>
              <p className="text-sm text-slate-400">{user.email}</p>
              {message ? (
                <p className="text-sm text-cyan-200">{message}</p>
              ) : null}
            </div>
          ) : !error ? (
            <p className="text-sm text-slate-400">Loading your dashboard...</p>
          ) : null}
        </section>

        <Link className="text-sm text-cyan-300 hover:text-cyan-200" href="/">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
