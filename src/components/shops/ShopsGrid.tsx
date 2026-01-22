'use client';

import * as React from 'react';
import { Container } from '../ui/core';
import { SHOPS } from '@/lib/data';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { MarketModal } from './MarketModal';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'tween' as const,
            duration: 0.5,
            ease: 'easeOut' as const,
        },
    },
};

export function ShopsGrid() {
    const [selectedShop, setSelectedShop] = React.useState<typeof SHOPS[0] | null>(null);

    return (
        <section className="py-24 bg-brand-peach/30" id="markets">
            <Container>
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <h2 className="title-strikethrough text-6xl md:text-[8rem] font-display text-brand-green uppercase leading-[0.8]">
                        Markets We Serve
                    </h2>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {SHOPS.map((shop, index) => (
                        <motion.div
                            key={shop.id}
                            className="group cursor-pointer relative"
                            variants={cardVariants}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            onClick={() => setSelectedShop(shop)}
                        >
                            <motion.div
                                className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 bg-[#A8B5AF]"
                                whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 71, 51, 0.25)' }}
                            >
                                <motion.img
                                    src={shop.image}
                                    alt={shop.name}
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    onError={(e) => {
                                        const fallbackImages = [
                                            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800',
                                            'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
                                            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
                                            'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800'
                                        ];
                                        (e.target as HTMLImageElement).src = fallbackImages[index % 4];
                                    }}
                                />

                                {/* Yellow circle arrow button overlay */}
                                <div className="absolute inset-0 bg-brand-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileHover={{ scale: 1.1 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center shadow-xl transform"
                                    >
                                        <ArrowUpRight className="w-10 h-10 text-brand-green" />
                                    </motion.div>
                                </div>
                            </motion.div>
                            <h3 className="text-sm font-bold text-brand-green uppercase tracking-wider">
                                {shop.name}
                            </h3>
                            <p className="text-brand-green/60 text-xs mt-1">
                                {shop.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>

            <MarketModal
                isOpen={!!selectedShop}
                onClose={() => setSelectedShop(null)}
                shop={selectedShop}
            />
        </section>
    );
}
