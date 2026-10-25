"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Coffee, Factory, Leaf, Recycle, Users } from "lucide-react";
import { api, type PublicImpactSummary, type PublicImpactTrend } from "@/lib/api";
import { Container } from "@/components/ui/core";

const numberFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
const emissionsFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 });
const methaneFactor = 0.072;
const co2eFactor = 2.016;

const steps = [
  { number: "01", icon: Coffee, title: "Collect", copy: "Spent coffee grounds are gathered through our partner network." },
  { number: "02", icon: Factory, title: "Transform", copy: "Recovered material is prepared for responsible processing." },
  { number: "03", icon: Leaf, title: "Return to use", copy: "Useful ingredients re-enter supply chains as higher-value materials." },
];

export function InsightsExperience() {
  const [summary, setSummary] = useState<PublicImpactSummary | null>(null);
  const [trends, setTrends] = useState<PublicImpactTrend[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [summaryUnavailable, setSummaryUnavailable] = useState(false);
  const [trendsUnavailable, setTrendsUnavailable] = useState(false);

  useEffect(() => {
    let active = true;

    api.publicImpactSummary()
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch(() => {
        if (active) setSummaryUnavailable(true);
      })
      .finally(() => {
        if (active) setSummaryLoading(false);
      });

    api.publicImpactTrends()
      .then((data) => {
        if (active) setTrends(data);
      })
      .catch(() => {
        if (active) setTrendsUnavailable(true);
      })
      .finally(() => {
        if (active) setTrendLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(() => trends.slice(-6), [trends]);
  const chartMax = Math.max(...chartData.map((item) => item.totalWasteKg), 1);

  return (
    <div className="overflow-hidden pb-28 pt-28 text-brand-green md:pt-36">
      <section className="relative pb-24 pt-10 md:pb-32">
        <div className="pointer-events-none absolute -right-32 top-0 h-[34rem] w-[34rem] rounded-full bg-brand-yellow/20 blur-3xl" />
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative z-10">
              <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.32em] text-brand-green/55">
                <span className="h-px w-9 bg-brand-yellow" /> Public insights · Our impact
              </p>
              <h1 className="max-w-3xl font-display text-6xl uppercase leading-[.88] tracking-tight sm:text-7xl md:text-8xl">
                Waste can <span className="text-brand-green/30">become</span> worth more.
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-brand-green/70 md:text-xl">
                We track approved coffee-waste collections and turn spent grounds into the starting point for useful new materials. This is a clearer view of the circular work behind every recovery.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="#live-impact" className="inline-flex items-center gap-3 rounded-full bg-brand-green px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-green/10 transition hover:bg-brand-green/90">
                  Explore the numbers <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-brand-green transition hover:bg-white">
                  Build with us <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-7 text-xs font-medium text-brand-green/45">Current totals are based on approved collection records.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .12 }} className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-5 rounded-[3rem] border border-brand-green/10" />
              <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2.5rem] bg-brand-green shadow-2xl">
                <Image src="/images/impact/hero.png" alt="A greener circular future through coffee-ground recovery" fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 via-brand-green/10 to-transparent" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 44, repeat: Infinity, ease: "linear" }} className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/35" />
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/20 bg-white/90 p-5 shadow-xl backdrop-blur-sm md:bottom-9 md:left-9 md:right-9 md:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-green/50">A circular journey</p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold text-brand-green">
                    <span>Spent grounds</span><span className="h-px flex-1 bg-brand-green/20" /><Recycle aria-hidden="true" className="h-5 w-5 text-brand-green" /><span className="h-px flex-1 bg-brand-green/20" /><span>New value</span>
                  </div>
                </motion.div>
              </div>
              <div className="absolute -left-5 top-10 hidden rounded-2xl bg-brand-yellow p-4 shadow-xl sm:block md:-left-8">
                <Recycle aria-hidden="true" className="h-7 w-7 text-brand-green" />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section id="live-impact" className="scroll-mt-24 py-10 md:py-16">
        <Container>
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-green/45">Measured impact</p>
              <h2 className="mt-3 font-display text-4xl uppercase leading-none md:text-6xl">The numbers that matter.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-brand-green/60">Only approved collections count toward these totals. Pending and rejected entries are excluded.</p>
          </div>

          {summaryLoading ? (
            <div aria-live="polite" className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {[0, 1, 2, 3, 4].map((item) => <div key={item} className="h-52 animate-pulse rounded-3xl bg-white" />)}
              <span className="sr-only">Loading verified impact figures</span>
            </div>
          ) : summaryUnavailable || !summary ? (
            <div role="status" className="rounded-3xl border border-brand-green/10 bg-white px-6 py-10 text-center text-brand-green/65">
              Live impact figures are temporarily unavailable. Please check back soon.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              <article className="relative overflow-hidden rounded-3xl bg-brand-green p-7 text-white shadow-xl md:p-9">
                <div className="absolute -right-9 -top-9 h-32 w-32 rounded-full border border-white/10" />
                <Recycle aria-hidden="true" className="h-6 w-6 text-brand-yellow" />
                <p className="mt-10 font-display text-5xl md:text-6xl">{numberFormat.format(summary.totalWasteKg)}<span className="ml-2 text-lg font-sans font-semibold text-white/60">kg</span></p>
                <h3 className="mt-3 text-sm font-semibold text-white/75">Waste Upcycled (KG)</h3>
                <p className="mt-2 text-xs text-white/50">Approved waste quantity</p>
              </article>
              <MetricCard icon={Users} value={numberFormat.format(summary.contributingClients)} label="Contributing partners" detail="Partners with approved collections" />
              <MetricCard icon={Coffee} value={numberFormat.format(summary.approvedEntries)} label="Approved collections" detail="Verified collection records" />
              <MetricCard icon={Leaf} value={emissionsFormat.format(summary.totalWasteKg * methaneFactor)} label="Methane Emissions Averted" detail="kg CH₄ · waste upcycled × 0.072" />
              <MetricCard icon={Factory} value={emissionsFormat.format(summary.totalWasteKg * co2eFactor)} label="CO₂e Emissions Avoided" detail="kg CO₂e · waste upcycled × 2.016" />
            </div>
          )}
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-stretch">
            <div className="flex h-full flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-green/45">Collection over time</p>
                <h2 className="mt-3 font-display text-4xl uppercase leading-none md:text-5xl">Monthly Impact Trends</h2>
                <p className="mt-5 max-w-md text-base leading-7 text-brand-green/65">Monthly totals show approved coffee-waste collections recorded across the network.</p>
              </div>
              {trendLoading ? (
                <div aria-hidden="true" className="h-52 animate-pulse rounded-3xl bg-brand-green/10" />
              ) : chartData.length > 0 ? (
                <motion.aside initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} className="relative overflow-hidden rounded-3xl bg-brand-green p-6 text-white shadow-lg md:p-7">
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/10" />
                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-yellow">Latest monthly snapshot</p>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <h3 className="font-display text-3xl uppercase">{chartData[chartData.length - 1].period}</h3>
                      <p className="text-right"><span className="block font-display text-4xl">{numberFormat.format(chartData[chartData.length - 1].totalWasteKg)}</span><span className="text-xs text-white/60">kg upcycled</span></p>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
                      <div><p className="text-[10px] font-semibold uppercase tracking-wide text-white/55">CH₄ averted</p><p className="mt-1 text-lg font-semibold">{emissionsFormat.format(chartData[chartData.length - 1].totalWasteKg * methaneFactor)} <span className="text-xs font-normal text-white/60">kg</span></p></div>
                      <div><p className="text-[10px] font-semibold uppercase tracking-wide text-white/55">CO₂e avoided</p><p className="mt-1 text-lg font-semibold">{emissionsFormat.format(chartData[chartData.length - 1].totalWasteKg * co2eFactor)} <span className="text-xs font-normal text-white/60">kg</span></p></div>
                    </div>
                  </div>
                </motion.aside>
              ) : (
                <div className="rounded-3xl border border-brand-green/10 bg-white p-6 text-sm leading-6 text-brand-green/60">
                  Monthly impact snapshots will appear as approved collection data is recorded.
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-brand-green/10 bg-white p-6 shadow-lg md:p-9">
              <div className="flex items-center justify-between border-b border-brand-green/10 pb-5">
                <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green/45">Recovered material</p><p className="mt-1 text-sm font-semibold text-brand-green">Kilograms per month</p></div>
                <span className="rounded-full bg-brand-yellow/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green">Monthly</span>
              </div>
              {trendLoading ? (
                <div aria-live="polite" className="flex h-52 items-end gap-3 pt-8">{[35, 60, 42, 78, 52, 88].map((height, index) => <div key={index} style={{ height: `${height}%` }} className="flex-1 animate-pulse rounded-t-lg bg-brand-green/10" />)}<span className="sr-only">Loading collection history</span></div>
              ) : trendsUnavailable ? (
                <p role="status" className="py-16 text-center text-sm text-brand-green/60">Collection history is temporarily unavailable.</p>
              ) : chartData.length === 0 ? (
                <p className="py-16 text-center text-sm text-brand-green/60">Collection history will appear as approved records are added.</p>
              ) : (
                <div className="flex h-52 items-end gap-3 pt-8" role="img" aria-label="Monthly approved coffee-waste collection trend in kilograms">
                  {chartData.map((item) => {
                    const height = Math.max((item.totalWasteKg / chartMax) * 100, 4);
                    return <div key={item.period} className="group flex h-full flex-1 flex-col justify-end">
                      <span className="mb-2 text-center text-[10px] font-semibold text-brand-green/55 opacity-0 transition group-hover:opacity-100">{numberFormat.format(item.totalWasteKg)} kg</span>
                      <div style={{ height: `${height}%` }} title={`${item.period}: ${numberFormat.format(item.totalWasteKg)} kg`} className="min-h-1 rounded-t-lg bg-gradient-to-t from-brand-green to-brand-green/65 transition-all group-hover:from-brand-green/80" />
                      <span className="mt-3 truncate text-center text-[10px] font-semibold text-brand-green/50">{item.period}</span>
                    </div>;
                  })}
                </div>
              )}
              {!trendLoading && !trendsUnavailable && chartData.length > 0 && (
                <div className="mt-7 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-y border-brand-green/10 text-[10px] uppercase tracking-wide text-brand-green/50">
                        <th scope="col" className="py-3 pr-4 font-semibold">Month</th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">Waste Upcycled (KG)</th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">Methane Averted (kg CH₄)</th>
                        <th scope="col" className="pl-3 py-3 text-right font-semibold">CO₂e Avoided (kg CO₂e)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((item) => (
                        <tr key={item.period} className="border-b border-brand-green/5 text-brand-green/75 last:border-0">
                          <th scope="row" className="py-3 pr-4 font-semibold">{item.period}</th>
                          <td className="px-3 py-3 text-right tabular-nums">{numberFormat.format(item.totalWasteKg)}</td>
                          <td className="px-3 py-3 text-right tabular-nums">{emissionsFormat.format(item.totalWasteKg * methaneFactor)}</td>
                          <td className="pl-3 py-3 text-right tabular-nums">{emissionsFormat.format(item.totalWasteKg * co2eFactor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="mt-5 text-[11px] leading-5 text-brand-green/45">Emissions values are calculated from approved collection quantities using the displayed factors.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-green/45">How impact is made</p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-none md:text-6xl">A better end for coffee grounds.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return <motion.article key={step.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .45, delay: index * .1 }} className="rounded-3xl border border-brand-green/10 bg-white p-7 shadow-sm md:p-9">
                <div className="flex items-center justify-between"><span className="font-display text-4xl text-brand-green/15">{step.number}</span><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/30"><Icon aria-hidden="true" className="h-6 w-6 text-brand-green" /></div></div>
                <h3 className="mt-8 font-display text-2xl uppercase text-brand-green">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-green/60">{step.copy}</p>
              </motion.article>;
            })}
          </div>
        </Container>
      </section>

      <section className="pt-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-yellow px-7 py-12 md:px-14 md:py-16">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-brand-green/10" />
            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-green/55">Be part of the loop</p><h2 className="mt-3 font-display text-4xl uppercase leading-none text-brand-green md:text-6xl">Let&apos;s make waste useful.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-brand-green/70">Join the partners helping move coffee waste toward a more circular future.</p></div>
              <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-brand-green px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-green/90">Talk to our team <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function MetricCard({ icon: Icon, value, label, detail }: { icon: typeof Users; value: string; label: string; detail: string }) {
  return (
    <article className="rounded-3xl border border-brand-green/10 bg-white p-7 shadow-lg md:p-9">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/30"><Icon aria-hidden="true" className="h-6 w-6 text-brand-green" /></div>
      <p className="mt-10 font-display text-5xl text-brand-green md:text-6xl">{value}</p>
      <h3 className="mt-3 text-sm font-semibold text-brand-green/75">{label}</h3>
      <p className="mt-2 text-xs text-brand-green/45">{detail}</p>
    </article>
  );
}
