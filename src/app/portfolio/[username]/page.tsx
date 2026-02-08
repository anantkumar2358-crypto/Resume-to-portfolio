import { getGitHubProfile, getGitHubRepos, getGitHubContributions } from "@/lib/github";
import { getLeetCodeStats, getCodeforcesStats } from "@/lib/coding-platforms";
import { enhanceProjectDescription, generateProfessionalSummary } from "@/lib/gemini";
import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink, Code, Briefcase, GraduationCap, Award } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ProjectCard from "@/components/ProjectCard";
import FadeIn from "@/components/FadeIn";
import LeetCodePieChart from "@/components/LeetCodePieChart";
import ContributionGraph from "@/components/ContributionGraph";

// This is a server component
import fs from "fs/promises";
import path from "path";

// Helper to get local resume data
async function getResumeData(username: string) {
    try {
        const dataDir = path.join(process.cwd(), "data");
        const filePath = path.join(dataDir, `${username}.json`);
        const fileContent = await fs.readFile(filePath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        return null;
    }
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    // 1. Fetch Data
    const profile = await getGitHubProfile(username);
    const repos = await getGitHubRepos(username);
    const resumeData = await getResumeData(username);

    // Fetch Coding Stats if usernames are available
    const leetCodeUser = resumeData?.leetCodeUser;
    const codeforcesUser = resumeData?.codeforcesUser;

    // Parallel fetch for speed
    const [leetCodeStats, codeforcesStats, contributionData] = await Promise.all([
        leetCodeUser ? getLeetCodeStats(leetCodeUser) : Promise.resolve(null),
        codeforcesUser ? getCodeforcesStats(codeforcesUser) : Promise.resolve(null),
        getGitHubContributions(username)
    ]);

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <h1>User not found or API rate limited.</h1>
            </div>
        );
    }

    // 2. AI Enhancement (Parallelize for performance)
    // In a real app, we'd cache this or use a loading state with streaming.
    // LIMIT: Processing top 4 repositories
    const topRepos = repos.slice(0, 4);
    const enhancedRepos = [];

    // Performance Optimization: Skipping AI enhancement for projects to speed up rendering
    // and avoid rate limits. We will use the original GitHub descriptions.
    for (const repo of topRepos) {
        enhancedRepos.push({
            ...repo,
            description: repo.description || "No description available."
        });
    }

    // Extract top languages from GitHub
    const githubLanguages = Array.from(new Set(repos.map(r => r.language).filter(l => l !== "Unknown")));

    // Combine with resume skills if available
    const resumeSkills = resumeData?.structuredData?.skills || [];
    const allSkills = Array.from(new Set([...githubLanguages, ...resumeSkills]));

    const professionalSummary = resumeData?.structuredData?.professionalSummary
        ? resumeData.structuredData.professionalSummary
        : await generateProfessionalSummary(profile.bio, allSkills);

    const experience = resumeData?.structuredData?.experience || [];
    const education = resumeData?.structuredData?.education || [];
    const certifications = resumeData?.structuredData?.certifications || [];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl tracking-tight text-slate-900">
                        {profile.name}
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href={profile.html_url} target="_blank" className="text-slate-500 hover:text-slate-900 transition-colors">
                            <Github size={20} />
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12">
                {/* Visual Polish: Animated Hero Section */}
                <HeroSection
                    name={profile.name}
                    headline={`Building navigation for digital experiences.`}
                    summary={professionalSummary}
                    avatarUrl={profile.avatar_url}
                    githubUrl={profile.html_url}
                    username={username}
                />

                {/* Skills Section */}
                <FadeIn delay={0.2} className="mb-24">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <Code className="text-blue-500" /> Technical Arsenal
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {allSkills.map((skill: string) => (
                            <div key={skill} className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-default hover:bg-slate-50">
                                <span className="font-medium text-slate-700">{skill}</span>
                            </div>
                        ))}
                        {allSkills.length === 0 && <span className="text-slate-500">No skills detected.</span>}
                    </div>
                </FadeIn>

                {/* Coding Profiles */}
                {(leetCodeStats || codeforcesStats) && (
                    <FadeIn delay={0.3} className="mb-8 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden relative">
                        {/* Background mesh/gradient for coding card */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />

                        <h3 className="text-xl font-bold text-white mb-6 relative z-10">Competitive Programming</h3>

                        <div className={`${leetCodeUser && leetCodeStats && leetCodeStats.totalSolved > 0 ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'flex flex-col gap-8'} relative z-10`}>
                            {/* Stats Section */}
                            <div className="flex flex-col gap-8">
                                {leetCodeStats && (
                                    <div className="flex gap-4 items-center">
                                        <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500">
                                            <Code size={24} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400 font-semibold uppercase">LeetCode</div>
                                            <div className="text-xl font-bold text-white">{leetCodeStats.totalSolved} Solved</div>
                                            {(leetCodeStats.contestRating || 0) > 0 && (
                                                <div className="text-sm text-yellow-400 font-mono">Rating: {Math.round(leetCodeStats.contestRating || 0)}</div>
                                            )}
                                            <div className="text-xs text-slate-500">Rank: {leetCodeStats.ranking.toLocaleString()}</div>
                                        </div>
                                    </div>
                                )}

                                {codeforcesStats && (
                                    <div className="flex gap-4 items-center">
                                        <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                                            <div className="w-6 h-6 flex items-center justify-center font-bold text-lg">CF</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400 font-semibold uppercase">Codeforces</div>
                                            <div className="text-xl font-bold text-white">{codeforcesStats.rating} <span className="text-sm font-normal text-slate-400">({codeforcesStats.rank})</span></div>
                                            <div className="text-xs text-slate-500">Max: {codeforcesStats.maxRating}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* LeetCode Pie Chart */}
                            {leetCodeUser && leetCodeStats && leetCodeStats.totalSolved > 0 && (
                                <div className="flex items-center justify-center">
                                    <LeetCodePieChart
                                        easySolved={leetCodeStats.easySolved}
                                        mediumSolved={leetCodeStats.mediumSolved}
                                        hardSolved={leetCodeStats.hardSolved}
                                    />
                                </div>
                            )}
                        </div>
                    </FadeIn>
                )}

                {/* Developer Stats & Connect */}
                <FadeIn delay={0.4} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

                    {/* Stats */}
                    <div className="flex gap-8 justify-center md:justify-start items-center relative z-10">
                        <div className="text-center group hover:-translate-y-1 transition-transform">
                            <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{profile.public_repos}</div>
                            <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Repos</div>
                        </div>
                        <div className="text-center group hover:-translate-y-1 transition-transform">
                            <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{profile.followers}</div>
                            <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Followers</div>
                        </div>
                        <div className="text-center group hover:-translate-y-1 transition-transform">
                            <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{profile.following}</div>
                            <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Following</div>
                        </div>
                    </div>

                    {/* Connect Info */}
                    <div className="flex flex-col gap-3 justify-center text-slate-300 relative z-10">
                        {profile.company && (
                            <div className="flex items-center gap-3">
                                <Briefcase size={16} className="text-slate-500" />
                                <span>{profile.company}</span>
                            </div>
                        )}
                        {profile.location && (
                            <div className="flex items-center gap-3">
                                <div className="w-4 flex justify-center text-slate-500">📍</div>
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile.email && (
                            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                                <Mail size={16} className="text-slate-500" />
                                <span>{profile.email}</span>
                            </a>
                        )}
                        {profile.blog && (
                            <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                                <ExternalLink size={16} className="text-slate-500" />
                                <span className="truncate max-w-[200px]">{profile.blog}</span>
                            </a>
                        )}
                        <a href={`https://linkedin.com/in/${username}`} target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                            <Linkedin size={16} className="text-slate-500" />
                            <span>Likely LinkedIn</span>
                        </a>
                    </div>
                </FadeIn>

                {/* GitHub Contribution Graph */}
                {contributionData && (
                    <FadeIn delay={0.45} className="mb-24">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Github className="text-blue-500" /> Contribution Activity
                        </h2>
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
                            <ContributionGraph weeks={contributionData} />
                        </div>
                    </FadeIn>
                )}

                {/* Experience Section */}
                {experience.length > 0 && (
                    <FadeIn delay={0.5} className="mb-24">
                        <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
                            <Briefcase className="text-blue-500" /> Professional Journey
                        </h2>
                        <div className="space-y-12 border-l-2 border-slate-200 ml-3 pl-8 relative">
                            {experience.map((exp: any, i: number) => (
                                <div key={i} className="relative">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-blue-500 shadow-sm" />

                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{exp.position}</h3>
                                                <div className="text-blue-600 font-medium">{exp.company}</div>
                                            </div>
                                            <div className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                                                {exp.duration}
                                            </div>
                                        </div>
                                        <div className="text-slate-600 leading-relaxed space-y-2">
                                            {/* Splitting description by robust logic or simplistic split */}
                                            {/* Assuming description is a block of text, splitting by newlines or periods for bullet points could be an enhancement */}
                                            <p>{exp.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                )}

                {/* Projects Section (Grid) */}
                <FadeIn delay={0.6} className="mb-24">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <Github className="text-blue-500" /> Featured Work
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {enhancedRepos.map((project: any, i: number) => (
                            <ProjectCard
                                key={project.name}
                                index={i}
                                project={{
                                    name: project.name,
                                    description: project.description,
                                    url: project.html_url,
                                    homepage: project.homepage,
                                    language: project.language,
                                    stars: project.stargazers_count,
                                    username: username
                                }}
                            />
                        ))}
                    </div>
                </FadeIn>

                {/* Certifications & Education */}
                <FadeIn delay={0.7} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Education */}
                    {education.length > 0 && (
                        <div>
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <GraduationCap className="text-blue-500" /> Education
                            </h2>
                            <div className="space-y-6">
                                {education.map((edu: any, i: number) => (
                                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-bold text-slate-900">{edu.institution}</h3>
                                        <div className="text-blue-600 font-medium mb-2">{edu.degree}</div>
                                        <div className="text-sm text-slate-500">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications.length > 0 && (
                        <div>
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Award className="text-blue-500" /> Certifications
                            </h2>
                            <div className="grid gap-4">
                                {certifications.map((cert: string, i: number) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 font-medium flex items-center gap-3 hover:bg-white hover:shadow-sm transition-all">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                        {cert}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </FadeIn>

                {/* Footer */}
                <footer className="mt-32 pt-8 border-t border-slate-200 text-center text-slate-500">
                    <p className="mb-2">Generated with <span className="text-blue-600 font-bold">Resume-to-Portfolio</span></p>
                    <p className="text-sm">Built with Next.js, Gemini AI & GitHub API</p>
                </footer>
            </main>
        </div>
    );
}
