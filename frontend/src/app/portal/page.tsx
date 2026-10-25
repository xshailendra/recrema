"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, api, type Paginated, type WasteEntry } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import PartnerManagement from "@/components/portal/PartnerManagement";

function displayError(error: unknown) {
  return error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
}

export default function PortalPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser, logout } = useAuth();
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [quantityKg, setQuantityKg] = useState("");
  const [wasteDate, setWasteDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [actionId, setActionId] = useState("");
  const [adminSection, setAdminSection] = useState<"pending" | "partners">("pending");

  const loadEntries = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    setError("");
    try {
      const result: Paginated<WasteEntry> = user.role === "admin"
        ? await api.pendingWasteEntries()
        : await api.myWasteEntries();
      const nextEntries = Array.isArray(result.data) ? result.data : [];
      setEntries(nextEntries);
      setTotal(Number.isFinite(result.pagination?.total) ? result.pagination.total : nextEntries.length);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        await refreshUser();
        router.replace("/login");
      } else {
        setError(displayError(cause));
      }
    } finally {
      setLoadingData(false);
    }
  }, [user, refreshUser, router]);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) void loadEntries();
  }, [user, loadEntries]);

  async function submitWaste(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.createWasteEntry({
        quantityKg: Number(quantityKg),
        wasteDate: new Date(`${wasteDate}T00:00:00`).toISOString(),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      setQuantityKg("");
      setNotes("");
      await loadEntries();
    } catch (cause) {
      setError(displayError(cause));
    } finally {
      setSaving(false);
    }
  }

  async function approveEntry(id: string) {
    setActionId(id);
    setError("");
    try {
      await api.approveWasteEntry(id);
      await loadEntries();
    } catch (cause) {
      setError(displayError(cause));
    } finally {
      setActionId("");
    }
  }

  async function signOut() {
    setError("");
    try {
      await logout();
      router.replace("/login");
    } catch (cause) {
      setError(displayError(cause));
    }
  }

  if (authLoading || !user) {
    return <main className="flex min-h-screen items-center justify-center bg-background text-brand-green">Checking your session…</main>;
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white px-6 py-5 shadow-sm">
          <div>
            <Link href="/" className="font-display text-2xl tracking-wide text-brand-green">RECREMA</Link>
            <p className="mt-1 text-sm text-brand-green/65">{user.role === "admin" ? "Admin workspace" : "Partner workspace"}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden text-right sm:block"><span className="block font-semibold text-brand-green">{user.name}</span><span className="text-xs text-brand-green/60">{user.email}</span></p>
            <button onClick={() => void signOut()} className="rounded-full border border-brand-green/20 px-5 py-2 text-sm font-semibold text-brand-green hover:bg-brand-green/5">Sign out</button>
          </div>
        </header>

        <section className="mb-8 rounded-3xl bg-brand-green p-7 text-white md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-yellow">{user.role === "admin" ? "Operations" : "Your circular impact"}</p>
          <h1 className="mt-2 font-display text-4xl uppercase md:text-5xl">{user.role === "admin" && adminSection === "partners" ? "Partner management" : user.role === "admin" ? "Pending submissions" : "Coffee waste submissions"}</h1>
          <p className="mt-3 text-white/75">{user.role === "admin" ? adminSection === "partners" ? "Create and manage partner accounts and portal access." : "Review partner submissions awaiting approval." : "Submit collected coffee waste and follow its review status."}</p>
        </section>

        {user.role === "admin" && <nav aria-label="Admin sections" className="mb-6 flex flex-wrap gap-2">
          <button aria-current={adminSection === "pending" ? "page" : undefined} onClick={() => setAdminSection("pending")} className={`rounded-full px-5 py-2.5 text-sm font-semibold ${adminSection === "pending" ? "bg-brand-green text-white" : "border border-brand-green/20 bg-white text-brand-green"}`}>Pending submissions</button>
          <button aria-current={adminSection === "partners" ? "page" : undefined} onClick={() => setAdminSection("partners")} className={`rounded-full px-5 py-2.5 text-sm font-semibold ${adminSection === "partners" ? "bg-brand-green text-white" : "border border-brand-green/20 bg-white text-brand-green"}`}>Partner Management</button>
        </nav>}

        {user.role === "client" && (
          <form onSubmit={submitWaste} className="mb-8 grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-[1fr_1fr_2fr_auto] md:items-end">
            <label className="text-sm font-semibold text-brand-green">Quantity (kg)
              <input type="number" min="0.0001" step="any" required value={quantityKg} onChange={(event) => setQuantityKg(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-green/20 px-4 py-3 font-normal" />
            </label>
            <label className="text-sm font-semibold text-brand-green">Collection date
              <input type="date" required value={wasteDate} onChange={(event) => setWasteDate(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-green/20 px-4 py-3 font-normal" />
            </label>
            <label className="text-sm font-semibold text-brand-green">Notes <span className="font-normal text-brand-green/50">(optional)</span>
              <input maxLength={2000} value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-green/20 px-4 py-3 font-normal" />
            </label>
            <button disabled={saving} className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white hover:bg-brand-green/90 disabled:opacity-60">{saving ? "Submitting…" : "Submit"}</button>
          </form>
        )}

        {error && (user.role === "client" || adminSection === "pending") && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{error}</p>}

        {user.role === "admin" && adminSection === "partners" ? <PartnerManagement /> : <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-brand-green/10 px-6 py-5">
            <div><h2 className="font-display text-2xl uppercase text-brand-green">{user.role === "admin" ? "Awaiting review" : "Your submissions"}</h2><p className="mt-1 text-sm text-brand-green/60">{total} {total === 1 ? "entry" : "entries"}</p></div>
            <button onClick={() => void loadEntries()} disabled={loadingData} className="rounded-full border border-brand-green/20 px-4 py-2 text-sm font-semibold text-brand-green disabled:opacity-50">Refresh</button>
          </div>
          {loadingData ? <p className="px-6 py-12 text-center text-brand-green/60">Loading entries…</p> : entries.length === 0 ? <p className="px-6 py-12 text-center text-brand-green/60">No submissions yet.</p> : (
            <div className="divide-y divide-brand-green/10">
              {entries.map((entry) => {
                const client = typeof entry.clientId === "string" ? null : entry.clientId;
                return <article key={entry._id} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-brand-green">{entry.quantityKg.toLocaleString()} kg <span className="font-normal text-brand-green/60">· {new Date(entry.wasteDate).toLocaleDateString()}</span></p>
                    {client && <p className="mt-1 text-sm text-brand-green/60">{client.name} · {client.clientCode || client.email}</p>}
                    {entry.notes && <p className="mt-1 text-sm text-brand-green/70">{entry.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${entry.status === "approved" ? "bg-emerald-100 text-emerald-800" : entry.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-900"}`}>{entry.status}</span>
                    {user.role === "admin" && entry.status === "pending" && <button disabled={actionId === entry._id} onClick={() => void approveEntry(entry._id)} className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{actionId === entry._id ? "Saving…" : "Approve"}</button>}
                  </div>
                </article>;
              })}
            </div>
          )}
        </section>}
      </div>
    </main>
  );
}
