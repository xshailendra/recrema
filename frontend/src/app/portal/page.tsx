"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, api, type AdminWasteFilters, type Paginated, type WasteEntry } from "@/lib/api";

const defaultAdminFilters: AdminWasteFilters = { status: "", clientId: "", startDate: "", endDate: "" };
const statusTitles: Record<AdminWasteFilters["status"], string> = {
  pending: "Awaiting review",
  approved: "Approved entries",
  rejected: "Rejected entries",
  "": "All entries",
};
import { useAuth } from "@/context/AuthProvider";
import PartnerManagement from "@/components/portal/PartnerManagement";
import PartnerSearch from "@/components/portal/PartnerSearch";

function displayError(error: unknown) {
  return error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
}

export default function PortalPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser, logout } = useAuth();
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [approvedKg, setApprovedKg] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [quantityKg, setQuantityKg] = useState("");
  const [wasteDate, setWasteDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [actionId, setActionId] = useState("");
  const [rejectingId, setRejectingId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminSection, setAdminSection] = useState<"pending" | "partners">("pending");
  const [adminFilters, setAdminFilters] = useState<AdminWasteFilters>(defaultAdminFilters);

  const filtersActive = adminFilters.status !== defaultAdminFilters.status || Boolean(adminFilters.clientId || adminFilters.startDate || adminFilters.endDate);

  function updateAdminFilter<K extends keyof AdminWasteFilters>(key: K, value: AdminWasteFilters[K]) {
    setAdminFilters((current) => ({ ...current, [key]: value }));
  }

  const loadEntries = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    setError("");
    try {
      const [result, summary]: [Paginated<WasteEntry>, { approvedKg: number } | null] = user.role === "admin"
        ? [await api.adminWasteEntries(adminFilters), null]
        // The total is secondary: if it fails, still show the entries.
        : await Promise.all([api.myWasteEntries(), api.myWasteSummary().catch(() => null)]);
      const nextEntries = Array.isArray(result.data) ? result.data : [];
      setApprovedKg(summary && Number.isFinite(summary.approvedKg) ? summary.approvedKg : null);
      setEntries(nextEntries);
      setPage(1);
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
  }, [user, adminFilters, refreshUser, router]);

  async function loadMoreEntries() {
    if (!user) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    setError("");
    try {
      const result = user.role === "admin"
        ? await api.adminWasteEntries(adminFilters, nextPage)
        : await api.myWasteEntries(nextPage);
      setEntries((current) => {
        const seen = new Set(current.map((entry) => entry._id));
        return [...current, ...result.data.filter((entry) => !seen.has(entry._id))];
      });
      setPage(nextPage);
      if (Number.isFinite(result.pagination?.total)) setTotal(result.pagination.total);
    } catch (cause) {
      setError(displayError(cause));
    } finally {
      setLoadingMore(false);
    }
  }

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

  function startRejecting(id: string) {
    setRejectingId(id);
    setRejectionReason("");
    setError("");
  }

  async function rejectEntry(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const reason = rejectionReason.trim();
    if (!reason) return;
    setActionId(id);
    setError("");
    try {
      await api.rejectWasteEntry(id, reason);
      setRejectingId("");
      setRejectionReason("");
      await loadEntries();
    } catch (cause) {
      setError(displayError(cause));
    } finally {
      setActionId("");
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
          <h1 className="mt-2 font-display text-4xl uppercase md:text-5xl">{user.role === "admin" && adminSection === "partners" ? "Partner management" : user.role === "admin" ? "Waste submissions" : "Coffee waste submissions"}</h1>
          <p className="mt-3 text-white/75">{user.role === "admin" ? adminSection === "partners" ? "Create and manage partner accounts and portal access." : "Review, approve and search all partner submissions." : "Submit collected coffee waste and follow its review status."}</p>
        </section>

        {user.role === "admin" && <nav aria-label="Admin sections" className="mb-6 flex flex-wrap gap-2">
          <button aria-current={adminSection === "pending" ? "page" : undefined} onClick={() => setAdminSection("pending")} className={`rounded-full px-5 py-2.5 text-sm font-semibold ${adminSection === "pending" ? "bg-brand-green text-white" : "border border-brand-green/20 bg-white text-brand-green"}`}>Submissions</button>
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
            <div><h2 className="font-display text-2xl uppercase text-brand-green">{user.role === "admin" ? statusTitles[adminFilters.status] : "Your submissions"}</h2><p className="mt-1 text-sm text-brand-green/60">{total} {total === 1 ? "entry" : "entries"}</p></div>
            <button onClick={() => void loadEntries()} disabled={loadingData} className="rounded-full border border-brand-green/20 px-4 py-2 text-sm font-semibold text-brand-green disabled:opacity-50">Refresh</button>
          </div>
          {user.role === "admin" && (
            <div className="grid grid-cols-1 gap-3 border-b border-brand-green/10 px-6 py-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1fr_1fr_auto] lg:items-end">
              <label className="text-xs font-semibold uppercase tracking-wide text-brand-green/60">Status
                <select value={adminFilters.status} onChange={(event) => updateAdminFilter("status", event.target.value as AdminWasteFilters["status"])} className="mt-1 w-full rounded-xl border border-brand-green/20 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-brand-green">
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-brand-green/60">Partner
                <PartnerSearch value={adminFilters.clientId} onChange={(partnerId) => updateAdminFilter("clientId", partnerId)} />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-brand-green/60">From
                <input type="date" value={adminFilters.startDate} max={adminFilters.endDate || undefined} onChange={(event) => updateAdminFilter("startDate", event.target.value)} className="mt-1 w-full rounded-xl border border-brand-green/20 px-3 py-2 text-sm font-normal text-brand-green" />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-brand-green/60">To
                <input type="date" value={adminFilters.endDate} min={adminFilters.startDate || undefined} onChange={(event) => updateAdminFilter("endDate", event.target.value)} className="mt-1 w-full rounded-xl border border-brand-green/20 px-3 py-2 text-sm font-normal text-brand-green" />
              </label>
              <button type="button" onClick={() => setAdminFilters(defaultAdminFilters)} disabled={!filtersActive} className="rounded-full px-4 py-2 text-sm font-semibold text-brand-green underline-offset-4 hover:underline disabled:opacity-40 disabled:hover:no-underline">Clear</button>
            </div>
          )}
          {user.role === "client" && approvedKg !== null && (
            <div className="border-b border-brand-green/10 px-6 py-5">
              <div className="rounded-2xl bg-emerald-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/70">Total approved</p>
                <p className="mt-1 text-2xl font-semibold text-brand-green">{approvedKg.toLocaleString()} kg</p>
                <p className="mt-1 text-xs text-brand-green/60">Pending and rejected entries are not included.</p>
              </div>
            </div>
          )}
          {loadingData ? <p className="px-6 py-12 text-center text-brand-green/60">Loading entries…</p> : entries.length === 0 ? <p className="px-6 py-12 text-center text-brand-green/60">{user.role === "admin" ? (filtersActive ? "No entries match these filters." : "No entries yet.") : "No submissions yet."}</p> : (
            <div className="divide-y divide-brand-green/10">
              {entries.map((entry) => {
                const client = typeof entry.clientId === "string" ? null : entry.clientId;
                const busy = actionId === entry._id;
                const rejecting = rejectingId === entry._id;
                return <article key={entry._id} className="px-6 py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-brand-green">{entry.quantityKg.toLocaleString()} kg <span className="font-normal text-brand-green/60">· {new Date(entry.wasteDate).toLocaleDateString()}</span></p>
                      {client && <p className="mt-1 text-sm text-brand-green/60">{client.name} · {client.clientCode || client.email}</p>}
                      {entry.notes && <p className="mt-1 text-sm text-brand-green/70">{entry.notes}</p>}
                      {entry.status === "rejected" && entry.rejectionReason && <p className="mt-1 text-sm text-red-800">Reason: {entry.rejectionReason}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${entry.status === "approved" ? "bg-emerald-100 text-emerald-800" : entry.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-900"}`}>{entry.status}</span>
                      {user.role === "admin" && entry.status === "pending" && !rejecting && <>
                        <button disabled={busy} onClick={() => startRejecting(entry._id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">Reject</button>
                        <button disabled={busy} onClick={() => void approveEntry(entry._id)} className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Saving…" : "Approve"}</button>
                      </>}
                    </div>
                  </div>
                  {user.role === "admin" && entry.status === "pending" && rejecting && (
                    <form onSubmit={(event) => void rejectEntry(event, entry._id)} className="mt-4 flex flex-col gap-3 rounded-2xl bg-red-50 p-4 sm:flex-row sm:items-end">
                      <label className="flex-1 text-sm font-semibold text-red-900">Reason for rejection
                        <input autoFocus required maxLength={1000} value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="Shown to the partner" className="mt-1 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-normal text-brand-green" />
                      </label>
                      <div className="flex gap-2">
                        <button type="button" disabled={busy} onClick={() => setRejectingId("")} className="rounded-full border border-brand-green/20 bg-white px-4 py-2 text-sm font-semibold text-brand-green disabled:opacity-60">Cancel</button>
                        <button type="submit" disabled={busy || !rejectionReason.trim()} className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Rejecting…" : "Confirm reject"}</button>
                      </div>
                    </form>
                  )}
                </article>;
              })}
              {entries.length < total && (
                <div className="flex flex-col items-center gap-2 px-6 py-5">
                  <p className="text-xs text-brand-green/50">Showing {entries.length} of {total}</p>
                  <button onClick={() => void loadMoreEntries()} disabled={loadingMore} className="rounded-full border border-brand-green/20 px-5 py-2 text-sm font-semibold text-brand-green disabled:opacity-50">{loadingMore ? "Loading…" : "Load more"}</button>
                </div>
              )}
            </div>
          )}
        </section>}
      </div>
    </main>
  );
}
