"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, AlertTriangle, Play, HelpCircle, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

interface CheckedResult {
  username: string;
  status: "available" | "taken" | "rate_limited" | "error" | "pending" | "checking";
  message?: string;
}

export default function UsernameCheckerPage() {
  // Single check state
  const [singleUsername, setSingleUsername] = useState("");
  const [singleResult, setSingleResult] = useState<CheckedResult | null>(null);
  const [singleChecking, setSingleChecking] = useState(false);

  // Bulk generator state
  const [charLength, setCharLength] = useState<number>(3);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUnderscores, setIncludeUnderscores] = useState(true);
  const [bulkList, setBulkList] = useState<CheckedResult[]>([]);
  const [isBulkChecking, setIsBulkChecking] = useState(false);
  const [stopBulkCheck, setStopBulkCheck] = useState(false);

  // Validate Instagram rules
  const validateUsername = (name: string) => {
    if (!name) return "Username cannot be empty";
    if (name.length > 30) return "Instagram usernames must be under 30 characters";
    const regex = /^[a-zA-Z0-9._]+$/;
    if (!regex.test(name)) {
      return "Only letters, numbers, periods, and underscores are allowed";
    }
    return null;
  };

  const handleSingleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateUsername(singleUsername);
    if (validationError) {
      setSingleResult({
        username: singleUsername,
        status: "error",
        message: validationError
      });
      return;
    }

    setSingleChecking(true);
    setSingleResult(null);

    try {
      const res = await fetch(`/api/check?username=${encodeURIComponent(singleUsername.trim())}`);
      const data = await res.json();

      if (data.status === "available") {
        setSingleResult({ username: singleUsername, status: "available" });
      } else if (data.status === "taken") {
        setSingleResult({ username: singleUsername, status: "taken" });
      } else if (data.status === "rate_limited") {
        setSingleResult({
          username: singleUsername,
          status: "rate_limited",
          message: "Instagram rate limit reached. Status is indeterminate."
        });
      } else {
        setSingleResult({
          username: singleUsername,
          status: "error",
          message: data.error || data.message || "Failed to check availability."
        });
      }
    } catch (err: any) {
      setSingleResult({
        username: singleUsername,
        status: "error",
        message: "Network error occurred."
      });
    } finally {
      setSingleChecking(false);
    }
  };

  // Generate random candidate usernames based on settings
  const generateCandidates = () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const underscore = "_";
    
    let pool = letters;
    if (includeNumbers) pool += numbers;
    if (includeUnderscores) pool += underscore;

    const candidatesSet = new Set<string>();
    const countToGenerate = 15; // Number of items to generate for checking

    // Safety check to prevent infinite loop on small search spaces
    const maxCombinations = Math.pow(pool.length, charLength);
    const limit = Math.min(countToGenerate, maxCombinations);

    while (candidatesSet.size < limit) {
      let candidate = "";
      for (let i = 0; i < charLength; i++) {
        candidate += pool.charAt(Math.floor(Math.random() * pool.length));
      }
      // Exclude simple/obvious combinations if 3-chars
      if (charLength === 3) {
        if (candidate[0] === candidate[1] && candidate[1] === candidate[2]) continue;
        if (candidate === "123" || candidate === "abc" || candidate === "xyz") continue;
      }
      candidatesSet.add(candidate);
    }

    const generated = Array.from(candidatesSet).map(username => ({
      username,
      status: "pending" as const
    }));

    setBulkList(generated);
  };

  // Check the generated bulk list sequentially with a delay to respect rate limits
  const startCheckingBulk = async () => {
    if (bulkList.length === 0) return;
    setIsBulkChecking(true);
    setStopBulkCheck(false);

    let listToUpdate = [...bulkList];

    for (let i = 0; i < listToUpdate.length; i++) {
      // Check if user clicked stop
      if (stopBulkCheck) break;

      // Set current checking state
      listToUpdate[i] = { ...listToUpdate[i], status: "checking" };
      setBulkList([...listToUpdate]);

      const username = listToUpdate[i].username;

      try {
        const res = await fetch(`/api/check?username=${encodeURIComponent(username)}`);
        const data = await res.json();

        if (data.status === "available") {
          listToUpdate[i] = { username, status: "available" };
        } else if (data.status === "taken") {
          listToUpdate[i] = { username, status: "taken" };
        } else if (data.status === "rate_limited") {
          listToUpdate[i] = { 
            username, 
            status: "rate_limited",
            message: "Instagram rate limit reached."
          };
        } else {
          listToUpdate[i] = { username, status: "error", message: "Error checking status" };
        }
      } catch (err) {
        listToUpdate[i] = { username, status: "error", message: "Network error" };
      }

      setBulkList([...listToUpdate]);

      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsBulkChecking(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F8F8] font-sans selection:bg-[#00e6a8]/30 selection:text-[#00e6a8] pb-24">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00e6a8]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        {/* Subtle grid layout overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Navigation */}
        <header className="flex justify-between items-center mb-16">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00e6a8] animate-pulse" />
            <span className="text-xs tracking-widest uppercase text-zinc-500 font-mono">Knots Systems Tool</span>
          </div>
        </header>

        {/* Title Area */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-3 py-1 text-xs font-mono text-[#00e6a8] bg-[#00e6a8]/10 rounded-full border border-[#00e6a8]/20">
              SOCIAL OSINT TOOL
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
              Instagram Username Checker
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-400 text-base sm:text-lg">
              Check availability of short-length usernames. Discover rare or clean usernames using parallel queries.
            </p>
          </motion.div>
        </div>

        {/* Double Column Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Checker & Guide */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick Checker Box */}
            <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl rounded-2xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Quick Check
              </h2>
              <form onSubmit={handleSingleCheck} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter username (e.g. du9)"
                    value={singleUsername}
                    onChange={(e) => setSingleUsername(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-[#00e6a8]/50 focus:ring-1 focus:ring-[#00e6a8]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all font-mono"
                  />
                  {singleChecking && (
                    <div className="absolute right-3 top-3.5 text-zinc-500">
                      <Loader2 size={16} className="animate-spin text-[#00e6a8]" />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={singleChecking || !singleUsername.trim()}
                  className="w-full bg-[#00e6a8] hover:bg-[#00cfa0] disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold text-sm py-3 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-2"
                >
                  {singleChecking ? "Verifying..." : "Verify Availability"}
                </button>
              </form>

              {/* Single Check Result View */}
              <AnimatePresence mode="wait">
                {singleResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 pt-6 border-t border-zinc-800/80"
                  >
                    <div className={`p-4 rounded-xl flex items-start gap-3 ${
                      singleResult.status === "available" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                      singleResult.status === "taken" ? "bg-rose-500/10 border border-rose-500/20 text-rose-300" :
                      singleResult.status === "rate_limited" ? "bg-amber-500/10 border border-amber-500/20 text-amber-300" :
                      "bg-zinc-800/40 border border-zinc-700/50 text-zinc-400"
                    }`}>
                      <div className="mt-0.5">
                        {singleResult.status === "available" && <Check size={18} />}
                        {singleResult.status === "taken" && <X size={18} />}
                        {singleResult.status === "rate_limited" && <AlertTriangle size={18} />}
                        {singleResult.status === "error" && <HelpCircle size={18} />}
                      </div>
                      <div className="flex-1">
                        <div className="font-mono font-bold text-sm">@{singleResult.username}</div>
                        <div className="text-xs mt-1 text-zinc-400">
                          {singleResult.status === "available" && "This username appears to be available! You can register it right now."}
                          {singleResult.status === "taken" && "This username is registered and unavailable."}
                          {singleResult.status === "rate_limited" && (singleResult.message || "Instagram rate-limited the checker IP. Please try again later.")}
                          {singleResult.status === "error" && (singleResult.message || "An error occurred while checking.")}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info Box */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Sparkles size={16} className="text-[#00e6a8]" />
                Technical Constraints
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Instagram enforces strict bot detection and IP filtering. <strong>3-character usernames</strong> are extremely valuable; virtually all 50,653 combinations are claimed, reserved, or banned. 
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                To find genuine open slots, we recommend generating <strong>4-character</strong> or <strong>5-character</strong> names containing a mix of letters, numbers, and underscores.
              </p>
            </div>
            
          </div>

          {/* Right Column: Bulk Generator Tool */}
          <div className="lg:col-span-7">
            <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl rounded-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e6a8]" />
                  Bulk Candidate Generator
                </h2>
                {bulkList.length > 0 && (
                  <button 
                    onClick={() => setBulkList([])}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Clear Results
                  </button>
                )}
              </div>

              {/* Generator settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-zinc-950/40 border border-zinc-800/60 rounded-xl">
                <div>
                  <label className="block text-xs text-zinc-400 mb-2 font-mono">Length</label>
                  <select 
                    value={charLength} 
                    onChange={(e) => setCharLength(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#00e6a8]/50 focus:ring-1 focus:ring-[#00e6a8]/30 rounded-lg px-3 py-2 text-xs outline-none text-zinc-300"
                  >
                    <option value={3}>3 Characters (All Taken/Rare)</option>
                    <option value={4}>4 Characters (Uncommon)</option>
                    <option value={5}>5 Characters (Likely Available)</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 text-xs text-zinc-400 py-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={includeNumbers} 
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="rounded border-zinc-800 bg-zinc-900 text-[#00e6a8] focus:ring-[#00e6a8]/30"
                    />
                    Include Numbers (0-9)
                  </label>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 text-xs text-zinc-400 py-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={includeUnderscores} 
                      onChange={(e) => setIncludeUnderscores(e.target.checked)}
                      className="rounded border-zinc-800 bg-zinc-900 text-[#00e6a8] focus:ring-[#00e6a8]/30"
                    />
                    Include Underscores (_)
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={generateCandidates}
                  disabled={isBulkChecking}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer"
                >
                  Generate Candidates
                </button>
                {bulkList.length > 0 && (
                  <button
                    onClick={isBulkChecking ? () => setStopBulkCheck(true) : startCheckingBulk}
                    className={`flex-1 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-2 ${
                      isBulkChecking 
                        ? "bg-rose-600 hover:bg-rose-500 text-white" 
                        : "bg-[#00e6a8] hover:bg-[#00cfa0] text-black"
                    }`}
                  >
                    {isBulkChecking ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Stop Check
                      </>
                    ) : (
                      <>
                        <Play size={14} fill="currentColor" />
                        Verify Candidates ({bulkList.length})
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Generator Queue List */}
              {bulkList.length > 0 && (
                <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-950/20 max-h-[300px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-zinc-800/80">
                    <thead className="bg-zinc-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-mono text-zinc-500 uppercase tracking-wider">Username</th>
                        <th className="px-4 py-3 text-right text-xs font-mono text-zinc-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {bulkList.map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/20 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-zinc-300">
                            @{item.username}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-xs">
                            {item.status === "pending" && (
                              <span className="text-zinc-600 font-mono">Pending Check</span>
                            )}
                            {item.status === "checking" && (
                              <span className="text-[#00e6a8] flex items-center justify-end gap-1.5 font-mono">
                                <Loader2 size={12} className="animate-spin" />
                                Checking
                              </span>
                            )}
                            {item.status === "available" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold font-mono text-[10px]">
                                Available
                              </span>
                            )}
                            {item.status === "taken" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono text-[10px]">
                                Taken
                              </span>
                            )}
                            {item.status === "rate_limited" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[10px]" title="Rate limited by target platform">
                                Limited
                              </span>
                            )}
                            {item.status === "error" && (
                              <span className="text-rose-400 font-mono text-[10px]">Error</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
