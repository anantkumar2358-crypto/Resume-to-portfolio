// Defensive loading of pdf2json
let PDFParser: any = null;
try {
    // @ts-ignore
    PDFParser = require("pdf2json");
} catch (e) {
    console.error("Failed to load pdf2json:", e);
}

export interface ParsedResume {
    text: string;
    experience: string[];
    education: string[];
}

export async function parseResume(buffer: Buffer): Promise<string> {
    if (!PDFParser) {
        console.error("[parseResume] pdf2json module not available");
        throw new Error("PDF parsing library not available. This might be a deployment environment issue.");
    }

    return new Promise((resolve, reject) => {
        try {
            const pdfParser = new PDFParser(null, 1); // 1 = Simple text extraction

            pdfParser.on("pdfParser_dataError", (errData: any) => {
                console.error("pdf2json Error:", errData.parserError);
                // Resolve empty instead of reject to prevent crashes
                resolve("");
            });

            pdfParser.on("pdfParser_dataReady", () => {
                try {
                    const text = (pdfParser as any).getRawTextContent();
                    console.log("[parseResume] Successfully extracted text, length:", text?.length || 0);
                    resolve(text || "");
                } catch (e) {
                    console.error("Error getting text content:", e);
                    resolve("");
                }
            });

            pdfParser.parseBuffer(buffer);
        } catch (e: any) {
            console.error("pdf2json Exception:", e);
            console.error("Exception stack:", e.stack);
            reject(new Error(`PDF parsing failed: ${e.message}`));
        }
    });
}

