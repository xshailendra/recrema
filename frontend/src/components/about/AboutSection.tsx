'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container, Button } from '../ui/core';
import { motion } from 'framer-motion';
import { Heart, Lightbulb, Users, Eye, Truck, Sparkles, Package, Leaf, Zap, Globe } from 'lucide-react';
import Image from 'next/image';

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
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring' as const, stiffness: 100, damping: 20 }
    }
};

// Wiggle hover animation - more dramatic
const wiggleHover = {
    scale: 1.05,
    rotate: [0, -2, 2, -2, 1, 0],
    y: -10,
    transition: {
        rotate: {
            duration: 0.5,
            ease: 'easeInOut' as const,
            repeat: 0
        },
        scale: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 12
        },
        y: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 15
        }
    }
};

// Tilt hover animation - deeper 3D effect
const tiltHover = {
    scale: 1.04,
    rotateY: 8,
    rotateX: -6,
    z: 50,
    transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15
    }
};

// Bounce hover animation - springier
const bounceHover = {
    y: -12,
    scale: 1.04,
    transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 8,
        mass: 0.8
    }
};

// Icon animation
const iconHover = {
    scale: 1.2,
    rotate: [0, -10, 10, 0],
    transition: {
        scale: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 10
        },
        rotate: {
            duration: 0.4,
            ease: 'easeInOut' as const
        }
    }
};

// Data
const beliefs = [
    {
        icon: Globe,
        title: 'Planet-positive Actions',
        description: 'Prioritizing our planet in every decision.',
        quote: '"There is no Planet B."'
    },
    {
        icon: Lightbulb,
        title: 'Trailblazing Innovations',
        description: 'Always finding wild new ways to upcycle.',
        quote: '"Sky is not the limit."'
    },
    {
        icon: Users,
        title: 'Community Building',
        description: 'Forging bonds that empower local economies.',
        quote: '"Together, We Build."'
    },
    {
        icon: Eye,
        title: 'Transparency',
        description: 'Sharing our impact through annual reports and open facility tours.',
        quote: '"Honesty is the best policy."'
    },
];

const whatWeDo = [
    {
        icon: Sparkles,
        title: 'Upcycle Coffee Grounds',
        description: 'Transforming spent coffee grounds into valuable components for cosmetics, pharmaceuticals, nutraceuticals, energy and agriculture industries.'
    },
    {
        icon: Heart,
        title: 'Empower Communities',
        description: 'Helping local farmers and community members by educating them about sustainability practices and spreading awareness about upcycling coffee.'
    },
];

const howWeDo = [
    {
        icon: Truck,
        title: 'Easy Pickups',
        description: 'Whether you\'re running a bustling café or just brewing at home, we handle the collection – no fuss, just drop-offs or scheduled swoops.'
    },
    {
        icon: Zap,
        title: 'Innovative Transformations',
        description: 'Using patented extraction process, we extract cosmetic-grade coffee oil, pharma-grade caffeine, natural antioxidants, exfoliating scrubs, nutrient-packed organic fertilizers and clean biofuels.'
    },
    {
        icon: Package,
        title: 'Seamless Delivery',
        description: 'Our upcycled extracts help in enriching soils, powering green manufacturing, inspiring home gardening stories and empowering communities.'
    },
];

const founders = [
    {
        name: 'Manoj Parmar',
        role: 'Founder',
        description: 'The founding leader behind the idea, managing the company efficiently.',
        image: '/images/profile-1.jpeg'
    },
    {
        name: 'Dinesh Kumar Soni',
        role: 'Operations Director, Co-Founder',
        description: 'Co-founder and logistics whiz ensuring smooth collections and processing.',
        image: '/images/profile-2.png'
    },
];

export function AboutSection() {
    return (
        <section id="about" className="py-24 md:py-32 bg-gradient-to-b from-white to-brand-peach/20">
            <Container>
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                >
                    <span className="inline-block px-4 py-1.5 bg-brand-green/10 rounded-full text-brand-green text-sm font-semibold mb-4">
                        About Us
                    </span>
                    <h2 className="text-4xl ss:text-7xl md:text-8xl font-display text-brand-green uppercase leading-tight">
                        Our Story
                    </h2>
                </motion.div>

                {/* Who We Are */}
                <motion.div
                    className="mb-24"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    <motion.h3
                        className="text-2xl md:text-5xl font-display text-brand-green uppercase mb-8"
                        variants={fadeInUp}
                    >
                        Who We Are
                    </motion.h3>

                    <motion.div
                        className="bg-white rounded-3xl p-5 ss:p-8 md:p-12 shadow-xl border border-brand-green/10 mb-12"
                        variants={cardVariants}
                    >
                        <div className="prose prose-lg max-w-none">
                            <p className="text-brand-green/80 text-lg md:text-xl leading-relaxed mb-6">
                                We are a highly conscious team dedicated to reducing waste and promoting sustainability.
                                Initiating circular economy in the coffee industry has made our intentions clearer and belief stronger.
                            </p>
                            <p className="text-brand-green/80 text-lg md:text-xl leading-relaxed mb-6">
                                Starting as a small idea &amp; late-night brainstorming sessions, we&apos;ve grown into a trustworthy
                                company as a one-stop solution for upcycling coffee.
                            </p>
                            <p className="text-brand-green font-semibold text-xl md:text-2xl">
                                Our mission is to make coffee recycling accessible, efficient and rewarding.
                            </p>
                        </div>
                    </motion.div>

                    {/* Beliefs Grid */}
                    <motion.h4
                        className="text-xl font-semibold text-brand-green mb-6"
                        variants={fadeInUp}
                    >
                        We believe in:
                    </motion.h4>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={staggerContainer}
                    >
                        {beliefs.map((belief) => (
                            <motion.div
                                key={belief.title}
                                className="group bg-white rounded-2xl p-6 shadow-lg border border-brand-green/10 hover:shadow-2xl hover:border-brand-green/30 transition-all duration-300 cursor-pointer"
                                variants={cardVariants}
                                whileHover={wiggleHover}
                            >
                                <motion.div
                                    className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:shadow-lg transition-all duration-300"
                                    whileHover={iconHover}
                                >
                                    <belief.icon className="w-6 h-6 text-brand-green group-hover:text-white transition-colors" />
                                </motion.div>
                                <h5 className="font-bold text-brand-green text-lg mb-2 group-hover:translate-x-1 transition-transform">{belief.title}</h5>
                                <p className="text-brand-green/70 text-sm mb-3">{belief.description}</p>
                                <p className="text-brand-green/90 text-sm italic font-medium">{belief.quote}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.p
                        className="mt-8 text-brand-green/80 text-center text-lg font-medium"
                        variants={fadeInUp}
                    >
                        We&apos;re always committed to ethical practices, discipline, responsible sourcing and zero greenwashing.
                    </motion.p>
                </motion.div>

                {/* What We Do */}
                <motion.div
                    className="mb-24"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    <motion.h3
                        className="text-2xl md:text-5xl font-display text-brand-green uppercase mb-8"
                        variants={fadeInUp}
                    >
                        What We Do
                    </motion.h3>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        variants={staggerContainer}
                    >
                        {whatWeDo.map((item) => (
                            <motion.div
                                key={item.title}
                                className="group relative bg-gradient-to-br from-brand-green to-brand-green/90 rounded-3xl p-8 md:p-10 text-white overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-brand-green/30 transition-shadow duration-300"
                                variants={cardVariants}
                                whileHover={tiltHover}
                                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                            >
                                <motion.div
                                    className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"
                                />
                                <div className="relative z-10">
                                    <motion.div
                                        className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors duration-300"
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                    >
                                        <item.icon className="w-7 h-7 text-white" />
                                    </motion.div>
                                    <h4 className="font-display text-2xl uppercase mb-4 group-hover:translate-x-1 transition-transform">{item.title}</h4>
                                    <p className="text-white/90 text-lg leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* How We Do */}
                <motion.div
                    className="mb-24"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    <motion.h3
                        className="text-2xl md:text-5xl font-display text-brand-green uppercase mb-8"
                        variants={fadeInUp}
                    >
                        How We Do It
                    </motion.h3>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        variants={staggerContainer}
                    >
                        {howWeDo.map((item) => (
                            <motion.div
                                key={item.title}
                                className="group bg-brand-peach/50 rounded-3xl p-8 border border-brand-green/10 hover:bg-brand-peach hover:border-brand-green/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                variants={cardVariants}
                                whileHover={bounceHover}
                            >
                                <motion.div
                                    className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-brand-green/30 transition-shadow duration-300"
                                    whileHover={{ scale: 1.15, rotate: -5 }}
                                >
                                    <item.icon className="w-6 h-6 text-white" />
                                </motion.div>
                                <h4 className="font-bold text-brand-green text-xl mb-3 group-hover:translate-x-1 transition-transform">{item.title}</h4>
                                <p className="text-brand-green/75 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-10 bg-brand-green/5 rounded-2xl p-6 md:p-8 border border-brand-green/10"
                        variants={fadeInUp}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center flex-shrink-0">
                                <Leaf className="w-6 h-6 text-brand-green" />
                            </div>
                            <p className="text-brand-green text-lg">
                                <span className="font-bold">Our Goal:</span> Process 100 kilograms of spent coffee grounds daily,
                                slashing carbon emissions equivalent to driving an SUV for roughly 18 months straight –
                                then strategically increase our capacity.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* The Visionaries */}
                <motion.div
                    className="mb-24"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    <motion.h3
                        className="text-2xl md:text-5xl font-display text-brand-green uppercase mb-8 text-center"
                        variants={fadeInUp}
                    >
                        The Visionaries
                    </motion.h3>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                        variants={staggerContainer}
                    >
                        {founders.map((founder) => (
                            <motion.div
                                key={founder.name}
                                className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-brand-green/10 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                variants={cardVariants}
                                whileHover={wiggleHover}
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-brand-peach to-brand-yellow/30 relative overflow-hidden">
                                    <Image
                                        src={founder.image}
                                        alt={founder.name}
                                        fill
                                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 md:p-8">
                                    <span className="inline-block px-3 py-1 bg-brand-green/10 rounded-full text-brand-green text-sm font-medium mb-3">
                                        {founder.role}
                                    </span>
                                    <h4 className="font-display text-2xl text-brand-green uppercase mb-2">{founder.name}</h4>
                                    <p className="text-brand-green/70 leading-relaxed">{founder.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Get Involved CTA */}
                <motion.div
                    className="text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerContainer}
                >
                    <motion.div
                        className="bg-gradient-to-r from-brand-green via-brand-green to-brand-green/90 rounded-3xl p-6 ss:p-10 md:p-16 text-white relative overflow-hidden"
                        variants={cardVariants}
                    >
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <h3 className="text-2xl ss:text-3xl md:text-5xl font-display uppercase mb-4">
                                Get Involved
                            </h3>
                            <p className="text-xl md:text-2xl text-white/90 mb-2">Every Cup Counts!</p>
                            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                                Are you a café owner, a coffee chain, or a coffee lover ready to make an impact?
                                Recrema is your buddy. Sign up to make a difference right now and know more about
                                our operations and services.
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                className="bg-brand-yellow text-brand-green hover:bg-white font-bold"
                            >
                                <Link href="/contact">
                                    Partner With Us
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.p
                        className="mt-12 text-2xl md:text-3xl font-display text-brand-green"
                        variants={fadeInUp}
                    >
                        Recrema – Sustainably Beautiful
                    </motion.p>
                </motion.div>
            </Container>
        </section>
    );
}
