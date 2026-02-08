"use client";

import { Mail, Phone, MapPin, Linkedin, Calendar, Building, GraduationCap, Briefcase, Award } from "lucide-react";

export interface ResumeData {
    personalInfo: {
        name: string;
        contact: string;
        summary: string;
    };
    experience: {
        role: string;
        company: string;
        date: string;
        description: string[];
    }[];
    education: {
        degree: string;
        school: string;
        date: string;
        description: string;
    }[];
    skills: string[];
}

export function ResumePreview({ data }: { data: ResumeData }) {
    if (!data) return null;

    return (
        <div className="bg-white text-gray-900 min-h-full font-sans" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Modern Header with Gradient Accent */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-8">
                <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                    {data.personalInfo.name}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm mb-4 opacity-95">
                    {data.personalInfo.contact.split('|').map((item, i) => (
                        <span key={i} className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-md">
                            {item.toLowerCase().includes('mail') && <Mail className="w-3.5 h-3.5" />}
                            {item.toLowerCase().includes('phone') && <Phone className="w-3.5 h-3.5" />}
                            {item.toLowerCase().includes('linkedin') && <Linkedin className="w-3.5 h-3.5" />}
                            {!item.toLowerCase().includes('mail') && !item.toLowerCase().includes('phone') && !item.toLowerCase().includes('linkedin') && <MapPin className="w-3.5 h-3.5" />}
                            <span className="font-medium">{item.trim()}</span>
                        </span>
                    ))}
                </div>
                {data.personalInfo.summary && (
                    <p className="text-blue-50 leading-relaxed max-w-4xl text-base">
                        {data.personalInfo.summary}
                    </p>
                )}
            </header>

            <div className="px-10 py-8">
                {/* Professional Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-600">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                                Professional Experience
                            </h2>
                        </div>
                        <div className="space-y-8">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-8 border-l-4 border-blue-100 hover:border-blue-300 transition-colors">
                                    <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-white shadow-md"></div>
                                    <div className="mb-3">
                                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                            <h3 className="font-bold text-xl text-gray-900">{exp.role}</h3>
                                            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {exp.date}
                                            </span>
                                        </div>
                                        <div className="text-blue-600 font-semibold text-base flex items-center gap-2">
                                            <Building className="w-4 h-4" />
                                            {exp.company}
                                        </div>
                                    </div>
                                    <ul className="list-none space-y-2.5 text-gray-700">
                                        {exp.description.map((bullet, j) => (
                                            <li key={j} className="flex gap-3 leading-relaxed">
                                                <span className="text-blue-500 font-bold mt-1 flex-shrink-0">▸</span>
                                                <span className="text-sm">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-600">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                                Education
                            </h2>
                        </div>
                        <div className="space-y-5">
                            {data.education.map((edu, i) => (
                                <div key={i} className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{edu.school}</h3>
                                            <p className="text-gray-700 font-medium mt-1">{edu.degree}</p>
                                            {edu.description && <p className="text-sm text-gray-600 mt-2">{edu.description}</p>}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {edu.date}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-600">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                                Skills & Expertise
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {data.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-lg text-sm font-semibold border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
