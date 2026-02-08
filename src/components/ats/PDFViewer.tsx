"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
    file: File | string | null;
}

export function PDFViewer({ file }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const changePage = (offset: number) => {
        setPageNumber((prevPageNumber) => Math.min(Math.max(1, prevPageNumber + offset), numPages));
    };

    const changeScale = (delta: number) => {
        setScale((prevScale) => Math.min(Math.max(0.5, prevScale + delta), 2.5));
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200 shadow-sm z-10">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => changePage(-1)}
                        disabled={pageNumber <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-medium w-16 text-center">
                        Page {pageNumber} of {numPages || "--"}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => changePage(1)}
                        disabled={pageNumber >= numPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => changeScale(-0.1)}
                    >
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-medium w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => changeScale(0.1)}
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Document View */}
            <div className="flex-1 overflow-auto flex justify-center p-4 bg-gray-100">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center justify-center p-10 text-gray-400">
                            Loading PDF...
                        </div>
                    }
                    error={
                        <div className="flex items-center justify-center p-10 text-red-400">
                            Failed to load PDF.
                        </div>
                    }
                    className="shadow-lg"
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="bg-white shadow-md"
                        width={500} // Base width, scales with 'scale' prop
                    />
                </Document>
            </div>
        </div>
    );
}
