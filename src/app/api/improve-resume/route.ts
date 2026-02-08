import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

export async function POST(req: NextRequest) {
    try {
        console.log("[IMPROVE] Starting resume improvement...");

        const { resumeText, feedback, missingKeywords, jobDescription } = await req.json();

        if (!resumeText) {
            return NextResponse.json({ error: "Resume text is required" }, { status: 400 });
        }

        if (!groq) {
            console.error("[IMPROVE] Groq API key not configured");
            return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
        }

        console.log("[IMPROVE] Generating improved resume...");

        // Sanitize resume text to remove non-printable characters or excessive whitespace
        const cleanResumeText = resumeText
            .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable ASCII
            .replace(/\s+/g, ' ') // Collapse whitespace
            .trim()
            .slice(0, 15000); // Limit length to avoid token limits

        console.log("[IMPROVE] Cleaned resume text length:", cleanResumeText.length);

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "You are a Resume Editor. Your job is to improve the language and formatting of an existing resume without changing any factual details.\n\nCRITICAL OUTPUT RULES:\n1. Return ONLY valid JSON.\n2. The 'improvedResume' field MUST be a SINGLE string. Use '\\n' (newline character) for formatting. DO NOT break the string into multiple lines in the JSON source.\n3. Input text may contain PDF artifacts; ignore them.\n4. DO NOT output PDF binary code.\n5. DO NOT ANONYMIZE the content; keep all names and details exactly as they are."
                },
                {
                    role: "user",
                    content: `Enhance the following resume text.

Original Resume:
${cleanResumeText}

STRICT EDITING RULES:
1.  **NO ANONYMIZATION**: Do NOT replace real company names with "ABC Company" or similar placeholders. Keep the EXACT original names (e.g., "Tata Consultancy Services", "Infosys").
2.  **PRESERVE DETAILS**: Keep all dates, job titles, and university names exactly as they appear in the original.
3.  **IMPROVE CONTENT**:
    -   Rewrite bullet points to use strong action verbs (e.g., "Spearheaded", "Optimized").
    -   Incorporate these missing keywords if relevant: ${missingKeywords ? missingKeywords.join(', ') : 'None'}.
    -   Fix grammar and spelling errors.
4.  **FORMATTING**: Organize into standard sections (Summary, Experience, Education, Skills).
5.  **NO BINARY**: The improvedResume field must be a PLAIN TEXT string. Do NOT output %PDF or any binary data.
6.  **NO COMMENTARY**: Do NOT include a "Changes Made" section, introduction, or conclusion. Return the resume text ONLY.
7.  **JSON STRING FORMAT**: The 'improvedResume' value MUST be a single line string in the JSON output, using '\\n' for line breaks. Do not write multi-line strings.

Return a JSON object with this structure:
{
  "improvedResume": "The full text of the enhanced resume (for plain text view)...",
  "structuredResume": {
    "personalInfo": { "name": "...", "contact": "...", "summary": "..." },
    "experience": [ { "role": "...", "company": "...", "date": "...", "description": ["Bullet 1", "Bullet 2"] } ],
    "education": [ { "degree": "...", "school": "...", "date": "...", "description": "..." } ],
    "skills": ["Skill 1", "Skill 2"]
  },
  "improvedScore": 85
}`
                }
            ],
            temperature: 0.5,
            max_tokens: 4000,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content || "{}";

        if (!content || content.length < 10) {
            console.error("[IMPROVE] Received empty or too short content from AI");
            throw new Error("AI returned empty response");
        }

        let data;


        try {
            data = JSON.parse(content);
        } catch (e) {
            console.error("[IMPROVE] JSON Parse Error:", e);
            // Fallback: try to extract JSON if wrapped in markdown
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    data = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                    throw new Error("Failed to parse AI response");
                }
            } else {
                throw new Error("Invalid response format from AI");
            }
        }

        if (!data.improvedResume) {
            console.error("[IMPROVE] Missing improvedResume in AI response:", JSON.stringify(data, null, 2));
            throw new Error("AI did not generate resume content");
        }

        console.log("[IMPROVE] Successfully generated improved resume with score:", data.improvedScore);

        return NextResponse.json({
            improvedResume: data.improvedResume,
            structuredResume: data.structuredResume || null, // Add structured data for portfolio generation
            improvedScore: data.improvedScore || 85, // Fallback score
            changesMade: data.changesMade || [],
            success: true
        });

    } catch (error: any) {
        console.error("[IMPROVE] Error:", error);
        return NextResponse.json({
            error: "Failed to improve resume",
            message: error.message
        }, { status: 500 });
    }
}
