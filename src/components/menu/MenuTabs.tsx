'use client';

import * as React from 'react';
import { Container } from '../ui/core';
import { MENU_CATEGORIES, MENU_ITEMS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
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

export function MenuTabs() {
    const [activeTab, setActiveTab] = React.useState('ALL EXTRACTS');

    const filteredItems = activeTab === 'ALL EXTRACTS'
        ? MENU_ITEMS
        : MENU_ITEMS.filter(item => item.category === activeTab);

    return (
        <section className="py-24 bg-brand-peach/30" id="extracts">
            <Container>
                {/* Animated Header */}
                <motion.div
                    className="no-transition flex justify-between items-end mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <h2 className="title-strikethrough text-6xl md:text-[8rem] font-display text-brand-green uppercase leading-[0.8]">
                        Our Extracts
                    </h2>
                    <div className="hidden md:block">
                        <span className="text-4xl md:text-[6rem] font-display text-brand-green leading-none"></span>
                    </div>
                </motion.div>

                {/* Animated Tabs */}
                <motion.div
                    className="no-transition flex flex-wrap gap-4 mb-16 px-1 py-1 bg-white/50 backdrop-blur-sm rounded-full w-fit max-w-full overflow-x-auto no-scrollbar"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                >
                    {MENU_CATEGORIES.map((category) => (
                        <motion.button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={cn(
                                'no-transition px-8 py-3 rounded-full text-sm font-bold whitespace-nowrap',
                                activeTab === category
                                    ? 'bg-white text-brand-green shadow-sm'
                                    : 'text-brand-green/60 hover:text-brand-green'
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Animated Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <AnimatePresence mode="wait">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                layout
                                className="no-transition group cursor-pointer"
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.3, ease: 'easeOut' }
                                }}
                            >
                                <motion.div
                                    className="no-transition relative aspect-square rounded-3xl overflow-hidden mb-6 bg-[#A8B5AF]"
                                    whileHover={{
                                        boxShadow: '0 25px 50px -12px rgba(0, 71, 51, 0.25)',
                                    }}
                                >
                                    <motion.img
                                        src={item.image}
                                        alt={item.name}
                                        className="no-transition w-full h-full object-cover"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                </motion.div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-brand-green uppercase tracking-tight">
                                        {item.name}
                                    </h3>
                                    <p className="text-brand-green/80 text-sm px-2 line-clamp-2">
                                        {item.description}
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-1 pt-2">
                                        {item.applications.slice(0, 3).map((app, i) => (
                                            <span key={i} className="text-xs bg-brand-green/10 text-brand-green px-2 py-1 rounded-full">
                                                {app}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </Container>
        </section>
    );
}
