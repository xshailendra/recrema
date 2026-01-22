'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Coffee } from 'lucide-react';
import { Button } from '../ui/core';
import Link from 'next/link';

export function ExitIntentModal() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [hasShown, setHasShown] = React.useState(false);

    React.useEffect(() => {
        // Check session storage to see if it has already been shown in this session
        const shownInSession = sessionStorage.getItem('exit_modal_shown');
        if (shownInSession) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            // Trigger when mouse leaves the document window
            // 1. e.clientY <= 0: moving to tabs/address bar (standard approach)
            // 2. e.relatedTarget === null: leaving the window entirely
            const isLeavingTop = e.clientY <= 5; // Slight buffer
            const isLeavingWindow = e.relatedTarget === null || (e as MouseEvent & { toElement?: Element | null }).toElement === null;

            if ((isLeavingTop || isLeavingWindow) && !hasShown) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('exit_modal_shown', 'true');
            }
        };

        // No-op

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasShown]);

    const closeModal = () => setIsVisible(false);

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-brand-green/90 backdrop-blur-md z-[200] cursor-pointer"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: {
                                    type: 'spring',
                                    damping: 20,
                                    stiffness: 300
                                }
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                y: 20,
                                transition: { duration: 0.2 }
                            }}
                            className="bg-white rounded-[2.5rem] overflow-hidden max-w-2xl w-full shadow-2xl pointer-events-auto relative border-4 border-brand-yellow/30"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 z-10 w-10 h-10 bg-brand-peach/30 rounded-full flex items-center justify-center text-brand-green hover:bg-brand-yellow transition-colors group"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            <div className="p-8 md:p-12 text-center">
                                {/* Icon/Visual */}
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-24 h-24 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand-yellow/20"
                                >
                                    <Coffee className="w-12 h-12 text-brand-green" />
                                </motion.div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h2 className="text-4xl md:text-5xl font-display text-brand-green uppercase leading-[1.2] mb-6">
                                        Wait! Don&apos;t <br />
                                        <span className="inline-block mt-3 text-brand-yellow bg-brand-green px-4 py-1 rounded-lg">Leave Yet</span>
                                    </h2>

                                    <p className="text-brand-green/70 text-lg md:text-xl font-medium mb-8 max-w-md mx-auto">
                                        Stay updated on the circular coffee revolution. Partner with us and help turn waste into gems.
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <Link href="/contact" className="w-full sm:w-auto">
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                className="w-full sm:w-auto bg-brand-green text-white hover:bg-brand-yellow hover:text-brand-green font-bold group px-8"
                                                onClick={closeModal}
                                            >
                                                Partner With Us
                                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>

                                        <button
                                            onClick={closeModal}
                                            className="text-brand-green/50 hover:text-brand-green text-sm font-bold uppercase tracking-widest transition-colors py-2"
                                        >
                                            Maybe later
                                        </button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Bottom Accent */}
                            <div className="h-2 bg-gradient-to-r from-brand-yellow via-brand-peach to-brand-green" />
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
