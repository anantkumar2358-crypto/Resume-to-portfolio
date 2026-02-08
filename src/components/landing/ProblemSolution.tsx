"use client";

import { AlertCircle, Target, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

export function ProblemSolution() {
    return (
        <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Problem Statement */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50"
                    >
                        <div className="size-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                            <AlertCircle className="size-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900">Problem Statement</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Students struggle to convert raw achievements into professional portfolios that attract recruiters.
                        </p>
                    </motion.div>

                    {/* The Challenge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50"
                    >
                        <div className="size-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                            <Target className="size-6 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900">The Challenge</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Automatically generate a polished portfolio website from a developer's digital footprint.
                        </p>
                    </motion.div>

                    {/* Solution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-lg text-white"
                    >
                        <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                            <Lightbulb className="size-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Solution</h3>
                        <p className="text-white/90 leading-relaxed">
                            An AI agent that scans GitHub, LinkedIn, and projects and creates a professional storytelling portfolio.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
