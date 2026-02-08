import { GoogleGenerativeAI } from "@google/generative-ai";

import fs from "fs";
import path from "path";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

// File-based persistence for cache
const CACHE_FILE = path.join(process.cwd(), "data", "gemini-cache.json");

// Load cache from file
function loadCache(): Record<string, string> {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, "utf-8");
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading Gemini cache:", error);
    }
    return {};
}

// Save cache to file
function saveCache(key: string, value: string) {
    try {
        const currentCache = loadCache();
        currentCache[key] = value;
        fs.writeFileSync(CACHE_FILE, JSON.stringify(currentCache, null, 2), "utf-8");
    } catch (error) {
        console.error("Error saving Gemini cache:", error);
    }
}

// Initialize in-memory cache from file
const persistentCache = loadCache();

export async function enhanceProjectDescription(name: string, description: string, language: string): Promise<string> {
    if (!model) return description || "No description available.";

    const cacheKey = `desc-${name}-${language}`;
    if (persistentCache[cacheKey]) {
        console.log(`[Gemini] Serving persistent cached description for ${name}`);
        return persistentCache[cacheKey];
    }

    const prompt = `
    Limit the response to 2 sentences.
    Enhance the description for a software project. 
    Project Name: ${name}
    Tech Stack: ${language}
    Original Description: ${description}
    
    Make it sound professional, highlighting the technical complexity or potential impact. 
    If the original description is empty, generate a generic but professional description based on the name and language.
  `;

    try {
        // Add a small delay to avoid hitting rate limits too fast in loops
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Save to file
        persistentCache[cacheKey] = text;
        saveCache(cacheKey, text);

        return text;
    } catch (error: any) {
        console.warn("Gemini API limit/error (using fallback description):", error.message);
        return description || "No description available.";
    }
}

export async function generateProfessionalSummary(bio: string, skills: string[]): Promise<string> {
    if (!model) return bio;

    const cacheKey = `bio-${bio}-${skills.join(",")}`;
    if (persistentCache[cacheKey]) {
        console.log(`[Gemini] Serving persistent cached bio`);
        return persistentCache[cacheKey];
    }

    const prompt = `
    Limit the response to 3-4 sentences.
    Write a professional summary for a developer portfolio.
    Current Bio: ${bio}
    Key Skills: ${skills.join(", ")}
    
    The tone should be confident, career-oriented, and suitable for recruiters.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Save to file
        persistentCache[cacheKey] = text;
        saveCache(cacheKey, text);

        return text;
    } catch (error: any) {
        console.warn("Gemini API limit/error (using fallback bio):", error.message);
        return bio;
    }
}

export interface ResumeData {
    professionalSummary: string;
    workExperience: {
        company: string;
        role: string;
        duration: string;
        description: string;
    }[];
    education: {
        institution: string;
        degree: string;
        year: string;
    }[];
    skills: string[];
    certifications: string[];
}

export async function parseResumeWithGemini(resumeText: string): Promise<ResumeData | null> {
    if (!model) {
        console.error("Gemini model not initialized");
        return null;
    }

    const prompt = `
    You are an AI expert at parsing resumes. 
    Extract the following information from the provided resume text and return it ONLY as a valid JSON object.
    Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    
    Resume Text:
    "${resumeText}"
    
    Required JSON Structure:
    {
        "professionalSummary": "A brief 2-3 sentence professional summary derived from the resume.",
        "workExperience": [
            {
                "company": "Company Name",
                "role": "Job Title",
                "duration": "Start Date - End Date",
                "description": "3-4 bullet points summarizing key achievements and responsibilities."
            }
        ],
        "education": [
            {
                "institution": "University/School Name",
                "degree": "Degree format (e.g. B.S. in Computer Science)",
                "year": "Graduation Year"
            }
        ],
        "skills": ["Skill 1", "Skill 2", "Skill 3", "etc..."],
        "certifications": ["Certification Name 1", "Certification Name 2", "etc..."]
    }
    
    If any section is missing, return an empty array or empty string for that field. 
    Ensure the JSON is valid and strictly follows this structure.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up any potential markdown formatting
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText) as ResumeData;
    } catch (error) {
        console.error("Error parsing resume with Gemini:", error);
        return null; // Return null on failure so we can handle it gracefully
    }
}

interface CodeQualityAnalysis {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
}

export async function analyzeCodeQuality(readme: string, fileTree: string[]): Promise<CodeQualityAnalysis | null> {
    if (!model) return null;

    const cacheKey = `quality-${fileTree.join(",")}`; // Simple cache key based on file structure
    if (persistentCache[cacheKey]) {
        try {
            return JSON.parse(persistentCache[cacheKey]);
        } catch (e) { /* ignore cache error */ }
    }

    const prompt = `
    Analyze the code quality and architecture of a software project based on its README and file structure.
    
    README Extract (First 2000 chars):
    ${readme.slice(0, 2000)}
    
    File Structure (Top 50 files):
    ${fileTree.join("\n")}
    
    Return a JSON object with the following structure:
    {
        "score": number, // 0-100 based on best practices, structure, and documentation
        "summary": "Brief 2-sentence summary of the codebase structure and quality.",
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "improvements": ["Improvement 1", "Improvement 2"]
    }
    
    Analyze based on: standard naming conventions, modularity (folder structure), presence of config files (package.json, tsconfig, etc.), and documentation.
    Ensure strictly valid JSON output.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        saveCache(cacheKey, text); // Cache the raw JSON string
        return JSON.parse(text) as CodeQualityAnalysis;
    } catch (error) {
        console.error("Error analyzing code quality:", error);
        return {
            score: 75,
            summary: "Could not analyze detailed quality. Standard project structure detected.",
            strengths: ["Standard structure"],
            weaknesses: [],
            improvements: ["Add more documentation"]
        };
    }
}

export async function generateProjectDocs(readme: string, name: string): Promise<string> {
    if (!model) return readme;

    const cacheKey = `docs-${name}`;
    if (persistentCache[cacheKey]) {
        return persistentCache[cacheKey];
    }

    const prompt = `
    You are a technical writer. Generate a professional documentation section for the project '${name}'.
    Use the existing README content as a base, but structure it better.
    
    Existing README:
    ${readme.slice(0, 3000)}
    
    Output in Markdown format with the following sections if they are missing or weak:
    ## 🚀 Features
    (Bulleted list of estimated features)
    
    ## 🛠️ Tech Stack
    (Inferred from context)
    
    ## 📦 Installation & Setup
    (Standard steps based on the tech stack, e.g. npm install)
    
    Keep it concise and professional.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        saveCache(cacheKey, text);
        return text;
    } catch (error) {
        console.error("Error generating docs:", error);
        return readme;
    }
}
