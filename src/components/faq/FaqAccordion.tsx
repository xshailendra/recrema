'use client';

import * as React from 'react';
import { Container } from '../ui/core';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Updated FAQs for Recrema
const FAQS = [
    {
        id: 1,
        question: 'What is Recrema and what do you do?',
        answer: 'Recrema upcycles spent coffee grounds into high-value eco-ingredients for industries like cosmetics, pharmaceuticals, nutraceuticals, energy, and agriculture. We collect coffee waste from cafés, restaurants, and homes, then transform it into premium extracts like coffee oil, caffeine extract, natural antioxidants, and organic fertilizers.',
    },
    {
        id: 2,
        question: 'How do you collect coffee waste?',
        answer: 'We offer easy pickups for businesses and drop-off options. Whether you\'re running a bustling café or just brewing at home, we handle the collection – no fuss, just scheduled swoops or convenient drop-offs at partner locations.',
    },
    {
        id: 3,
        question: 'What extracts do you create from coffee grounds?',
        answer: 'We produce cosmetic-grade coffee oil, pharma-grade caffeine, natural antioxidants for skincare and food, exfoliating scrubs for beauty formulations, nutrient-packed organic fertilizers, and clean biofuels for energy.',
    },
    {
        id: 4,
        question: 'Is your process environmentally friendly?',
        answer: 'Absolutely! Our circular model ensures zero waste goes to landfill. We propose to process 100kg of spent coffee grounds daily, slashing carbon emissions equivalent to driving an SUV for roughly 18 months straight. Our goal is to make coffee recycling accessible, efficient, and rewarding.',
    },
    {
        id: 5,
        question: 'How can I partner with Recrema?',
        answer: 'We work with cafés, coffee chains, restaurants, hotels, corporate offices, and individual coffee lovers. Sign up on our Partner With Us page to start contributing your coffee waste and be part of the circular economy revolution.',
    },
    {
        id: 6,
        question: 'What are the benefits of partnering with Recrema?',
        answer: 'Partners benefit from free waste collection, sustainability certifications, reduced carbon footprint, and the satisfaction of contributing to environmental conservation. We also provide impact reports showing how much waste you\'ve helped divert from landfills.',
    },
];

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 80, damping: 20 }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const accordionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring' as const, stiffness: 100, damping: 20 }
    }
};

export function FaqAccordion() {
    const [openId, setOpenId] = React.useState<number | null>(null);

    return (
        <section className="py-24 md:py-32 bg-gradient-to-b from-brand-peach/30 to-white">
            <Container>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    {/* Header Section */}
                    <motion.div
                        className="text-center mb-16"
                        variants={fadeInUp}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-green/10 rounded-full text-brand-green text-sm font-semibold mb-4">
                            <HelpCircle className="w-4 h-4" />
                            Got Questions?
                        </span>
                        <h2 className="text-5xl md:text-7xl font-display text-brand-green uppercase mb-4">
                            FAQ
                        </h2>
                        <p className="text-brand-green/70 text-lg max-w-2xl mx-auto">
                            Everything you need to know about Recrema, our sustainability mission,
                            and how you can be part of the coffee upcycling revolution.
                        </p>
                    </motion.div>

                    {/* FAQ Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Sidebar */}
                        <motion.div
                            className="lg:col-span-1"
                            variants={fadeInUp}
                        >
                            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-brand-green/10 sticky top-32 h-full min-h-[500px] flex flex-col justify-center text-center">
                                <div className="w-20 h-20 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-8 mx-auto">
                                    <MessageCircle className="w-10 h-10 text-brand-green" />
                                </div>
                                <h3 className="font-display text-3xl text-brand-green uppercase mb-6">
                                    Still Have Questions?
                                </h3>
                                <p className="text-brand-green/70 text-lg mb-10 leading-relaxed">
                                    Can&apos;t find the answer you&apos;re looking for? Our team is here to help you understand every step of our upcycling journey.
                                </p>
                                <div className="mt-auto">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-3 w-full justify-center py-4 px-8 bg-brand-green text-white font-bold rounded-2xl hover:bg-brand-green/90 transition-all group shadow-lg shadow-brand-green/20"
                                    >
                                        Contact Us
                                        <motion.span
                                            className="inline-block text-xl"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* FAQ Accordion */}
                        <motion.div
                            className="lg:col-span-2 space-y-4"
                            variants={staggerContainer}
                        >
                            {FAQS.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    layout
                                    className="bg-white rounded-2xl border overflow-hidden cursor-pointer"
                                    animate={{
                                        borderColor: openId === faq.id ? 'rgba(34, 139, 34, 0.3)' : 'rgba(34, 139, 34, 0.1)',
                                        boxShadow: openId === faq.id
                                            ? '0 20px 25px -5px rgba(34, 139, 34, 0.05), 0 8px 10px -6px rgba(34, 139, 34, 0.05)'
                                            : '0 0 0 rgba(0,0,0,0)'
                                    }}
                                    transition={{
                                        duration: 0.45,
                                        layout: { type: 'spring', stiffness: 250, damping: 32 }
                                    }}
                                    variants={accordionVariants}
                                    whileHover={{
                                        scale: openId === faq.id ? 1 : 1.01,
                                        borderColor: openId === faq.id ? 'rgba(34, 139, 34, 0.3)' : 'rgba(34, 139, 34, 0.2)',
                                        boxShadow: '0 10px 15px -3px rgba(34, 139, 34, 0.1)'
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className={cn(
                                                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300",
                                                openId === faq.id
                                                    ? "bg-brand-green text-white"
                                                    : "bg-brand-green/10 text-brand-green"
                                            )}>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <h3 className={cn(
                                                "text-lg md:text-xl font-bold transition-colors pt-1.5",
                                                openId === faq.id ? "text-brand-green" : "text-brand-green/80 group-hover:text-brand-green"
                                            )}>
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: openId === faq.id ? 180 : 0 }}
                                            transition={openId === faq.id
                                                ? { type: 'spring', stiffness: 200, damping: 25 } // Open: smoother spring
                                                : { duration: 0.2, ease: "circIn" } // Close: crisp
                                            }
                                            className={cn(
                                                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ml-4",
                                                openId === faq.id
                                                    ? "bg-brand-green text-white"
                                                    : "bg-brand-green/10 text-brand-green"
                                            )}
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {openId === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                    transition: {
                                                        height: {
                                                            type: 'spring',
                                                            stiffness: 160,
                                                            damping: 30,
                                                            restDelta: 0.01
                                                        },
                                                        opacity: {
                                                            duration: 0.35
                                                        }
                                                    }
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                    transition: {
                                                        height: {
                                                            duration: 0.25,
                                                            ease: "circIn" // Smooth linear collapse
                                                        },
                                                        opacity: {
                                                            duration: 0.2
                                                        }
                                                    }
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 md:px-8 pb-6 md:pb-8 pl-20 md:pl-24">
                                                    <div className="bg-brand-peach/30 rounded-xl p-5 border-l-4 border-brand-green">
                                                        <p className="text-brand-green/80 text-base md:text-lg leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        className="mt-16 text-center"
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center gap-3 bg-brand-yellow/50 rounded-full px-6 py-3">
                            <span className="text-brand-green font-medium">Every Cup Counts!</span>
                            <Link
                                href="/contact"
                                className="bg-brand-green text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-brand-green/90 transition-colors"
                            >
                                Partner With Us
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
}
