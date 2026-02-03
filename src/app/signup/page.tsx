"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL, BACKEND_URL } from "@/lib/config";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Unable to sign up.";
        try {
          const fallbackText = await response.text();
          if (fallbackText) {
            try {
              const data = JSON.parse(fallbackText);
              if (data?.error) {
                errorMessage = data.error;
              } else {
                errorMessage = fallbackText;
              }
            } catch (parseError) {
              errorMessage = fallbackText;
              console.error("Signup error response parsing failed", parseError);
            }
          }
        } catch (readError) {
          console.error("Signup error response read failed", readError);
        }
        console.error("Signup request failed", {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(errorMessage);
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Signup failed", err);
      setError(
        err instanceof Error
          ? err.message
          : `Unable to sign up. Ensure the API server is running at ${BACKEND_URL}.`

      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-xl">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Get started
          </p>
          <h1 className="text-3xl font-semibold">Create your Vibetrader account</h1>
          <p className="text-sm text-slate-400">
            Sign up with your email and secure your dashboard.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            Name
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none ring-0 focus:border-cyan-400"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="block text-sm">
            Email
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none ring-0 focus:border-cyan-400"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block text-sm">
            Password
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none ring-0 focus:border-cyan-400"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          ) : null}

          <button
            className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="text-cyan-300 hover:text-cyan-200" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
