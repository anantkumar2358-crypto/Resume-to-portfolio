import { NextRequest, NextResponse } from "next/server";
import { parseResume } from "@/lib/resume";
import Groq from "groq-sdk";

// Force Node.js runtime (pdf2json requires Node.js APIs)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

export async function POST(req: NextRequest) {
    try {
        console.log("[ATS] Starting ATS scan...");

        const formData = await req.formData();
        const file = formData.get("resume") as File;
        const jobDescription = formData.get("jobDescription") as string;

        console.log("[ATS] File received:", file?.name, "Size:", file?.size);

        if (!file) {
            console.error("[ATS] No file provided");
            return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
        }

        if (!groq) {
            console.error("[ATS] Groq API key not configured");
            return NextResponse.json({ error: "Groq API key not configured. Please add GROQ_API_KEY to your .env.local file." }, { status: 500 });
        }

        // Parse PDF
        console.log("[ATS] Converting file to buffer...");
        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("[ATS] Buffer created, size:", buffer.length);

        let resumeText = "";
        try {
            console.log("[ATS] Parsing PDF...");
            resumeText = await parseResume(buffer);
            console.log("[ATS] PDF parsed, text length:", resumeText.length);
        } catch (error: any) {
            console.error("[ATS] PDF Parse Error:", error);
            console.error("[ATS] Error stack:", error.stack);
            return NextResponse.json({
                error: "Failed to parse PDF. Please ensure it's a valid PDF file.",
                details: error.message
            }, { status: 500 });
        }

        if (!resumeText || resumeText.length < 50) {
            console.error("[ATS] Insufficient text extracted:", resumeText.length, "chars");
            return NextResponse.json({
                error: "Could not extract sufficient text from resume. The PDF might be image-based or corrupted."
            }, { status: 400 });
        }

        // Analyze with Groq
        console.log("[ATS] Sending to Groq for analysis...");
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an expert ATS (Applicant Tracking System) scanner and career coach. Always respond with valid JSON only, no markdown formatting."
                },
                {
                    role: "user",
                    content: `Analyze the following resume against the provided job description (or general industry standards if JD is empty).

Resume Text:
"${resumeText.slice(0, 10000)}"

Job Description:
"${jobDescription || "General Software Engineering Role"}"

Return a JSON object with the following structure:
{
    "score": number, // 0-100 score based on keyword matching and formatting
    "missingKeywords": string[], // List of important keywords missing from the resume
    "feedback": string[], // List of 3-5 actionable improvements
    "summary": "Brief summary of the analysis"
}

Ensure the response is valid JSON. Do not include markdown formatting.`
                }
            ],
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0]?.message?.content || "{}";
        console.log("[ATS] Groq response received, length:", text.length);

        try {
            const data = JSON.parse(text);
            console.log("[ATS] Successfully parsed JSON response");
            return NextResponse.json({ ...data, extractedText: resumeText });
        } catch (jsonError: any) {
            console.error("[ATS] JSON Parse Error:", jsonError);
            console.log("[ATS] Raw Text:", text.substring(0, 500));
            return NextResponse.json({
                score: 50,
                missingKeywords: ["Error parsing AI response"],
                feedback: ["Please try again. The AI response was not in the expected format."],
                summary: "Analysis partially completed but formatting failed."
            });
        }

    } catch (error: any) {
        console.error("[ATS] Unexpected Error:", error);
        console.error("[ATS] Error stack:", error.stack);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message,
            type: error.constructor.name
        }, { status: 500 });
    }
}

