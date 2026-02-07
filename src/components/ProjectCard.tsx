"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

interface ProjectProps {
    name: string;
    description: string;
    url: string;
    homepage?: string;
    language?: string;
    stars: number;
}

export default function ProjectCard({ project, index }: { project: ProjectProps, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
        >
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {project.name}
                    </h3>
                    <div className="flex gap-2">
                        {project.homepage && (
                            <a href={project.homepage} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                <ExternalLink size={18} />
                            </a>
                        )}
                        <a href={project.url} target="_blank" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
                            <Github size={18} />
                        </a>
                    </div>
                </div>

                <p className="text-slate-600 mb-6 flex-1 line-clamp-3">
                    {project.description}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500 mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        {project.language && (
                            <>
                                <span className="w-3 h-3 rounded-full bg-blue-500" />
                                {project.language}
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <span>★</span> {project.stars}
                    </div>
                </div>
            </div>
            {/* Decorative gradient line at bottom */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </motion.div>
    );
}
