"use client";

import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ATSChecker } from "@/components/ats/ATSChecker";

export default function ATSCheckPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
            <Navigation />
            <main className="pt-32 pb-20">
                <ATSChecker />
            </main>
            <Footer />
        </div>
    );
}
