"use client";

import { motion } from "motion/react";
import { CheckCircle, AlertTriangle, Lightbulb, FileText, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectAnalysisProps {
    quality: {
        score: number;
        summary: string;
        strengths: string[];
        weaknesses: string[];
        improvements: string[];
    } | null;
    documentation: string;
}

export default function ProjectAnalysis({ quality, documentation }: ProjectAnalysisProps) {
    if (!quality) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBarColor = (score: number) => {
        if (score >= 80) return "bg-green-600";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-600";
    };

    return (
        <div className="space-y-8">
            {/* Quality Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="border-slate-200 shadow-md overflow-hidden">
                    <div className={`h-1 w-full ${getScoreBarColor(quality.score)}`} />
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Code className="size-5 text-blue-500" />
                                Code Quality Analysis
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-sm font-medium">Score:</span>
                                <span className={`text-3xl font-bold ${getScoreColor(quality.score)}`}>
                                    {quality.score}
                                </span>
                            </div>
                        </div>
                        <Progress value={quality.score} className="h-2 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-slate-600 leading-relaxed">
                            {quality.summary}
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Strengths */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-green-700 flex items-center gap-2">
                                    <CheckCircle className="size-4" /> Strengths
                                </h4>
                                <ul className="space-y-2">
                                    {quality.strengths.map((item, i) => (
                                        <li key={i} className="text-sm text-slate-600 bg-green-50 p-2 rounded border border-green-100">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Weaknesses */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-amber-700 flex items-center gap-2">
                                    <AlertTriangle className="size-4" /> Areas for Review
                                </h4>
                                <ul className="space-y-2">
                                    {quality.weaknesses.length > 0 ? (
                                        quality.weaknesses.map((item, i) => (
                                            <li key={i} className="text-sm text-slate-600 bg-amber-50 p-2 rounded border border-amber-100">
                                                {item}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-slate-400 italic">No major issues found.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Improvements */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                                    <Lightbulb className="size-4" /> Suggestions
                                </h4>
                                <ul className="space-y-2">
                                    {quality.improvements.map((item, i) => (
                                        <li key={i} className="text-sm text-slate-600 bg-blue-50 p-2 rounded border border-blue-100">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Auto Docs Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="border-slate-200 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <FileText className="size-5 text-purple-500" />
                            Generated Documentation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-slate-800 prose-h3:text-slate-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            {/* Rendering markdown would require a library like react-markdown, 
                                but for now we will just display whitespace-pre-wrap to respect structure if markdown parser isn't available.
                                Ideally, we should install react-markdown. For this iteration, simple whitespace handling. */}
                            <pre className="whitespace-pre-wrap font-sans text-sm">{documentation}</pre>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
