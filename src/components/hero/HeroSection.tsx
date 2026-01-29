'use client';
import Link from 'next/link';

import { Container } from '../ui/core';
import { motion } from 'framer-motion';
import Image from 'next/image';

const hashtags = ['#ZeroWaste', '#CircularEconomy', '#Sustainability', '#EcoIngredients', '#CoffeeWaste'];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const hashtagVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.8 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 100,
            damping: 10,
        },
    },
};

const heroTextVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 40,
            damping: 30,
            delay: 0.2,
        },
    },
};

const contentVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 60,
            damping: 15,
            delay: 0.6,
        },
    },
};

const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 100,
            damping: 10,
            delay: 1,
        },
    },
    hover: {
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0, 71, 51, 0.2)',
    },
    tap: { scale: 0.95 },
};

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Full Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/close-up-coffee-bean.jpg"
                    alt="Sustainability Background"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* Top Hashtags with Stagger Animation */}
            <motion.div
                className="absolute top-24 lg:top-32 left-0 right-0 z-30 flex justify-center gap-3 ss:gap-6 lg:gap-12 px-4 lg:px-4 whitespace-nowrap overflow-x-auto scrollbar-hide"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {hashtags.map((tag) => (
                    <motion.span
                        key={tag}
                        className="text-white font-bold text-xs ss:text-sm lg:text-base tracking-tight cursor-default"
                        variants={hashtagVariants}
                        whileHover={{
                            scale: 1.1,
                            color: '#FFD572',
                            transition: { duration: 0.2 },
                        }}
                    >
                        {tag}
                    </motion.span>
                ))}
            </motion.div>

            {/* Massive Layered Text with Animation */}
            <motion.h1
                className="no-transition absolute top-[35%] lg:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-[15vw] ss:text-[18vw] lg:text-[16rem] font-display leading-[1.1] uppercase tracking-tighter z-10 pointer-events-none select-none whitespace-nowrap py-4"
                style={{
                    color: 'var(--text-green)',
                    backgroundImage: 'linear-gradient(90deg, var(--text-green) 0%, var(--text-green) 40%, #2d7a5e 50%, var(--text-green) 60%, var(--text-green) 100%)',
                    backgroundSize: '200% 100%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
                variants={heroTextVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.span
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                        duration: 5,
                        ease: 'linear',
                        repeat: Infinity,
                    }}
                    style={{
                        backgroundImage: 'linear-gradient(90deg, var(--text-green) 0%, var(--text-green) 40%, #2d7a5e 50%, var(--text-green) 60%, var(--text-green) 100%)',
                        backgroundSize: '200% 100%',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                    }}
                >
                    Zero Waste
                </motion.span>
            </motion.h1>

            {/* Content Row with Slide Up Animation */}
            <Container className="relative z-30 mt-auto pb-12 lg:pb-10">
                <motion.div
                    className="no-transition grid grid-cols-1 lg:grid-cols-2 gap-8 lg:grid-cols-2 lg:gap-12 items-end"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className=" flex flex-col items-start max-w-lg">
                        <motion.div
                            className="no-transition space-y-4 mb-8"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <p className="text-white font-bold text-sm ss:text-base lg:text-lg leading-relaxed">
                                We transform spent coffee grounds into high-value eco-ingredients for cosmetics, pharmaceuticals, agriculture, and functional foods.
                            </p>

                        </motion.div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
    <Link href="/technology" passHref legacyBehavior>
        <motion.button
            className="no-transition w-full sm:w-auto bg-white text-brand-green px-8 lg:px-10 py-4 lg:py-3.5 rounded-full text-base font-bold shadow-xl border border-brand-green/10"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
        >
            Our Process
        </motion.button>
    </Link>

    <Link href="/contact" passHref legacyBehavior>
        <motion.button
            className="no-transition w-full sm:w-auto bg-brand-green text-white px-8 lg:px-10 py-4 lg:py-3.5 rounded-full text-base font-bold shadow-xl"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
        >
            Partner With Us
        </motion.button>
    </Link>
</div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}
