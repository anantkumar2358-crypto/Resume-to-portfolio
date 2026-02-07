import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseResume } from "@/lib/resume";
import { parseResumeWithGemini, ResumeData } from "@/lib/gemini";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        console.log("[UPLOAD] Starting upload process");
        const formData = await req.formData();
        const file = formData.get("resume") as File;
        const username = formData.get("username") as string;
        const leetCodeUser = formData.get("leetCodeUser") as string;
        const codeforcesUser = formData.get("codeforcesUser") as string;

        console.log("[UPLOAD] Username:", username);
        console.log("[UPLOAD] File:", file ? `${file.name} (${file.size} bytes)` : "No file");

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const dataDir = path.join(process.cwd(), "data");
        const publicDir = path.join(process.cwd(), "public", "resumes");
        await fs.mkdir(dataDir, { recursive: true });
        await fs.mkdir(publicDir, { recursive: true });

        const filePath = path.join(dataDir, `${username}.json`);
        const resumePath = path.join(publicDir, `${username}.pdf`);

        // 1. Parsing the PDF (Fast)
        let resumeText = "";
        if (file) {
            try {
                const buffer = Buffer.from(await file.arrayBuffer());

                // Save the actual PDF file for download
                await fs.writeFile(resumePath, buffer);
                console.log("[UPLOAD] PDF saved to:", resumePath);

                resumeText = await parseResume(buffer);
                console.log("[UPLOAD] Resume parsed, text length:", resumeText.length);
            } catch (parseError) {
                console.error("[UPLOAD] PDF Parse Error:", parseError);
                resumeText = "PDF Parsing Failed.";
            }
        }

        // 2. Load EXISTING data if file is missing (to preserve resumeText)
        let existingData: any = {};
        try {
            const fileContent = await fs.readFile(filePath, "utf-8");
            existingData = JSON.parse(fileContent);
        } catch (e) {
            // File doesn't exist, that's fine
        }

        // 3. Prepare NEW data
        let userData = {
            username,
            leetCodeUser: leetCodeUser || existingData.leetCodeUser || null,
            codeforcesUser: codeforcesUser || existingData.codeforcesUser || null,
            resumeText: resumeText || existingData.resumeText || "",
            structuredData: existingData.structuredData || null,
            lastUpdated: new Date().toISOString(),
        };

        // FORCE OVERWRITE: Ensure we are replacing the file content completely
        await fs.writeFile(filePath, JSON.stringify(userData, null, 2), { flag: 'w' });
        console.log(`[UPLOAD] OVERWROTE data for ${username} with LeetCode user: ${leetCodeUser}`);
        console.log("[UPLOAD] Initial data saved.");

        // 3. AI Processing (Slow - might timeout or fail)
        if (resumeText && resumeText.length > 50) { // Only process if there's substantial text
            try {
                console.log("[UPLOAD] Starting Gemini parsing...");
                // SKIP AI due to Rate Limits (429) crashing the request
                // const parsedData = await parseResumeWithGemini(resumeText);
                const parsedData = null;
                if (parsedData) {
                    userData.structuredData = parsedData;
                    // Update file with rich data
                    await fs.writeFile(filePath, JSON.stringify(userData, null, 2));
                    console.log("[UPLOAD] Rich data saved.");
                }
            } catch (aiError) {
                console.error("[UPLOAD] AI Error:", aiError);
                // We already saved the text version, so we are safe.
            }
        }

        revalidatePath(`/portfolio/${username}`);
        revalidatePath("/");

        return NextResponse.json({ success: true, username });
    } catch (error) {
        console.error("[UPLOAD] Error processing request:", error);
        console.error("[UPLOAD] Error stack:", error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
