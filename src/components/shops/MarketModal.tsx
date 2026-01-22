'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/core';
import Image from 'next/image';

interface MarketModalProps {
    isOpen: boolean;
    onClose: () => void;
    shop: {
        id: number;
        name: string;
        description: string;
        longDescription: string;
        image: string;
        marketFocus: string;
        keyBenefits: string[];
        applications: string[];
    } | null;
}

export function MarketModal({ isOpen, onClose, shop }: MarketModalProps) {
    if (!shop) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-brand-green/80 backdrop-blur-sm z-[100] cursor-pointer"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden max-w-5xl w-full max-h-[90vh] shadow-2xl pointer-events-auto flex flex-col md:flex-row relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-green hover:bg-brand-yellow transition-colors shadow-lg group"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            {/* Left Side: Image & Focus */}
                            <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                                <Image
                                    src={shop.image}
                                    alt={shop.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                    <div className="bg-brand-yellow text-brand-green px-4 py-1.5 rounded-full text-xs font-bold tracking-widest inline-block w-fit mb-4">
                                        {shop.marketFocus}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-display text-white uppercase leading-none">
                                        {shop.name}
                                    </h2>
                                </div>
                            </div>

                            {/* Right Side: Content */}
                            <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto bg-brand-peach/20">
                                <div className="space-y-8">
                                    {/* Description */}
                                    <section>
                                        <p className="text-brand-green/80 text-lg leading-relaxed font-medium">
                                            {shop.longDescription}
                                        </p>
                                    </section>

                                    {/* Two Column Grid: Benefits & Applications */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        {/* Benefits */}
                                        <section>
                                            <h3 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span className="w-1.5 h-6 bg-brand-yellow rounded-full" />
                                                Key Benefits
                                            </h3>
                                            <ul className="space-y-3">
                                                {shop.keyBenefits.map((benefit, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-brand-green/70 text-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                                                        {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        {/* Applications */}
                                        <section>
                                            <h3 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span className="w-1.5 h-6 bg-brand-green rounded-full" />
                                                Applications
                                            </h3>
                                            <ul className="space-y-3">
                                                {shop.applications.map((app, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-brand-green/70 text-sm">
                                                        <ArrowRight className="w-4 h-4 text-brand-yellow flex-shrink-0 mt-0.5" />
                                                        {app}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4 border-t border-brand-green/10 flex items-center justify-between gap-4 flex-wrap">
                                        <div className="text-brand-green/60 text-xs italic">
                                            Request technical specifications or samples.
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="bg-brand-green text-white hover:bg-brand-yellow hover:text-brand-green group"
                                        >
                                            Partner With Us
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
