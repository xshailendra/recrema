"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { api, type Partner } from "@/lib/api";

type PartnerSearchProps = {
  value: string;
  onChange: (partnerId: string) => void;
};

const partnerLabel = (partner: Partner) => `${partner.name} · ${partner.clientCode}`;

export default function PartnerSearch({ value, onChange }: PartnerSearchProps) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Partner[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const requestRef = useRef(0);

  // Clear the text when the parent resets the filter (e.g. the Clear button).
  const [previousValue, setPreviousValue] = useState(value);
  if (value !== previousValue) {
    setPreviousValue(value);
    if (!value && !open) setQuery("");
  }

  // Debounced server-side search across name, email and client code.
  useEffect(() => {
    if (!open) return;
    const requestId = ++requestRef.current;
    const timer = setTimeout(() => {
      setLoading(true);
      api.partners(1, 8, query.trim())
        .then((page) => {
          if (requestId !== requestRef.current) return;
          setResults(page.data);
          setHighlighted(0);
        })
        .catch(() => {
          if (requestId === requestRef.current) setResults([]);
        })
        .finally(() => {
          if (requestId === requestRef.current) setLoading(false);
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [query, open]);

  function select(partner: Partner) {
    setQuery(partnerLabel(partner));
    setOpen(false);
    onChange(partner._id);
  }

  function clear() {
    setQuery("");
    setOpen(false);
    if (value) onChange("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlighted((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && results[highlighted]) {
      event.preventDefault();
      select(results[highlighted]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative mt-1">
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green/40" />
      <input
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder="Search name, code or email"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setLoading(true);
          if (value) onChange("");
        }}
        onFocus={() => { setOpen(true); setLoading(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-xl border border-brand-green/20 bg-white py-2 pl-9 pr-9 text-sm font-normal normal-case tracking-normal text-brand-green placeholder:text-brand-green/40 [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button type="button" aria-label="Clear partner search" onClick={clear} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-brand-green/50 hover:text-brand-green">
          <X className="h-4 w-4" />
        </button>
      )}
      {open && (
        <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-brand-green/15 bg-white py-1 text-sm font-normal normal-case tracking-normal shadow-lg">
          {loading && results.length === 0 ? (
            <li className="px-3 py-2 text-brand-green/50">Searching…</li>
          ) : results.length === 0 ? (
            <li className="px-3 py-2 text-brand-green/50">No partners found</li>
          ) : (
            results.map((partner, index) => (
              <li
                key={partner._id}
                role="option"
                aria-selected={partner._id === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(partner)}
                onMouseEnter={() => setHighlighted(index)}
                className={`cursor-pointer px-3 py-2 ${index === highlighted ? "bg-brand-green/5" : ""}`}
              >
                <span className="font-semibold text-brand-green">{partner.name}</span>
                <span className="text-brand-green/60"> · {partner.clientCode}</span>
                <span className="block text-xs text-brand-green/50">{partner.email}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
