"use client";

import { useEffect, useState } from "react";
import { ResumeData } from "@/components/ats/ResumePreview";
import Link from "next/link";
import { ArrowLeft, Github, Linkedin, Mail, ExternalLink, Calendar, MapPin, Briefcase, GraduationCap, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContributionGraph from "@/components/ContributionGraph";
import LeetCodePieChart from "@/components/LeetCodePieChart";

export default function PortfolioPreviewPage() {
    const [data, setData] = useState<ResumeData | null>(null);
    const [loading, setLoading] = useState(true);

    // State for external data
    const [githubUsername, setGithubUsername] = useState<string | null>(null);
    const [leetcodeUsername, setLeetcodeUsername] = useState<string | null>(null);
    const [githubData, setGithubData] = useState<any>(null);
    const [leetcodeData, setLeetcodeData] = useState<any>(null);

    useEffect(() => {
        const storedData = localStorage.getItem("portfolioData");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                setData(parsed);

                // Try to extract usernames from contact info
                // This is a naive heuristic for MVP
                if (parsed.personalInfo?.contact) {
                    const contact = parsed.personalInfo.contact.toLowerCase();

                    const githubMatch = contact.match(/github\.com\/([a-zA-Z0-9-]+)/);
                    if (githubMatch) setGithubUsername(githubMatch[1]);

                    const leetcodeMatch = contact.match(/leetcode\.com\/([a-zA-Z0-9-]+)/);
                    if (leetcodeMatch) setLeetcodeUsername(leetcodeMatch[1]);
                }
            } catch (e) {
                console.error("Failed to parse portfolio data", e);
            }
        }
        setLoading(false);
    }, []);

    // Fetch GitHub Data
    useEffect(() => {
        if (!githubUsername) return;
        fetch(`/api/github?username=${githubUsername}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) setGithubData(data);
            })
            .catch(err => console.error("GitHub fetch error:", err));
    }, [githubUsername]);

    // Fetch LeetCode Data
    useEffect(() => {
        if (!leetcodeUsername) return;
        fetch(`/api/leetcode?username=${leetcodeUsername}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) setLeetcodeData(data);
            })
            .catch(err => console.error("LeetCode fetch error:", err));
    }, [leetcodeUsername]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading portfolio...</div>;
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <p className="text-xl text-gray-600">No portfolio data found. Go back to ATS Scanner.</p>
                <Link href="/ats-check">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Scanner
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Navigation / Actions */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
                <Link href="/ats-check">
                    <Button variant="secondary" size="sm" className="shadow-md">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Edit Resume
                    </Button>
                </Link>
                <Button
                    size="sm"
                    className="shadow-lg bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white border-0 font-semibold"
                >
                    <span className="mr-2">✨</span>
                    🚀 Deploy Portfolio Website
                </Button>
            </div>

            {/* Hero Section */}
            <header className="bg-white border-b border-gray-200 py-20 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        {data.personalInfo.name}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {data.personalInfo.summary}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 pt-4">
                        {data.personalInfo.contact.split('|').map((item, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
                                {item.toLowerCase().includes('mail') ? <Mail className="w-3.5 h-3.5" /> :
                                    item.toLowerCase().includes('linkedin') ? <Linkedin className="w-3.5 h-3.5" /> :
                                        <MapPin className="w-3.5 h-3.5" />}
                                {item.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* GitHub */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Github className="w-6 h-6" />
                                GitHub Activity
                            </h2>
                            {githubUsername && <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">@{githubUsername}</span>}
                        </div>
                        <div className="flex justify-center overflow-x-auto pb-2">
                            {githubData ? (
                                <ContributionGraph weeks={githubData.weeks} />
                            ) : (
                                <div className="text-center text-gray-400 py-10 italic">
                                    {githubUsername ? "Loading GitHub data..." : "No GitHub username found in resume"}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* LeetCode */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Code className="w-6 h-6 text-orange-500" />
                                LeetCode Stats
                            </h2>
                            {leetcodeUsername && <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">Problem Solving</span>}
                        </div>
                        <div className="h-64 flex items-center justify-center">
                            {leetcodeData ? (
                                <LeetCodePieChart
                                    easySolved={leetcodeData.easySolved}
                                    mediumSolved={leetcodeData.mediumSolved}
                                    hardSolved={leetcodeData.hardSolved}
                                />
                            ) : (
                                <div className="text-center text-gray-400 italic">
                                    {leetcodeUsername ? "Loading LeetCode data..." : "No LeetCode username found in resume"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience & Education */}
            <section className="py-16 px-6 bg-white border-t border-gray-200">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-12">
                    {/* Experience (2 cols) */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-bold flex items-center gap-2 pb-4 border-b border-gray-100">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                            Work Experience
                        </h2>
                        <div className="space-y-12">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-8 border-l-2 border-gray-200">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-600"></div>
                                    <div className="mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                                        <div className="flex flex-wrap items-center gap-2 text-gray-600 mt-1">
                                            <span className="font-medium text-blue-600">{exp.company}</span>
                                            <span>•</span>
                                            <span className="text-sm bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {exp.date}
                                            </span>
                                        </div>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 text-gray-600 space-y-2 marker:text-gray-400">
                                        {exp.description.map((bullet, j) => (
                                            <li key={j}>{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Education & Skills */}
                    <div className="space-y-12">
                        {/* Education */}
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-gray-100 mb-6">
                                <GraduationCap className="w-5 h-5 text-purple-600" />
                                Education
                            </h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{edu.degree}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded w-fit">
                                            <Calendar className="w-3 h-3" />
                                            {edu.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-gray-100 mb-6">
                                <Code className="w-5 h-5 text-green-600" />
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 text-center">
                <p className="text-gray-500 text-sm">
                    Generated by AI Portfolio Builder. &copy; {new Date().getFullYear()} {data.personalInfo.name}
                </p>
            </footer>
        </div>
    );
}
