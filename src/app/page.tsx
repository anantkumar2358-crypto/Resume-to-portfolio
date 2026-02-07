"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Github, ArrowRight, Code } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [username, setUsername] = useState("");
  const [leetCodeUser, setLeetCodeUser] = useState("");
  const [codeforcesUser, setCodeforcesUser] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);

    try {
      // Allow update even without file (metadata only)
      const formData = new FormData();
      formData.append("username", username);
      if (leetCodeUser) formData.append("leetCodeUser", leetCodeUser);
      if (codeforcesUser) formData.append("codeforcesUser", codeforcesUser);
      if (file) formData.append("resume", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed status:", response.status);
        console.error("Upload failed body:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          alert(`Upload failed: ${errorData.error || response.statusText}`);
        } catch (e) {
          alert(`Server Error (${response.status}): Check console for details.`);
        }
        setLoading(false);
        return;
      }

      router.push(`/portfolio/${username}`);
    } catch (error) {
      console.error("Upload network error", error);
      alert("Network error during upload. Check console.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-[#0B1120] relative overflow-hidden selection:bg-blue-500/30">
      {/* Premium Animated Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000 mix-blend-screen" />
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-lg relative"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8 shadow-2xl ring-1 ring-white/5"
          >
            <Code size={48} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 drop-shadow-sm">
              Portfolio
            </span>
            <span className="text-white">Gen</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-md mx-auto">
            Transform your <span className="text-slate-200 font-medium">GitHub</span> profile & <span className="text-slate-200 font-medium">Resume</span> into a stunning portfolio website.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl ring-1 ring-white/5 relative overflow-hidden group"
        >
          {/* Internal Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Github size={14} /> GitHub Profile
              </label>
              <div className="relative group/input">
                <input
                  type="text"
                  placeholder="your-username"
                  className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl py-4 pl-5 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <div className="absolute right-4 top-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">LeetCode</label>
                <input
                  type="text"
                  placeholder="Optional"
                  className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 transition-all shadow-inner"
                  value={leetCodeUser}
                  onChange={(e) => setLeetCodeUser(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Codeforces</label>
                <input
                  type="text"
                  placeholder="Optional"
                  className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 transition-all shadow-inner"
                  value={codeforcesUser}
                  onChange={(e) => setCodeforcesUser(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Upload size={14} /> Resume Upload
              </label>
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-700/60 rounded-xl cursor-pointer hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all group/file relative overflow-hidden bg-slate-950/30">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="flex flex-col items-center gap-2 text-slate-500 group-hover/file:text-emerald-400 transition-colors z-10">
                  {file ? (
                    <>
                      <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Code size={20} />
                      </div>
                      <span className="text-sm font-medium text-emerald-200">{file.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} />
                      <span className="text-sm">Click to upload PDF</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Building...
                </span>
              ) : (
                <>
                  <span>Generate Portfolio</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      {/* Footer Info */}
      <div className="absolute bottom-6 text-center w-full text-slate-600 text-xs tracking-wider uppercase">
        Powered by Next.js • Gemini AI • GitHub API
      </div>
    </main>
  );
}
