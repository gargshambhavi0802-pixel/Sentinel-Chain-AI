import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, PenSquare, ArrowRight, Sparkles, Send, 
  RefreshCw, AlertTriangle, ShieldCheck, Cpu, 
  Layers, Plus, Trash2, ArrowDownCircle
} from "lucide-react";
import { Disruption } from "../types";

interface IncomingDisruptionsProps {
  onAnalyzeDisruption: (disruption: Disruption) => void;
  isAnalyzing: boolean;
}

const TEMPLATE_DISRUPTIONS = [
  {
    id: "suez-blockage",
    headline: "Suez Canal Critical Transit Blockage",
    category: "Port",
    severity: "Critical",
    probability: 95,
    promptText: "A 400m ultra-large container vessel has run aground sideways in the Suez Canal transit corridor, halting all maritime vessel traffic in both directions. Ship queues are climbing past 100 hulls. Salvage operators predict 10-14 days before canal refloating can complete.",
    affectedNodes: ["Suez Canal Corridor", "Rotterdam Entry Port", "Singapore Terminal Hub"]
  },
  {
    id: "typhoon-infa",
    headline: "Cat-4 Typhoon In-Fa Shanghai Port Impact",
    category: "Weather",
    severity: "High",
    probability: 85,
    promptText: "Super Typhoon In-Fa is approaching the East China Sea with sustained winds of 145mph. Offshore wind speeds force the immediate suspension of crane and berthing operations at Shanghai Port Complexes and Ningbo-Zhoushan terminals for at least 5 days.",
    affectedNodes: ["East China Sea Route", "Shanghai Port Complex", "Ningbo-Zhoushan Terminals"]
  },
  {
    id: "la-port-strike",
    headline: "Port Authority Labor Strike & Shutdown",
    category: "Port",
    severity: "High",
    probability: 75,
    promptText: "A contract dispute has led to an immediate labor walkout and strike across Los Angeles and Long Beach terminal complexes. Gantry crane unloading has ground to a complete halt, freezing truck gates and raising container dwell times past 2 weeks.",
    affectedNodes: ["Los Angeles Terminal Port", "Long Beach Transit Corridor"]
  },
  {
    id: "silicon-shortage",
    headline: "Tier-1 Semiconductor Foundry Shortage",
    category: "Supplier",
    severity: "High",
    probability: 80,
    promptText: "Severe pure water shortages and raw silicon wafer shipment deficits in the Hsinchu Science Park force Tier-1 foundries to restrict allocator limits on micro-controllers. Lead times stretch to 48 weeks, creating risk for automotive assembly lines.",
    affectedNodes: ["Hsinchu Science Park", "Taiwan Foundries", "Automotive Assembly Lines"]
  }
];

const INTEL_BOOSTER_SNIPPETS = [
  { label: "+ Storm Surcharge", text: " with instant 15% ocean freight storm surcharges applied" },
  { label: "+ Labor Strike Extension", text: " and sympathy strikes expanding to adjacent rail hubs" },
  { label: "+ Severe Demurrage Fine", text: " leading to immediate $10,000 daily demurrage penalties" },
  { label: "+ Power Outage", text: " coupled with secondary power grid load shedding across assembly hubs" }
];

export default function IncomingDisruptions({ onAnalyzeDisruption, isAnalyzing }: IncomingDisruptionsProps) {
  const [customReport, setCustomReport] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("suez-blockage");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    const template = TEMPLATE_DISRUPTIONS.find(t => t.id === id);
    if (template) {
      setCustomReport("");
    }
  };

  const handleAppendSnippet = (text: string) => {
    // If no custom text yet, initialize with current template text
    let currentText = customReport;
    if (!currentText) {
      const activeTemplate = TEMPLATE_DISRUPTIONS.find(t => t.id === selectedTemplate);
      currentText = activeTemplate ? activeTemplate.promptText : "";
    }
    setCustomReport(currentText + text);
    setSelectedTemplate(""); // Switch to custom report focus
  };

  const handleClearText = () => {
    setCustomReport("");
    setSelectedTemplate("suez-blockage");
  };

  const handleTriggerAnalysis = async () => {
    setErrorMsg("");
    let textToAnalyze = customReport.trim();
    
    // If no custom report, fetch the active template prompt text
    if (!textToAnalyze) {
      const activeTemplate = TEMPLATE_DISRUPTIONS.find(t => t.id === selectedTemplate);
      if (activeTemplate) {
        textToAnalyze = activeTemplate.promptText;
      }
    }

    if (!textToAnalyze) {
      setErrorMsg("Please provide a disruption scenario to analyze.");
      return;
    }

    try {
      const res = await fetch("/api/analyze-disruption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze })
      });

      if (!res.ok) {
        throw new Error("Analysis failed. Server responded with an error.");
      }

      const analyzedDisruption: Disruption = await res.json();
      // Add id/metadata for tracking
      analyzedDisruption.id = `disruption-${Date.now()}`;
      onAnalyzeDisruption(analyzedDisruption);
    } catch (err: any) {
      console.error("Error calling analyze disruption:", err);
      setErrorMsg(err.message || "An unexpected error occurred during analysis.");
    }
  };

  const activeText = customReport || TEMPLATE_DISRUPTIONS.find(t => t.id === selectedTemplate)?.promptText || "";

  return (
    <section
      id="incoming-disruptions"
      className="min-h-screen flex flex-col justify-start items-center px-4 sm:px-6 py-20 w-full"
    >
      <div className="w-full max-w-5xl">
        {/* Title */}
        <div className="text-left mb-10 border-b border-slate-800/60 pb-5">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Stage III — Ingress Signal Parser</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Interactive Threat Synthesizer</h2>
          <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
            Formulate scenarios or use real incident templates. SentinelChain AI triggers Gemini server-side reasoners to parse unstructured cables, calculate downstream supply bottlenecks, and formulate alternate routes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Panel: Active Templates (5 Cols) */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block text-left">
                Active Incidents Ledger (Focus Target)
              </span>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {TEMPLATE_DISRUPTIONS.map((item) => {
                  const isSelected = selectedTemplate === item.id && !customReport;
                  let sevStyle = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                  if (item.severity === "Critical") sevStyle = "bg-red-500/10 text-red-400 border-red-500/25";
                  if (item.severity === "High") sevStyle = "bg-amber-500/10 text-amber-400 border-amber-500/25";
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTemplate(item.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-950 border-sky-500 shadow-md shadow-sky-950/20"
                          : "bg-slate-900/30 border-slate-850 hover:bg-slate-900/60 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 pr-2">
                          <span className="text-xs font-bold text-slate-200 block uppercase tracking-wide">
                            {item.headline}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                            {item.category} • Prob: {item.probability}%
                          </span>
                        </div>
                        
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${sevStyle}`}>
                          {item.severity}
                        </span>
                      </div>

                      {/* Mini Probability Track Bar */}
                      <div className="h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${item.severity === "Critical" ? "bg-red-400" : "bg-amber-400"}`}
                          style={{ width: `${item.probability}%` }}
                        />
                      </div>

                      <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed font-sans truncate">
                        {item.promptText}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingress Gateway Metadata Indicator */}
            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-3.5 text-left font-mono text-[9px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Ingress Gateway:</span>
                <span className="text-sky-400">gwy::bedrock-router</span>
              </div>
              <div className="flex justify-between">
                <span>Model Engine:</span>
                <span className="text-slate-300">Gemini 2.5 (Pro)</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Custom Editor with Quick Boosters (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/35 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                <div className="flex items-center space-x-2">
                  <PenSquare className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold uppercase text-slate-200 tracking-wider font-sans">
                    Incident Synthesis Console
                  </span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-[9px] text-slate-500">
                  <Cpu className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                  <span>PARSER PIPELINE: ACTIVE</span>
                </div>
              </div>

              {/* Quick Append Snippets */}
              <div className="text-left space-y-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Intel Booster Snippets (Tac-Append)</span>
                <div className="flex flex-wrap gap-1.5">
                  {INTEL_BOOSTER_SNIPPETS.map((snip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAppendSnippet(snip.text)}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-850 hover:border-sky-500/50 hover:bg-slate-900 text-[9px] text-slate-400 hover:text-sky-400 font-mono flex items-center space-x-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3 text-sky-400 shrink-0" />
                      <span>{snip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div className="space-y-2 text-left relative">
                <div className="flex justify-between items-center">
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    Disruption Intel Log (Editable Area)
                  </label>
                  {(customReport || selectedTemplate) && (
                    <button
                      onClick={handleClearText}
                      className="text-[9px] font-mono text-red-400 hover:text-red-300 flex items-center space-x-1 cursor-pointer"
                      title="Reset text to default"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
                
                <textarea
                  value={activeText}
                  onChange={(e) => {
                    setCustomReport(e.target.value);
                    setSelectedTemplate(""); // Switch focus to custom report mode
                  }}
                  placeholder="Draft a custom maritime or supplier crisis narrative... (e.g., A heavy fuel spill at the Panama Canal has closed primary locks for 48 hours, stalling 12 container hulls...)"
                  className="w-full h-44 bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-300 font-sans leading-relaxed focus:outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/20"
                />

                <div className="absolute right-3.5 bottom-3.5 text-[8.5px] text-slate-500 font-mono">
                  {activeText.length} chars
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl flex items-start space-x-2 text-[10px] text-left">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Action Trigger Block */}
            <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between text-left">
              <div className="text-[9px] font-mono text-slate-500 leading-tight">
                {customReport ? (
                  <span className="text-amber-500 block font-bold">CUSTOM OVERRIDE LOG DETECTED</span>
                ) : (
                  <span className="block">ACTIVE: {selectedTemplate.toUpperCase()}</span>
                )}
                <span>COGNITIVE TEMPERATURE: 0.15</span>
              </div>

              <button
                onClick={handleTriggerAnalysis}
                disabled={isAnalyzing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Cascades...</span>
                  </>
                ) : (
                  <>
                    <span>Run Gemini AI Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
