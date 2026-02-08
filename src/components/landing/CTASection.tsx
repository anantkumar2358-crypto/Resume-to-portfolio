import { SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function CTASection() {
    return (
        <section className="py-20 px-6 relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700" />
            <div className="absolute top-0 left-0 size-96 bg-purple-400/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 size-96 bg-blue-400/30 rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full mb-6 backdrop-blur-sm">
                        <Sparkles className="size-4" />
                        <span className="text-sm font-medium">Ready to get started?</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl text-white mb-6 font-bold">
                        Create Your Portfolio in Minutes
                    </h2>

                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of developers who have transformed their careers with an AI-generated portfolio.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <SignedOut>
                            <Link href="/sign-up">
                                <Button
                                    size="lg"
                                    className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 border-0"
                                >
                                    Start For Free
                                    <ArrowRight className="ml-2 size-5" />
                                </Button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/">
                                <Button
                                    size="lg"
                                    className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 border-0"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 size-5" />
                                </Button>
                            </Link>
                        </SignedIn>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white bg-transparent hover:bg-white/10 text-lg px-8"
                        >
                            Contact Sales
                        </Button>
                    </div>

                    <p className="text-white/70 text-sm mt-6">
                        No credit card required • Free 14-day trial • Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
