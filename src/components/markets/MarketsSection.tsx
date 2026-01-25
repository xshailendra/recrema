'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '../ui/core';
import { SHOPS } from '@/lib/data';
import { ArrowRight, MoveRight } from 'lucide-react';
import Link from 'next/link';

const markets = SHOPS;

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

// Split Text Component for Hero
const SplitText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    return (
        <span className="inline-block overflow-hidden py-1 px-4 -mx-4">
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block relative"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                        delay: delay + i * 0.02,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
};

export function MarketsSection() {
    const { scrollYProgress } = useScroll();

    // Parallax decorations
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

    return (
        <div className="bg-[#FDF8F3] min-h-screen pt-32 pb-48 font-sans transition-colors duration-500 relative overflow-hidden">
            {/* Background Decorations */}
            <motion.div
                style={{ y: y1, rotate }}
                className="absolute top-[10%] -left-20 w-96 h-96 bg-brand-peach/20 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
                style={{ y: y2, rotate: -rotate }}
                className="absolute top-[40%] -right-20 w-[40rem] h-[40rem] bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none"
            />

            {/* 01. INTRO DISPLAY */}
            <section className="mb-32 relative z-10">
                <Container>
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-12 border-b border-brand-green/10 pb-20">
                        <div className="max-w-4xl">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-brand-yellow font-bold uppercase tracking-[0.4em] text-xs mb-8 block"
                            >
                                Industrial Horizon
                            </motion.span>
                            <h1 className="text-3xl ss:text-4xl md:text-5xl lg:text-6xl font-display text-brand-green uppercase leading-[0.85] tracking-tighter">
                                <SplitText text="MARKETS" /> <br />
                                <span className="text-brand-green/20 italic">
                                    <SplitText text="WE SERVE" delay={0.4} />
                                </span>
                            </h1>
                        </div>
                        <div className="max-w-sm">
                            <motion.p
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                className="text-xl text-brand-green/70 font-medium leading-tight mb-8"
                            >
                                Specializing in the large-scale integration of upcycled biological compounds across the global industrial landscape.
                            </motion.p>
                            <div className="flex gap-4">
                                <motion.div
                                    animate={{ width: [0, 48] }}
                                    className="w-12 h-px bg-brand-green/20 mt-3"
                                />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green/40">Scroll to Explore</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 02. THE MODULAR GALLERY */}
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Featured: Cosmetics - Large Span */}
                    <div className="lg:col-span-12 mb-10">
                        <GalleryItem market={markets[0]} size="featured" />
                    </div>

                    {/* Secondary: Pharma & Food - Half Spans */}
                    <div className="lg:col-span-6">
                        <GalleryItem market={markets[1]} size="vertical" />
                    </div>
                    <div className="lg:col-span-6">
                        <GalleryItem market={markets[2]} size="vertical" />
                    </div>

                    {/* Wide: Agriculture - Full Span */}
                    <div className="lg:col-span-12 mt-10">
                        <GalleryItem market={markets[3]} size="wide" />
                    </div>
                </div>
            </Container>

            {/* Final Navigation */}
            <section className="mt-48">
                <Container>
                    <div className="bg-brand-green rounded-[4rem] p-8 ss:p-16 md:p-32 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center text-white">
                            <div className="space-y-10">
                                <h2 className="text-4xl md:text-5xl font-display uppercase leading-[0.9] tracking-tighter">
                                    Pioneer the <br /> <span className="text-brand-peach italic">Next Standard</span>
                                </h2>
                                <p className="text-xl md:text-2xl text-white/60 font-medium max-w-lg leading-snug">
                                    Our technical team is ready to assist in your transition to sustainable, high-purity biological alternatives.
                                </p>
                            </div>
                            <div className="flex flex-col items-start gap-8 lg:items-end">
                                <Link href="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-brand-yellow text-brand-green px-16 py-8 rounded-full font-bold uppercase tracking-widest text-sm shadow-2xl hover:bg-white transition-all flex items-center gap-4"
                                    >
                                        Integrate with Us
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <Link href="/extracts" className="text-white border-b border-white/20 hover:border-brand-yellow transition-colors font-bold uppercase tracking-widest py-1 text-xs">
                                    View Specialty Extracts
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}

interface Market {
    id: number;
    name: string;
    image: string;
    description: string;
    longDescription: string;
    keyBenefits: string[];
    applications: string[];
}

interface GalleryItemProps {
    market: Market;
    size: 'featured' | 'vertical' | 'wide';
}

function GalleryItem({ market, size }: GalleryItemProps) {
    const isFeatured = size === 'featured';
    const isWide = size === 'wide';

    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Subtle parallax for the image inside the card
    const yImg = useTransform(scrollYProgress, [0, 1], [-20, 20]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className={`group relative rounded-[3rem] overflow-hidden bg-white shadow-lg host-shadow-xl hover:shadow-2xl transition-all duration-700 ${isFeatured ? 'h-[80vh]' : isWide ? 'h-[60vh]' : 'h-[70vh]'
                }`}
        >
            <div className="absolute inset-0 overflow-hidden">
                <motion.img
                    style={{ y: yImg, scale }}
                    src={market.image}
                    alt={market.name}
                    className="w-full h-[120%] object-cover transition-grayscale duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                    onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/90 via-brand-green/20 to-transparent" />
            </div>

            <div className={`absolute bottom-0 left-0 w-full p-5 ss:p-8 md:p-12 lg:p-16 flex flex-col justify-end text-white ${isFeatured ? 'lg:flex-row lg:items-end lg:justify-between gap-12' : 'space-y-6'
                } z-10 transition-opacity duration-500 group-hover:opacity-0`}>
                <div className="max-w-2xl space-y-4">
                    <span className="text-brand-yellow font-bold uppercase tracking-[0.4em] text-[10px] opacity-80 mb-2 block">
                        Sector 0{market.id}
                    </span>
                    <h2 className={`${isFeatured ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'} font-display uppercase leading-[0.85] tracking-tighter`}>
                        {market.name}
                    </h2>
                    <p className="text-base md:text-lg text-white/80 font-medium leading-tight line-clamp-2 italic">
                        {market.description}
                    </p>
                </div>

                <div className={`${isFeatured ? 'lg:w-[400px]' : 'w-full'} space-y-8`}>
                    <div className="flex flex-wrap gap-2">
                        {market.keyBenefits.map((benefit: string) => (
                            <span key={benefit} className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                {benefit}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Immersive Detail Overlay (On Hover) */}
            <motion.div
                className="absolute inset-0 bg-brand-peach/95 backdrop-blur-xl p-12 lg:p-16 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-700 ease-[0.16, 1, 0.3, 1] z-20"
            >
                <div className="h-full flex flex-col justify-between max-w-5xl mx-auto">
                    <div className="space-y-12">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="flex justify-between items-start"
                        >
                            <span className="text-brand-green/10 text-[12vw] xs:text-[15vw] ss:text-[6rem] md:text-[8rem] font-display leading-[0.6] -ml-4">0{market.id}</span>
                            <div className="w-20 h-20 rounded-full border border-brand-green/10 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                                <MoveRight className="w-8 h-8" />
                            </div>
                        </motion.div>
                        <div className="space-y-4">
                            <h3 className="text-4xl md:text-5xl font-display text-brand-green uppercase leading-none tracking-tighter">{market.name}</h3>
                            <p className="text-lg md:text-2xl text-brand-green/80 font-medium leading-[1.1] max-w-3xl">
                                {market.longDescription}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-brand-green/10">
                        {market.applications.map((app: string) => (
                            <div key={app} className="space-y-2">
                                <div className="w-8 h-1 bg-brand-yellow rounded-full" />
                                <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest block leading-tight">{app}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
