'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../ui/core';
import { Instagram, Facebook, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion

// Variants for staggered children
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

// Variants for individual footer sections
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 70,
            damping: 15,
        },
    },
};

export function Footer() {
    return (
        <footer className="bg-white py-16 md:py-20 border-t border-brand-green/10">
            <Container>
                {/* Main Footer Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }} // Animate when 30% of the element is in view
                >
                    {/* Section 1: Brand Info */}
                    <motion.div className="space-y-5" variants={itemVariants}>
                        <Link href="/">
                            <Image src="/images/logo-3.png" alt="Recrema Logo" width={260} height={120} className="h-20 md:h-32 w-auto object-contain" />
                        </Link>
                        <p className="text-brand-green/75 leading-relaxed font-medium text-sm">
                            Recrema transforms coffee waste into high-value eco-ingredients, pioneering India&apos;s transition to a circular economy.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <a href="https://www.instagram.com/_recrema_/" className="w-8 h-8 ss:w-9 ss:h-9 rounded-full bg-brand-green/5 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300 group">
                                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://www.facebook.com/share/19VaNVWpND/" className="w-9 h-9 rounded-full bg-brand-green/5 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300 group">
                                <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://www.linkedin.com/company/visionforge-ventures-pvt-ltd/" className="w-9 h-9 rounded-full bg-brand-green/5 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300 group">
                                <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://x.com/Recrema041125" className="w-9 h-9 rounded-full bg-brand-green/5 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300 group">
                                <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Section 2: Quick Links */}
                    <motion.div variants={itemVariants}>
                        <h4 className="font-bold text-brand-green mb-5 text-base uppercase tracking-wide">Quick Links</h4>
                        <ul className="space-y-3">
                            {['About', 'Our Extracts', 'Markets', 'Technology', 'Impact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={item === 'Our Extracts' ? '/extracts' : item === 'Markets' ? '/markets' : item === 'Technology' ? '/technology' : item === 'Impact' ? '/impact' : item === 'About' ? '/about' : '#'}
                                        className="text-brand-green/70 hover:text-brand-green transition-colors font-medium flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="w-4 h-0 opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all duration-300 text-brand-green" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Section 3: Our Extracts */}
                    <motion.div variants={itemVariants}>
                        <h4 className="font-bold text-brand-green mb-5 text-base uppercase tracking-wide">Our Extracts</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Coffee Oil', slug: 'coffee-oil' },
                                { name: 'Caffeine Extract', slug: 'caffeine-extract' },
                                { name: 'Natural Antioxidants', slug: 'antioxidants' },
                                { name: 'Organic Fertilizer', slug: 'organic-fertilizer' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={`/extracts#${item.slug}`}
                                        className="text-brand-green/70 hover:text-brand-green transition-colors font-medium flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="w-4 h-0 opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all duration-300 text-brand-green" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Section 4: Contact */}
                    <motion.div variants={itemVariants}>
                        <h4 className="font-bold text-brand-green mb-5 text-base uppercase tracking-wide">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-green/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Mail className="w-4 h-4 text-brand-green" />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-green/50 mb-0.5 uppercase tracking-wide">Email</p>
                                    <a href="mailto:visionforge.ventures@gmail.com" className="text-brand-green/80 hover:text-brand-green transition-colors font-medium text-sm">
                                        support@recrema.in
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-green/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Phone className="w-4 h-4 text-brand-green" />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-green/50 mb-0.5 uppercase tracking-wide">Whatsapp</p>
                                    <span className="text-brand-green/80 font-medium text-sm">+91 9649154803, 7073425362</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-green/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MapPin className="w-4 h-4 text-brand-green" />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-green/50 mb-0.5 uppercase tracking-wide">Location</p>
                                    <span className="text-brand-green/80 font-medium text-sm leading-relaxed">
                                        Sanchore, Rajasthan, India
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </motion.div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    className="pt-8 border-t border-brand-green/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ type: 'spring', stiffness: 70, damping: 15, delay: 0.4 }}
                >
                    <p className="text-brand-green/60">©️ 2026 Recrema.com. All rights reserved. Property of VisionForge Ventures Pvt. Ltd.</p>
                    <div className="flex flex-col ss:flex-row items-center gap-2 ss:gap-6 md:gap-8 text-center ss:text-left">
                        <span className="text-brand-green/60">
                            Designed and created by{' '}
                            <Link href="https://shailendra-soni-portfolio.vercel.app" className="hover:text-brand-green transition-colors font-semibold">
                                Shailendra Soni
                            </Link>
                        </span>
                    </div>
                </motion.div>
            </Container>
        </footer>
    );
}
