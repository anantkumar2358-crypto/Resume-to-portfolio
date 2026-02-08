"use client";

import { Sparkles, Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="size-5 text-white" />
                            </div>
                            <span className="font-semibold text-xl text-white">Portfolio Gen</span>
                        </div>
                        <p className="text-slate-400 mb-6 max-w-md">
                            An autonomous AI-powered tool that transforms your resume and digital footprint
                            into a professional portfolio website. Built for developers, by developers.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="size-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                                <Github className="size-5" />
                            </a>
                            <a href="#" className="size-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                                <Linkedin className="size-5" />
                            </a>
                            <a href="#" className="size-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                                <Twitter className="size-5" />
                            </a>
                            <a href="#" className="size-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                                <Mail className="size-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                {/* Creators Section */}
                <div className="border-t border-slate-800 pt-8 mb-8">
                    <h4 className="text-white font-semibold mb-6 text-center">Created By</h4>
                    <div className="flex flex-wrap justify-center gap-8">
                        <CreatorCard
                            name="Your Name Here"
                            role="Full Stack Developer"
                            github="github.com/username"
                        />
                        <CreatorCard
                            name="Team Member 2"
                            role="AI/ML Engineer"
                            github="github.com/username2"
                        />
                        <CreatorCard
                            name="Team Member 3"
                            role="UI/UX Designer"
                            github="github.com/username3"
                        />
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-slate-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-sm">
                            © 2026 Portfolio Gen. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function CreatorCard({ name, role, github }: { name: string; role: string; github: string }) {
    return (
        <div className="bg-slate-800 rounded-lg p-4 w-64 hover:bg-slate-750 transition-colors">
            <div className="flex items-center gap-3 mb-2">
                <div className="size-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {name.charAt(0)}
                </div>
                <div>
                    <h5 className="text-white font-medium">{name}</h5>
                    <p className="text-slate-400 text-sm">{role}</p>
                </div>
            </div>
            <a
                href={`https://${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 text-sm hover:text-white transition-colors mt-3"
            >
                <Github className="size-4" />
                <span className="truncate">{github}</span>
            </a>
        </div>
    );
}
