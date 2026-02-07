// @ts-ignore
// const pdf = require('pdf-parse');

export interface ParsedResume {
    text: string;
    experience: string[];
    education: string[];
}

// Simple parsing logic. In a real app, this would be more robust or use an LLM to structure the data.
// Here we just extract the raw text for the LLM to process later.
export async function parseResume(buffer: Buffer): Promise<string> {
    try {
        // Mock parsing to isolate crash
        // const data = await pdf(buffer);
        // return data.text;
        return "Resume parsing temporarily disabled for debugging.";
    } catch (error) {
        console.error("Error parsing resume PDF:", error);
        return "";
    }
}
