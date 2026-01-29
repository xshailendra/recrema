'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container, Button } from '@/components/ui/core';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Building2, User, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';

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

const inputHover = {
    scale: 1.01,
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 }
};

export function ContactForm() {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        partnerType: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("https://formsubmit.co/ajax/support@recrema.in", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    _subject: "New Partnership Inquiry from Recrema",
                })
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                console.error("Form submission failed");
                alert("Something went wrong. Please try again or contact us directly via email.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error connecting to the server. Please check your internet connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (isSubmitted) {
        return (
            <section className="min-h-screen py-32 bg-gradient-to-b from-white to-brand-peach/20">
                <Container>
                    <motion.div
                        className="max-w-2xl mx-auto text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring' as const, stiffness: 100, damping: 15 }}
                    >
                        <motion.div
                            className="w-24 h-24 mx-auto mb-8 rounded-full bg-brand-green/10 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <CheckCircle className="w-12 h-12 text-brand-green" />
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-display text-brand-green uppercase mb-6">
                            Thank You!
                        </h2>
                        <p className="text-brand-green/70 text-lg mb-8">
                            We&apos;ve received your message and will get back to you within 24-48 hours.
                            Together, let&apos;s make coffee recycling a reality!
                        </p>
                        <Link href="/">
                            <Button variant="primary" size="lg" className="bg-brand-green text-white hover:bg-brand-green/90">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </motion.div>
                </Container>
            </section>
        );
    }

    return (
        <section className="min-h-screen py-32 bg-gradient-to-b from-white to-brand-peach/20">
            <Container>
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {/* Header */}
                    <motion.div className="text-center mb-16" variants={fadeInUp}>
                        <span className="inline-block px-4 py-1.5 bg-brand-green/10 rounded-full text-brand-green text-sm font-semibold mb-4">
                            Get In Touch
                        </span>
                        <h1 className="text-4xl ss:text-5xl md:text-7xl font-display text-brand-green uppercase mb-4">
                            Partner With Us
                        </h1>
                        <p className="text-brand-green/70 text-lg max-w-2xl mx-auto">
                            Ready to make an impact? Whether you&apos;re a café owner, coffee chain, or sustainability enthusiast,
                            we&apos;d love to hear from you.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Contact Info */}
                        <motion.div
                            className="lg:col-span-2 space-y-8"
                            variants={fadeInUp}
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-brand-green/10">
                                <h3 className="font-display text-2xl text-brand-green uppercase mb-6">Contact Info</h3>

                                <div className="space-y-6">
                                    <motion.div
                                        className="flex items-start gap-4 group cursor-pointer"
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center group-hover:bg-brand-green group-hover:shadow-lg transition-all duration-300">
                                            <Mail className="w-5 h-5 text-brand-green group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-brand-green/50 uppercase tracking-wide mb-1">Email</p>
                                            <a href="mailto:support@recrema.in" className="text-brand-green font-medium hover:underline">
                                                support@recrema.in
                                            </a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="flex items-start gap-4 group cursor-pointer"
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center group-hover:bg-brand-green group-hover:shadow-lg transition-all duration-300">
                                            <Phone className="w-5 h-5 text-brand-green group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-brand-green/50 uppercase tracking-wide mb-1">Whatsapp</p>
                                            <span className="text-brand-green font-medium">+91 9649154803, 7073425362</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="flex items-start gap-4 group cursor-pointer"
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center group-hover:bg-brand-green group-hover:shadow-lg transition-all duration-300">
                                            <MapPin className="w-5 h-5 text-brand-green group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-brand-green/50 uppercase tracking-wide mb-1">Location</p>
                                            <span className="text-brand-green font-medium">Sanchore, Rajasthan, India</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Partner Types */}
                            <motion.div
                                className="bg-gradient-to-br from-brand-green to-brand-green/90 rounded-3xl p-5 ss:p-8 text-white"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                            >
                                <h3 className="font-display text-xl uppercase mb-4">We Partner With</h3>
                                <ul className="space-y-3">
                                    {['Cafés & Coffee Shops', 'Restaurant Chains', 'Hotels & Resorts', 'Corporate Offices', 'Home Coffee Enthusiasts'].map((item) => (
                                        <li key={item} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-brand-yellow" />
                                            <span className="text-white/90">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            className="lg:col-span-3"
                            variants={fadeInUp}
                        >
                            <form action="https://formsubmit.co/support@recrema.in" onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 ss:p-8 md:p-10 shadow-xl border border-brand-green/10" method='POST'>
                                <h3 className="font-display text-2xl text-brand-green uppercase mb-8">Send Us a Message</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <motion.div whileHover={inputHover}>
                                        <label className="block text-sm font-medium text-brand-green/70 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-brand-green/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-brand-peach/10"
                                            placeholder="Your name"
                                        />
                                    </motion.div>

                                    <motion.div whileHover={inputHover}>
                                        <label className="block text-sm font-medium text-brand-green/70 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-brand-green/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-brand-peach/10"
                                            placeholder="you@example.com"
                                        />
                                    </motion.div>

                                    <motion.div whileHover={inputHover}>
                                        <label className="block text-sm font-medium text-brand-green/70 mb-2">
                                            <Building2 className="w-4 h-4 inline mr-2" />
                                            Company/Organization
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-brand-green/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-brand-peach/10"
                                            placeholder="Your company name"
                                        />
                                    </motion.div>

                                    <motion.div whileHover={inputHover}>
                                        <label className="block text-sm font-medium text-brand-green/70 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-brand-green/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-brand-peach/10"
                                            placeholder="+91 XXXXXXXXXX"
                                        />
                                    </motion.div>
                                </div>

                                <motion.div className="mb-6" whileHover={inputHover}>
                                    <label className="block text-sm font-medium text-brand-green/70 mb-2">
                                        Partnership Type *
                                    </label>
                                    <select
                                        name="partnerType"
                                        required
                                        value={formData.partnerType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-brand-green/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-brand-peach/10 text-brand-green"
                                    >
                                        <option value="">Select partnership type</option>
                                        <option value="cafe">Café / Coffee Chains</option>
                                        <option value="restaurant">Restaurant Chain</option>
                                        <option value="hotel">Hotel / Resort</option>
                                        <option value="corporate">Corporate Office</option>
                                        <option value="individual">Individual / Home</option>
                                        <option value="other">Other</option>
                                    </select>
                                </motion.div>

                                <motion.div className="mb-8" whileHover={inputHover}>
                                    <label className="block text-sm font-medium text-brand-green/70 mb-2">
                                        <MessageSquare className="w-4 h-4 inline mr-2" />
                                        Your Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-brand-green/20 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-brand-peach/10 resize-none"
                                        placeholder="Tell us about your interest in partnering with Recrema..."
                                    />
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-8 bg-brand-green text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-brand-green/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(34, 139, 34, 0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}
