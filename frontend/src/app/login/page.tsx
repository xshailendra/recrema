"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/portal");
  }, [loading, user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(identifier.trim(), password);
      router.replace("/portal");
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center">
        <Link href="/" className="mb-10 w-fit font-display text-3xl tracking-wide text-brand-green">RECREMA</Link>
        <div className="grid overflow-hidden rounded-[2rem] border border-brand-green/10 bg-white shadow-xl md:grid-cols-2">
          <section className="bg-brand-green p-8 text-white md:p-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">Partner portal</p>
            <h1 className="font-display text-4xl uppercase leading-tight md:text-5xl">Good to have you back.</h1>
            <p className="mt-5 max-w-sm leading-7 text-white/75">Sign in to manage coffee waste submissions and track your contribution.</p>
          </section>
          <section className="p-8 md:p-12">
            <h2 className="font-display text-3xl uppercase text-brand-green">Sign in</h2>
            <p className="mt-2 text-sm text-brand-green/65">Use your account email or client code.</p>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-brand-green" htmlFor="identifier">
                Email or client code
                <input id="identifier" name="identifier" autoComplete="username" required value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-green/20 px-4 py-3 font-normal outline-none focus:border-brand-green" />
              </label>
              <label className="block text-sm font-semibold text-brand-green" htmlFor="password">
                Password
                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-green/20 px-4 py-3 font-normal outline-none focus:border-brand-green" />
              </label>
              {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
              <button disabled={submitting || loading} className="w-full rounded-full bg-brand-green px-6 py-3 font-semibold text-white hover:bg-brand-green/90 disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <Link href="/" className="mt-6 inline-block text-sm font-medium text-brand-green/70 hover:text-brand-green">Back to Recrema</Link>
          </section>
        </div>
      </div>
    </main>
  );
}
