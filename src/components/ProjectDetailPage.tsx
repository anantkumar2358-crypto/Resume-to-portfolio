"use client";

import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, Calendar, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectAnalysis from "@/components/ProjectAnalysis";

// Props passed from server component
interface ProjectDetailProps {
    username: string;
    repoName: string;
    repoData: any;
    readmeContent: string;
    qualityAnalysis: any;
    generatedDocs: string;
}

export default function ProjectDetailPage({
    username,
    repoName,
    repoData,
    readmeContent,
    qualityAnalysis,
    generatedDocs
}: ProjectDetailProps) {

    if (!repoData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold text-slate-800">Project not found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href={`/portfolio/${username}`}>
                        <Button variant="ghost" className="text-slate-600 gap-2">
                            <ArrowLeft size={16} /> Back to Portfolio
                        </Button>
                    </Link>
                    <div className="font-semibold text-slate-800">
                        {username} / <span className="text-blue-600">{repoName}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                {/* Hero Section */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">{repoData.name}</h1>
                            <p className="text-xl text-slate-600 max-w-3xl">
                                {repoData.description || "No description provided."}
                            </p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            {repoData.homepage && (
                                <Link href={repoData.homepage} target="_blank">
                                    <Button variant="outline" className="gap-2">
                                        <ExternalLink size={16} /> Demo
                                    </Button>
                                </Link>
                            )}
                            <Link href={repoData.html_url} target="_blank">
                                <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                    <Github size={16} /> View Code
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        {repoData.language && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                {repoData.language}
                            </Badge>
                        )}
                        <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <span className="font-medium text-slate-700">{repoData.stargazers_count}</span> stars
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={16} className="text-slate-400" />
                            Updated {new Date(repoData.updated_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Analysis Section */}
                <ProjectAnalysis
                    quality={qualityAnalysis}
                    documentation={generatedDocs}
                />
            </main>
        </div>
    );
}
