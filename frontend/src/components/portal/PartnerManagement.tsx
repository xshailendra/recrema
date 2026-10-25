"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ApiError, api, type Partner } from "@/lib/api";

type PartnerForm = { name: string; email: string; clientCode: string; password: string };
const emptyForm: PartnerForm = { name: "", email: "", clientCode: "", password: "" };
const inputClass = "mt-1.5 w-full rounded-xl border border-brand-green/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-green";
const buttonClass = "rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

function errorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
}

export default function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Partner | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<PartnerForm>(emptyForm);
  const [confirming, setConfirming] = useState<Partner | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.partners(page, 50, search.trim());
      setPartners(result.data);
      setTotal(result.pagination.total);
      setTotalPages(Math.max(result.pagination.totalPages, 1));
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { void load(); }, [load]);

  function openCreate() { setEditing(null); setForm({ ...emptyForm }); setFormOpen(true); setError(""); setNotice(""); }
  function openEdit(partner: Partner) {
    setEditing(partner);
    setFormOpen(true);
    setForm({ name: partner.name, email: partner.email, clientCode: partner.clientCode || "", password: "" });
    setError(""); setNotice("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      if (editing) {
        const { password, ...details } = form;
        await api.updatePartner(editing._id, { ...details, ...(password ? { password } : {}) });
        setNotice("Partner details updated.");
      } else {
        await api.createPartner(form);
        setNotice("Partner created successfully.");
      }
      setEditing(null); setFormOpen(false); setForm({ ...emptyForm });
      await load();
    } catch (cause) { setError(errorMessage(cause)); }
    finally { setSaving(false); }
  }

  async function toggleStatus(partner: Partner) {
    setSaving(true); setError(""); setNotice("");
    try {
      await api.updatePartnerStatus(partner._id, !partner.isActive);
      setNotice(`${partner.name} ${partner.isActive ? "deactivated" : "activated"}.`);
      await load();
    } catch (cause) { setError(errorMessage(cause)); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!confirming) return;
    setSaving(true); setError(""); setNotice("");
    try {
      await api.removePartner(confirming._id);
      setNotice(`${confirming.name} was deactivated. Historical submissions remain available.`);
      setConfirming(null);
      await load();
    } catch (cause) { setError(errorMessage(cause)); }
    finally { setSaving(false); }
  }

  return <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
    <div className="flex flex-col gap-4 border-b border-brand-green/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div><h2 className="font-display text-2xl uppercase text-brand-green">Partner Management</h2><p className="mt-1 text-sm text-brand-green/60">{total} {total === 1 ? "partner" : "partners"} · manage access and account details</p></div>
      <button onClick={openCreate} className={`${buttonClass} bg-brand-green text-white hover:bg-brand-green/90`}>Add Partner</button>
    </div>
    <div className="flex flex-col gap-3 border-b border-brand-green/10 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
      <label className="sr-only" htmlFor="partner-search">Search partners</label>
      <input id="partner-search" value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search name, email, or client code" className="w-full rounded-full border border-brand-green/20 px-4 py-2.5 text-sm outline-none focus:border-brand-green sm:max-w-md" />
      <button onClick={() => void load()} disabled={loading} className={`${buttonClass} border border-brand-green/20 text-brand-green`}>{loading ? "Loading…" : "Refresh"}</button>
    </div>
    {error && <p role="alert" className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-6">{error}</p>}
    {notice && <p role="status" className="mx-5 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:mx-6">{notice}</p>}
    {loading ? <p className="px-6 py-14 text-center text-sm text-brand-green/60">Loading partners…</p> : partners.length === 0 ? <div className="px-6 py-14 text-center"><p className="font-semibold text-brand-green">{search ? "No matching partners" : "No partners yet"}</p><p className="mt-1 text-sm text-brand-green/60">{search ? "Try a different name, email, or code." : "Add a partner to give them access to the client portal."}</p></div> : <>
      <div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="bg-brand-green/[0.03] text-xs uppercase tracking-wide text-brand-green/55"><tr><th className="px-6 py-3">Partner</th><th className="px-4 py-3">Client code</th><th className="px-4 py-3">Status</th><th className="px-6 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-brand-green/10">{partners.map((partner) => <tr key={partner._id}><td className="px-6 py-4"><p className="font-semibold text-brand-green">{partner.name}</p><p className="mt-0.5 text-brand-green/55">{partner.email}</p></td><td className="px-4 py-4 text-brand-green/75">{partner.clientCode || "—"}</td><td className="px-4 py-4"><Status active={partner.isActive} /></td><td className="px-6 py-4"><Actions partner={partner} saving={saving} edit={openEdit} toggle={toggleStatus} remove={() => setConfirming(partner)} /></td></tr>)}</tbody></table></div>
      <div className="divide-y divide-brand-green/10 md:hidden">{partners.map((partner) => <article key={partner._id} className="space-y-3 px-5 py-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold text-brand-green">{partner.name}</p><p className="break-all text-sm text-brand-green/55">{partner.email}</p></div><Status active={partner.isActive} /></div><p className="text-xs text-brand-green/60">Client code: <span className="font-semibold">{partner.clientCode || "—"}</span></p><Actions partner={partner} saving={saving} edit={openEdit} toggle={toggleStatus} remove={() => setConfirming(partner)} /></article>)}</div>
      <div className="flex items-center justify-between border-t border-brand-green/10 px-5 py-4 text-sm text-brand-green/60 sm:px-6"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} className={`${buttonClass} border border-brand-green/20 text-brand-green`}>Previous</button><button disabled={page >= totalPages || loading} onClick={() => setPage((value) => value + 1)} className={`${buttonClass} border border-brand-green/20 text-brand-green`}>Next</button></div></div>
    </>}

    {formOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-green/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setEditing(null); setFormOpen(false); } }}><div role="dialog" aria-modal="true" aria-labelledby="partner-form-title" className="my-auto w-full max-w-lg rounded-3xl bg-background p-6 shadow-2xl sm:p-8"><h3 id="partner-form-title" className="font-display text-3xl uppercase text-brand-green">{editing ? "Edit Partner" : "Add Partner"}</h3><p className="mt-1 text-sm text-brand-green/60">Partner access is managed through a client account.</p><form onSubmit={save} className="mt-6 space-y-4">
      <label className="block text-sm font-semibold text-brand-green">Name<input required maxLength={200} autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} /></label>
      <label className="block text-sm font-semibold text-brand-green">Email<input required type="email" maxLength={320} autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} /></label>
      <label className="block text-sm font-semibold text-brand-green">Client code<input required maxLength={100} value={form.clientCode} onChange={(event) => setForm({ ...form, clientCode: event.target.value })} className={inputClass} /></label>
      <label className="block text-sm font-semibold text-brand-green">{editing ? "New password (optional)" : "Password"}<input required={!editing} type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={inputClass} />{editing && <span className="mt-1 block text-xs font-normal text-brand-green/55">Leave blank to keep the current password.</span>}</label>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => { setEditing(null); setFormOpen(false); }} className={`${buttonClass} border border-brand-green/20 text-brand-green`}>Cancel</button><button disabled={saving} className={`${buttonClass} bg-brand-green text-white`}>{saving ? "Saving…" : editing ? "Save changes" : "Create partner"}</button></div>
    </form></div></div>}
    {confirming && <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-green/45 p-4"><div role="alertdialog" aria-modal="true" aria-labelledby="remove-partner-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h3 id="remove-partner-title" className="font-display text-2xl uppercase text-brand-green">Remove partner?</h3><p className="mt-3 text-sm leading-6 text-brand-green/70"><strong>{confirming.name}</strong> will lose portal access. Their account will be deactivated, and historical submissions will be preserved.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setConfirming(null)} className={`${buttonClass} border border-brand-green/20 text-brand-green`}>Cancel</button><button onClick={() => void remove()} disabled={saving} className={`${buttonClass} bg-red-700 text-white`}>{saving ? "Removing…" : "Remove partner"}</button></div></div></div>}
  </section>;
}

function Status({ active }: { active: boolean }) { return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>{active ? "Active" : "Inactive"}</span>; }

function Actions({ partner, saving, edit, toggle, remove }: { partner: Partner; saving: boolean; edit: (partner: Partner) => void; toggle: (partner: Partner) => void; remove: () => void }) {
  return <div className="flex flex-wrap gap-2 md:justify-end"><button disabled={saving} onClick={() => edit(partner)} className={`${buttonClass} border border-brand-green/20 text-brand-green`}>Edit</button><button disabled={saving} onClick={() => void toggle(partner)} className={`${buttonClass} bg-brand-green/5 text-brand-green`}>{partner.isActive ? "Deactivate" : "Activate"}</button>{partner.isActive && <button disabled={saving} onClick={remove} className={`${buttonClass} border border-red-200 text-red-700`}>Remove</button>}</div>;
}
