'use client';

import * as React from 'react';
import { motion, useScroll } from 'framer-motion';
import { Container } from '../ui/core';
import { Zap, ShieldCheck, Thermometer, Box, ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';
import Link from 'next/link';

const workflow = [
    {
        id: 1,
        title: "Drying of Collected SCGs",
        description: "Freshly collected spent coffee grounds are carefully dehydrated to remove moisture without damaging their internal compounds.",
        points: ["Reduces microbial growth", "Preserves essential oils and antioxidants", "Ensures optimal consistency for downstream processing"],
        impact: "This step sets the foundation for a clean, stable, and high-quality input material.",
        icon: Thermometer,
        color: "brand-peach",
        featured: true
    },
    {
        id: 2,
        title: "Sterilization Using UV Light",
        description: "After drying, the SCGs undergo UV-C sterilization, a non-chemical and eco-friendly method.",
        points: ["Eliminates harmful bacteria and pathogens", "Maintains natural integrity of compounds", "Ensures product safety for sensitive industries"],
        impact: "UV sterilization guarantees that the material entering the extraction chamber is lab-grade clean.",
        icon: ShieldCheck,
        color: "brand-yellow",
        featured: true
    },
    {
        id: 3,
        title: "Supercritical CO₂ Extraction",
        description: "The heart of our patented process. Recognized as the gold standard for high-purity, solvent-free extraction.",
        points: ["No chemical solvents", "Maximum purity of extracts", "Environmentally safe and fully recyclable"],
        impact: "We isolate coffee oil, antioxidants, and polyphenols with unmatched precision.",
        icon: FlaskConical,
        color: "brand-green",
        featured: true
    },
    {
        id: 4,
        title: "Packaging of Extracts",
        description: "Final products are filtered, stabilized, and packed in industry-grade containers with full traceability.",
        points: ["Air-tight, contamination-free packaging", "Batch-level traceability", "Quality-controlled for B2B clients"],
        impact: "Each extract is delivered in its purest form—ready for premium integration.",
        icon: Box,
        color: "brand-peach",
        featured: true
    }
];

export function TechnologySection() {
    useScroll();

    return (
        <div className="bg-[#FDF8F3] min-h-screen pt-32 pb-48 relative overflow-hidden">
            {/* Blueprint Overlays */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* Hero Section */}
            <header className="mb-48 relative z-10">
                <Container>
                    <div className="max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-brand-yellow font-bold uppercase tracking-[0.5em] text-xs mb-8 block">Scientific Excellence</span>
                            <h1 className="text-7xl md:text-9xl font-display text-brand-green uppercase leading-none tracking-tighter mb-12">
                                Patents <br />
                                <span className="text-brand-green/20 italic">& Precision</span>
                            </h1>
                            <p className="text-2xl md:text-3xl text-brand-green/70 font-medium leading-tight max-w-2xl">
                                Engineering the future of circular ingredients through advanced supercritical processing.
                            </p>
                        </motion.div>
                    </div>
                </Container>
            </header>

            {/* Core Tech Intro */}
            <section className="mb-64">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-brand-peach/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative aspect-square rounded-[3.5rem] overflow-hidden border border-brand-green/10 bg-white shadow-2xl">
                                <motion.img
                                    initial={{ scale: 1.1 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    src="/images/technology/innovation-heart.png"
                                    alt="Supercritical CO2 Extraction Heart"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/20 via-transparent to-transparent" />
                                <div className="absolute top-8 left-8 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-brand-green/5 shadow-lg">
                                    <Zap className="w-8 h-8 text-brand-yellow" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-12">
                            <h2 className="text-5xl md:text-6xl font-display text-brand-green uppercase leading-none">
                                The heart of <br /> Innovation
                            </h2>
                            <p className="text-xl text-brand-green/70 leading-relaxed max-w-xl">
                                At the core of our innovation is a patented extraction process designed to deliver maximum purity, efficiency, and sustainability. Every step of our technology pipeline is engineered to transform spent coffee grounds into high-value extracts while maintaining strict safety standards.
                            </p>
                            <div className="pt-8 grid grid-cols-2 gap-12 border-t border-brand-green/5">
                                <div>
                                    <span className="text-brand-yellow font-bold text-4xl block mb-2">99.9%</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green/40">Extraction Purity</span>
                                </div>
                                <div>
                                    <span className="text-brand-green font-bold text-4xl block mb-2">100%</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green/40">Solvent Free</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Workflow Timeline */}
            <section className="relative">
                <Container>
                    <div className="mb-24 flex items-end justify-between">
                        <div className="space-y-4">
                            <span className="text-brand-peach font-bold uppercase tracking-widest text-xs italic">Step-by-Step</span>
                            <h2 className="text-6xl font-display text-brand-green uppercase leading-none">The Processing <br /> Workflow</h2>
                        </div>
                        <div className="hidden lg:block w-32 h-px bg-brand-green/10 mb-4" />
                    </div>

                    <div className="space-y-12">
                        {workflow.map((step, index) => (
                            <WorkflowStep key={step.id} step={step} index={index} />
                        ))}
                    </div>
                </Container>
            </section>

            {/* Technical CTA */}
            <section className="mt-64 relative z-10">
                <Container>
                    <div className="bg-brand-green rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                        <div className="relative z-10 space-y-12">
                            <h3 className="text-5xl md:text-7xl font-display text-white uppercase leading-none tracking-tighter">
                                Technology That <br /> <span className="text-brand-yellow">Powers Sustainability</span>
                            </h3>
                            <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                                Our approach closes the loop between waste and value. By combining advanced engineering with eco-conscious processing, we ensure excellence from collection to packaging.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-6 bg-brand-yellow text-brand-green px-12 py-8 rounded-full text-sm font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-2xl">
                                Request Tech Specs
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}

interface WorkflowStepProps {
    step: {
        id: number;
        title: string;
        description: string;
        points: string[];
        impact: string;
        icon: React.ElementType;
        color: string;
        featured: boolean;
    };
    index: number;
}

function WorkflowStep({ step, index }: WorkflowStepProps) {
    const Icon = step.icon;
    const isFeatured = step.featured;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`group relative grid grid-cols-1 lg:grid-cols-12 gap-12 p-10 md:p-16 rounded-[4rem] border transition-all duration-700 overflow-hidden ${isFeatured
                ? 'bg-brand-green text-white border-white/10 shadow-3xl'
                : 'bg-white text-brand-green border-brand-green/5 hover:border-brand-green/10 shadow-xl'
                }`}
        >
            {/* Background Number */}
            <div className={`absolute top-0 right-0 text-[18rem] md:text-[25rem] font-display leading-[0.7] transition-opacity duration-1000 select-none ${isFeatured ? 'opacity-[0.03] text-white' : 'opacity-[0.02] text-brand-green'
                }`}>
                0{step.id}
            </div>

            <div className="lg:col-span-1 flex lg:flex-col items-center gap-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg ${isFeatured ? 'bg-brand-yellow text-brand-green' : 'bg-brand-green/5 text-brand-green'
                    }`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div className={`w-px h-full hidden lg:block ${isFeatured ? 'bg-white/10' : 'bg-brand-green/5'}`} />
            </div>

            <div className="lg:col-span-6 space-y-8 z-10">
                <div className="space-y-4">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${isFeatured ? 'text-brand-yellow' : 'text-brand-peach'}`}>
                        Process Phase 0{step.id}
                    </span>
                    <h3 className="text-4xl md:text-5xl font-display uppercase leading-[0.9] tracking-tighter">
                        {step.title}
                    </h3>
                </div>
                <p className={`text-lg md:text-xl font-medium leading-relaxed ${isFeatured ? 'text-white/70' : 'text-brand-green/60'}`}>
                    {step.description}
                </p>
                <div className={`p-8 rounded-[2rem] border ${isFeatured ? 'bg-white/5 border-white/10' : 'bg-brand-peach/5 border-brand-green/5'
                    }`}>
                    <p className={`text-sm font-bold uppercase tracking-widest leading-snug italic ${isFeatured ? 'text-brand-yellow' : 'text-brand-green'}`}>
                        &quot;{step.impact}&quot;
                    </p>
                </div>
            </div>

            <div className="lg:col-span-5 space-y-6 z-10">
                <h4 className={`text-[10px] font-extrabold uppercase tracking-[0.5em] mb-8 flex items-center gap-4 ${isFeatured ? 'text-white/40' : 'text-brand-green/20'}`}>
                    <ArrowRight className="w-4 h-4" /> Operational Purity
                </h4>
                <div className="space-y-4">
                    {step.points.map((point: string) => (
                        <div key={point} className="flex gap-4 items-center group/item">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${isFeatured ? 'border-brand-yellow/30 bg-brand-yellow/10 group-hover/item:bg-brand-yellow' : 'border-brand-green/20 bg-brand-green/5 group-hover/item:bg-brand-green'
                                }`}>
                                <CheckCircle2 className={`w-3 h-3 transition-colors ${isFeatured ? 'text-brand-yellow group-hover/item:text-brand-green' : 'text-brand-green group-hover/item:text-white'
                                    }`} />
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-widest ${isFeatured ? 'text-white/80' : 'text-brand-green/70'}`}>
                                {point}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
