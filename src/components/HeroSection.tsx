"use client";

import { motion } from "framer-motion";
import { Github, Mail } from "lucide-react";

interface HeroProps {
    name: string;
    headline: string;
    summary: string;
    avatarUrl: string;
    githubUrl: string;
    username: string;
}

export default function HeroSection({ name, headline, summary, avatarUrl, githubUrl, username }: HeroProps) {
    return (
        <section className="flex flex-col md:flex-row gap-12 items-center mb-24 relative">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />

            <div className="flex-1 space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                    Software Developer
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight"
                >
                    Building navigation for <span className="text-blue-600">digital experiences</span>.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-slate-600 leading-relaxed max-w-2xl"
                >
                    {summary}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex gap-4 pt-4"
                >
                    <a href={`mailto:?subject=Contact from Portfolio`} className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center gap-2 hover:-translate-y-1 shadow-lg hover:shadow-slate-900/20">
                        <Mail size={18} /> Contact Me
                    </a>
                    <a href={githubUrl} target="_blank" className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-all flex items-center gap-2 hover:-translate-y-1 shadow-sm hover:shadow-md">
                        <Github size={18} /> GitHub
                    </a>
                    <a href={`/resumes/${username}.pdf`} download className="px-6 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-all flex items-center gap-2 hover:-translate-y-1 shadow-sm hover:shadow-emerald-100">
                        <span className="opacity-70">📄</span> Resume
                    </a>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-48 h-48 md:w-80 md:h-80 relative shrink-0"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover rounded-2xl shadow-2xl hover:rotate-0 transition-transform duration-500 border-4 border-white"
                />
            </motion.div>
        </section>
    );
}
