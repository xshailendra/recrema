'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '../ui/core';
import { Users, Recycle, TrendingUp, Handshake, Factory, Award, Leaf, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

// Animation variants omitted as they are unused

function Counter({ value, suffix = "", duration = 2 }: { value: number, suffix?: string, duration?: number }) {
    const [count, setCount] = React.useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    React.useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            if (start === end) return;

            const totalMiliseconds = duration * 1000;
            const incrementTime = (totalMiliseconds / end);

            const timer = setInterval(() => {
                start += 1;
                setCount(start);
                if (start === end) clearInterval(timer);
            }, incrementTime);

            return () => clearInterval(timer);
        }
    }, [isInView, value, duration]);

    return (
        <span ref={ref} className="font-display">
            {count}{suffix}
        </span>
    );
}

export function ImpactSection() {
    return (
        <div className="bg-[#FDF8F3] min-h-screen pt-32 pb-48 font-sans transition-colors duration-500 relative overflow-hidden">
            {/* 01. HERO DISCOVERY */}
            <section className="mb-48 relative overflow-hidden">
                <Container>
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2 relative z-10">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-brand-yellow font-bold uppercase tracking-[0.4em] text-xs mb-8 block"
                            >
                                Environmental Benchmark
                            </motion.span>
                            <h1 className="text-5xl ss:text-7xl md:text-9xl font-display text-brand-green uppercase leading-[0.85] tracking-tighter mb-12">
                                Shared <br />
                                <span className="text-brand-green/20 italic">Impact</span>
                            </h1>
                            <p className="text-xl ss:text-2xl text-brand-green/70 font-medium leading-tight max-w-xl">
                                Our impact is rooted in meaningful partnerships, responsible operations, and a vision aligned with India&apos;s sustainable future.
                            </p>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2 }}
                                className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl"
                            >
                                <Image
                                    src="/images/impact/hero.png"
                                    alt="Sustainable Future Vision"
                                    fill
                                    className="object-cover"
                                    quality={100}
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/40 to-transparent" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-6 left-4 ss:-left-10 bg-white p-6 ss:p-8 rounded-3xl shadow-xl hidden lg:flex items-center gap-4 ss:gap-6 border border-brand-green/5 z-20"
                            >
                                <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center">
                                    <Recycle className="w-8 h-8 text-brand-green" />
                                </div>
                                <div>
                                    <span className="block text-4xl font-display text-brand-green leading-none">
                                        <Counter value={100} suffix="%" />
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green/40">Circular Commitment</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 02. REGIONAL PARTNERSHIPS */}
            <section className="mb-64">
                <Container>
                    <div className="bg-white rounded-[4rem] p-6 ss:p-12 md:p-24 shadow-xl border border-brand-green/5 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <span className="text-brand-peach font-bold uppercase tracking-widest text-xs italic">Community Scale</span>
                                    <h2 className="text-4xl ss:text-5xl md:text-6xl font-display text-brand-green uppercase leading-none tracking-tighter">
                                        Growing Regional <br /> Partnerships
                                    </h2>
                                </div>
                                <p className="text-xl text-brand-green/70 leading-relaxed">
                                    We have collaborated with <strong>50+ cafés and 3+ major coffee chains</strong> across <strong>Jodhpur, Udaipur, and Ahmedabad</strong>, creating a reliable and efficient collection ecosystem.
                                </p>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="p-4 ss:p-8 bg-brand-peach/10 rounded-3xl border border-brand-peach/10">
                                        <Counter value={50} suffix="+" />
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mt-2">Active Cafés</span>
                                    </div>
                                    <div className="p-4 ss:p-8 bg-brand-yellow/10 rounded-3xl border border-brand-yellow/10">
                                        <Counter value={3} suffix="+" />
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mt-2">Major Chains</span>
                                    </div>
                                </div>
                                <ul className="space-y-6">
                                    {[
                                        "Reduce daily waste generated by coffee outlets",
                                        "Enable cafés to participate in sustainability initiatives",
                                        "Build an interconnected supply chain",
                                        "Promote a culture of conscious waste management"
                                    ].map((point, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-4 text-brand-green/80 font-medium"
                                        >
                                            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                                            {point}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/impact/network.png"
                                    alt="Regional Collection Network"
                                    fill
                                    className="object-cover"
                                    quality={90}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 03. INDUSTRIAL PROCESSING */}
            <section className="mb-64">
                <Container>
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-24">
                        <div className="lg:w-1/2 space-y-12">
                            <div className="space-y-4">
                                <span className="text-brand-yellow font-bold uppercase tracking-widest text-xs italic">Operational Power</span>
                                <h2 className="text-5xl md:text-6xl font-display text-brand-green uppercase leading-none tracking-tighter">
                                    Industrial-Scale <br /> Capacity
                                </h2>
                            </div>
                            <p className="text-xl text-brand-green/70 leading-relaxed">
                                Starting strong with a pilot capacity of <strong>100 kg/day</strong>, our facility is equipped to handle large volumes of SCGs while maintaining consistent quality.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: TrendingUp, text: "Uninterrupted production cycles" },
                                    { icon: Factory, text: "Optimized energy usage" },
                                    { icon: ShieldCheck, text: "Consistent laboratory-grade purity" },
                                    { icon: Handshake, text: "Future-ready scalable operations" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-brand-green/5 shadow-sm">
                                        <div className="w-10 h-10 bg-brand-green/5 rounded-xl flex items-center justify-center shrink-0">
                                            <item.icon className="w-5 h-5 text-brand-green" />
                                        </div>
                                        <span className="text-sm font-bold text-brand-green/70 leading-snug">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <motion.div
                                style={{ rotate: -2 }}
                                className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
                            >
                                <Image
                                    src="/images/impact/facility-1.webp"
                                    alt="Industrial Scale Facility"
                                    fill
                                    className="object-cover"
                                    quality={100}
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </motion.div>
                            <div className="absolute -top-10 -right-10 bg-brand-green p-10 rounded-full shadow-2xl border-4 border-white">
                                <span className="block text-4xl font-display text-brand-yellow leading-none">100</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">KG / DAY</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 04. NATIONAL ALIGNMENT */}
            <section className="mb-64">
                <Container>
                    <div className="bg-brand-green rounded-[4rem] p-6 ss:p-12 md:p-32 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-peach/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 space-y-20">
                            <div className="max-w-3xl space-y-6">
                                <span className="text-brand-yellow font-bold uppercase tracking-[0.4em] text-xs">National Mission</span>
                                <h2 className="text-4xl ss:text-5xl md:text-7xl font-display uppercase leading-none tracking-tighter">
                                    Aligned With <br /> <span className="text-brand-peach italic">Sustainability Goals</span>
                                </h2>
                                <p className="text-xl md:text-2xl text-white/70 font-medium">
                                    We proudly operate in alignment with key Indian government initiatives, including <strong>AatmaNirbhar Bharat</strong> and the <strong>UN Sustainable Development Goals (SDGs).</strong>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { icon: Recycle, title: "Circular Economy", desc: "Waste reduction practices" },
                                    { icon: Leaf, title: "Green Innovation", desc: "Carbon footprint minimization" },
                                    { icon: Users, title: "Local Sourcing", desc: "Regional employment growth" },
                                    { icon: Award, title: "Self-Reliance", desc: "Eco-friendly manufacturing" }
                                ].map((goal, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -10 }}
                                        className="bg-white/5 backdrop-blur-md border border-white/10 p-5 ss:p-8 rounded-[2.5rem] space-y-6"
                                    >
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                            <goal.icon className="w-6 h-6 text-brand-yellow" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-display uppercase mb-2 leading-none">{goal.title}</h4>
                                            <p className="text-sm text-white/50 leading-relaxed font-medium">{goal.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* FINAL NARRATIVE */}
            <section>
                <Container>
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-6xl font-display text-brand-green uppercase leading-none tracking-tighter">
                            Building a Cleaner, <br /> <span className="text-brand-green/20 italic">Smarter Future</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-brand-green/60 font-medium leading-relaxed">
                            Every partnership, every batch processed, and every extract produced brings us closer to a world where waste becomes an opportunity.
                        </p>
                    </div>
                </Container>
            </section>
        </div>
    );
}



