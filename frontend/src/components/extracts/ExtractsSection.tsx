'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '../ui/core';
import { MENU_ITEMS } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};



// Split Text Component for Hero
const SplitText = ({ text }: { text: string }) => {
    return (
        <span className="inline-block overflow-hidden py-1 px-4 -mx-4">
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block relative"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                        delay: 0.4 + i * 0.02,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
};

export function ExtractsSection() {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

    return (
        <section className="pt-32 pb-32 bg-[#FDF8F3] overflow-hidden">
            <Container>
                {/* Hero Header */}
                <motion.div
                    className="mb-32 text-center max-w-5xl mx-auto"
                    style={{ scale, opacity }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-block bg-brand-green text-brand-yellow px-4 ss:px-8 py-2.5 rounded-full text-xs ss:text-sm font-bold tracking-[0.2em] uppercase mb-10 shadow-lg shadow-brand-green/10"
                    >
                        The Science of Purity
                    </motion.div>

                    <h1 className="text-4xl ss:text-6xl md:text-8xl font-display text-brand-green uppercase leading-none mb-10 tracking-tight">
                        <SplitText text="OUR" /> <br />
                        <span className="text-brand-green/30 italic">
                            <SplitText text="EXTRACTS" />
                        </span>
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex flex-col items-center gap-8"
                    >
                        <p className="text-xl ss:text-2xl md:text-3xl text-brand-green/80 font-medium leading-tight max-w-3xl">
                            Transforming waste coffee into high-purity, bio-active ingredients.
                        </p>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-px h-20 bg-gradient-to-b from-brand-green to-transparent"
                        />
                    </motion.div>
                </motion.div>

                {/* Extracts Grid with Parallax */}
                <div className="space-y-48">
                    {MENU_ITEMS.map((item, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <ExtractItem
                                key={item.id}
                                item={item}
                                index={index}
                                isEven={isEven}
                            />
                        );
                    })}
                </div>

                {/* Bottom CTA with Premium Feel */}
                <motion.div
                    className="mt-48 bg-brand-green rounded-[5rem] p-8 ss:p-16 md:p-32 text-center relative overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-yellow/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-peach/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />

                    <div className="relative z-10 max-w-4xl mx-auto space-y-16">
                        <motion.h2
                            className="text-3xl ss:text-5xl md:text-8xl font-display text-white uppercase leading-[0.85] tracking-tight"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            Elevate Your <br />
                            <span className="text-brand-yellow italic">Formulations</span>
                        </motion.h2>
                        <p className="text-white/60 text-lg ss:text-2xl font-medium max-w-2xl mx-auto">
                            Join the circular economy by sourcing sustainable, high-purity coffee extracts for your next innovation.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <Link href="/contact">
                                <motion.button
                                    className="bg-brand-yellow text-brand-green px-16 py-8 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white transition-all shadow-2xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start Partnership
                                </motion.button>
                            </Link>

                        </div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}

// Individual Extract Item with Parallax
interface ExtractItemProps {
    item: {
        id: number;
        name: string;
        description: string;
        image: string;
        category: string;
        applications: string[];
    };
    index: number;
    isEven: boolean;
}

function ExtractItem({ item, index, isEven }: ExtractItemProps) {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const yImg = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const yText = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, isEven ? 5 : -5]);

    return (
        <div
            ref={ref}
            id={item.name.toLowerCase().replace(/\s+/g, '-')}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-32 lg:gap-40 items-center scroll-mt-32`}
        >
            {/* Visual Side with Parallax */}
            <div className="w-full md:w-[33%] relative">
                <motion.div
                    style={{ y: yImg, rotate }}
                    className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#A8B5AF] shadow-2xl border-2 border-white/50"
                >
                    <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            y: [0, -15, 0],
                        }}
                        transition={{
                            opacity: { duration: 0.6 },
                            y: {
                                repeat: Infinity,
                                duration: 5,
                                ease: "easeInOut",
                                delay: index * 0.4 // Organic staggering
                            }
                        }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover scale-110"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-brand-green/5" />
                </motion.div>
            </div>

            {/* Content Side */}
            <motion.div
                style={{ y: yText }}
                className="w-full md:w-[60%] lg:w-[55%] space-y-10"
            >
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="flex items-center gap-4 text-brand-green/40 font-bold tracking-[0.3em] uppercase text-xs"
                    >
                        <span className="w-8 h-px bg-brand-green/20" />
                        {item.category} / CERTIFIED
                    </motion.div>

                    <motion.h2
                        variants={fadeInUp}
                        className="text-4xl ss:text-6xl md:text-8xl font-display text-brand-green uppercase leading-none tracking-tighter"
                    >
                        {item.name}
                    </motion.h2>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg ss:text-2xl text-brand-green/70 leading-relaxed font-medium"
                    >
                        {item.description}
                    </motion.p>
                </motion.div>

                {/* Premium Tags */}
                <motion.div
                    className="flex flex-wrap gap-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {item.applications.map((app: string, i: number) => (
                        <motion.span
                            key={i}
                            whileHover={{ y: -5, scale: 1.05 }}
                            className="bg-white border border-brand-green/10 text-brand-green px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md hover:bg-brand-green hover:text-white transition-all cursor-default"
                        >
                            {app}
                        </motion.span>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="pt-6"
                >
                    <Link href="/contact">
                        <motion.button
                            className="group bg-brand-green text-white px-12 py-6 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:shadow-brand-green/20 transition-all flex items-center gap-4"
                            whileHover={{ x: 10, backgroundColor: "#D4B08C", color: "#004733" }}
                        >
                            Request Analysis
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.div>
        </div >
    );
}
