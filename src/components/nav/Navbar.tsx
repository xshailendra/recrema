'use client';

import * as React from 'react';
import Link from 'next/link';
import { } from '../ui/core';
import { motion, AnimatePresence } from 'framer-motion';

// Navigation links
const navLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Extracts', href: '/extracts' },
    { name: 'Markets', href: '/markets' },
    { name: 'Technology', href: '/technology' },
    { name: 'Impact', href: '/impact' },
];

// Navbar animation variants
const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 80,
            damping: 15,
            delay: 0.5,
        },
    },
};

// Menu dropdown variants
const menuVariants = {
    hidden: {
        opacity: 0,
        y: -10,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 25,
            staggerChildren: 0.05,
            delayChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
            duration: 0.2,
        },
    },
};

// Menu item variants
const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 25,
        },
    },
};

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);




    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.nav
            className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4"
            variants={navbarVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="relative flex items-center justify-between bg-[#FFF1E1] rounded-full px-1.5 ss:px-2 py-1.5 ss:py-2 shadow-lg w-full max-w-2xl border border-brand-green/10">
                <div className="flex items-center relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2 px-3 ss:px-6 py-2 ss:py-2.5 bg-white rounded-full text-brand-green text-sm font-bold shadow-sm hover:bg-white/90 transition-all"
                    >
                        <motion.svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            animate={{ rotate: isMenuOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <line x1="4" x2="20" y1="9" y2="9" />
                            <line x1="4" x2="20" y1="15" y2="15" />
                        </motion.svg>
                        <span className="hidden ss:inline">Menu</span>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                className="absolute top-full left-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-brand-green/10 overflow-hidden"
                                variants={menuVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="py-2">
                                    {navLinks.map((link) => (
                                        <motion.div key={link.name} variants={menuItemVariants}>
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block px-5 py-3 text-brand-green font-medium hover:bg-brand-green/5 transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Link href="/" className="text-lg ss:text-xl font-display text-brand-green tracking-tight">
                    RECREMA
                </Link>

                <div className="flex items-center">
                    <Link
                        href="/contact"
                        className="px-3 ss:px-6 py-2 ss:py-2.5 bg-white rounded-full text-brand-green text-sm font-bold shadow-sm hover:bg-white/90 transition-all border border-brand-green/5 whitespace-nowrap"
                    >
                        <span className="ss:hidden text-[11px]">Contact us</span>
                        <span className="hidden ss:inline">Contact us</span>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
