import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BrainCircuit, Cpu, Code, AlignLeft, RefreshCw, 
  Terminal, ShieldCheck, HelpCircle, CheckCircle,
  Hash, Info, FileCode, CheckSquare
} from "lucide-react";
import { Disruption } from "../types";

interface AiReasoningProps {
  activeDisruption: Disruption | null;
  isAnalyzing: boolean;
}

export default function AiReasoning({ activeDisruption, isAnalyzing }: AiReasoningProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  const stepsInfo = [
    { num: 1, title: "Tokenization Mesh", icon: AlignLeft, desc: "Splits unstructured cables into indexable token sequences with color weighting." },
    { num: 2, title: "Attention Entity Map", icon: BrainCircuit, desc: "Extracts physical logistics hubs, risk values, and timeline spans." },
    { num: 3, title: "Risk Inference Engine", icon: Cpu, desc: "Executes cognitive attention weights to infer downstream route cascade impacts." },
    { num: 4, title: "Structured JSON Compiler", icon: Code, desc: "Compiles mathematical inferences into structured, schema-validated JSON." }
  ];

  const displayDisruption: Disruption = activeDisruption || {
    headline: "Suez Canal Critical Transit Blockage",
    category: "Port",
    severity: "Critical",
    probability: 95,
    affectedNodes: ["Suez Canal Transit Corridor", "Rotterdam Entry Port", "Singapore Terminal Hub"],
    impactInventory: -40,
    impactDeliveries: "Severe backlog. Vessel queues exceeding 120 ships. Alternate Cape of Good Hope routing adds 10-14 days.",
    impactCost: 28,
    reasoning: [
      "Physical bottleneck prevents standard East-West maritime cargo flows.",
      "Vessel redirection forces immediate 3,500nm detours around the African cape.",
      "Empty container repositioning severely delayed, creating severe global equipment deficits."
    ],
    recommendations: []
  };

  const rawParagraph = `ALERT: Critical obstruction reported along the Suez Canal Corridor. Containership vessel grounded sideways, blocking shipping lanes in both directions. Directly affects Rotterdam Entry Port schedules. Risk projection calculates a 95% probability of cascade. Estimated delay: 10-14 days.`;

  // Pre-split tokens
  const tokens = rawParagraph.split(" ").map((word, i) => {
    const colors = [
      "bg-sky-500/10 text-sky-400 border-sky-500/20",
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      "bg-amber-500/10 text-amber-400 border-amber-500/20"
    ];
    return { 
      word: word.replace(/[.,:;]/g, ""), 
      style: colors[i % colors.length],
      embeddingIndex: Math.floor(10000 + (i * 493.52)),
      weight: parseFloat((0.45 + (Math.sin(i) * 0.35)).toFixed(3))
    };
  });

  return (
    <section
      id="ai-reasoning"
      className="min-h-screen flex flex-col justify-start items-center px-4 sm:px-6 py-20 w-full"
    >
      <div className="w-full max-w-5xl">
        {/* Title */}
        <div className="text-left mb-8 border-b border-slate-800/60 pb-5">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Stage V — AI Cognitive Core</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">NLP Reasoning Workbench</h2>
          <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
            See how server-side model nodes analyze logistics cables. Step through the stages below to inspect color-coded token sequences, vector weights, attention mapping, and structured JSON compiler outputs.
          </p>
        </div>

        {/* Outer UI Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Panel: Stages Selector (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3 text-left">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                Select Processing Stage
              </span>
              
              <div className="space-y-2">
                {stepsInfo.map((st) => {
                  const Icon = st.icon;
                  const isActive = activeStep === st.num;
                  return (
                    <button
                      key={st.num}
                      onClick={() => {
                        setActiveStep(st.num);
                        setSelectedTokenIdx(null);
                        setHoveredEntity(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start space-x-3.5 cursor-pointer ${
                        isActive
                          ? "bg-slate-950 border-sky-500/60 shadow-lg shadow-sky-950/10"
                          : "bg-slate-900/30 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-sky-500/10 border-sky-500 text-sky-400"
                          : "bg-slate-950 border-slate-850 text-slate-500"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block uppercase">
                          {st.title}
                        </span>
                        <p className="text-[10.5px] text-slate-500 font-sans mt-1 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Performance details card */}
            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 text-left font-mono text-[9px] text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span>MODEL KEY:</span>
                <span className="text-sky-400 font-bold uppercase">gemini-2.5-pro</span>
              </div>
              <div className="flex justify-between">
                <span>EMBEDDING DEPTH:</span>
                <span className="text-slate-300">1,536 FLOATS</span>
              </div>
              <div className="flex justify-between">
                <span>CONTEXT SLOTS:</span>
                <span className="text-slate-300">2,048,000 TOKENS</span>
              </div>
              <div className="flex justify-between">
                <span>INFERENCE LATENCY:</span>
                <span className="text-emerald-400">1.28 SEC TOTAL</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Workbench Playground (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900/35 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between text-left">
            <div>
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 mb-4">
                <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-slate-200 text-[10px] font-bold uppercase tracking-wide">AI Cognitive Processing Terminal</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase">SYS_ADDR: 0x8F9C_PROX</span>
              </div>

              {/* Step Output Box */}
              <div className="min-h-[260px] flex flex-col justify-center">
                
                {/* STEP 1: TOKENIZATION */}
                {activeStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 w-full"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                      <span>Click a token below to inspect floating weight embeddings</span>
                      <span className="text-sky-400">Total: {tokens.length} Tokens</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Tokens List (Left 8 Columns) */}
                      <div className="md:col-span-8 bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 font-mono text-[10px] leading-relaxed max-h-[180px] overflow-y-auto flex flex-wrap gap-1.5 select-none">
                        {tokens.map((tok, idx) => {
                          const isSelected = selectedTokenIdx === idx;
                          return (
                            <span 
                              key={idx} 
                              onClick={() => setSelectedTokenIdx(idx)}
                              className={`px-1.5 py-0.5 rounded border cursor-pointer transition-all ${
                                isSelected 
                                  ? "bg-sky-400 text-slate-950 border-sky-300 font-bold scale-105" 
                                  : `${tok.style} hover:border-slate-500`
                              }`}
                            >
                              {tok.word}
                            </span>
                          );
                        })}
                      </div>

                      {/* Embeddings Micro-Inspector (Right 4 Columns) */}
                      <div className="md:col-span-4 bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 flex flex-col justify-between">
                        <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wider block border-b border-slate-850/60 pb-1.5 mb-2.5">Token Embeddings</span>
                        {selectedTokenIdx !== null ? (
                          <div className="font-mono text-[9px] space-y-2 text-slate-400">
                            <div>
                              <span className="text-slate-500 block">TOKEN STR:</span>
                              <span className="text-sky-400 font-bold">"{tokens[selectedTokenIdx].word}"</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">VOCAB INDEX:</span>
                              <span className="text-slate-300">{tokens[selectedTokenIdx].embeddingIndex}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">ATTN WEIGHT:</span>
                              <span className="text-slate-300">{tokens[selectedTokenIdx].weight} RMS</span>
                            </div>
                            <div className="h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-sky-400" style={{ width: `${tokens[selectedTokenIdx].weight * 100}%` }} />
                            </div>
                          </div>
                        ) : (
                          <div className="text-[9px] text-slate-600 font-mono flex items-center h-full justify-center text-center">
                            Click a token vector to analyze weights
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: ENTITY EXTRACTION */}
                {activeStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 w-full"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                      <span>Hover entities to view dynamic structural dictionary mappings</span>
                      <span className="text-indigo-400">Attention Layer #4</span>
                    </div>

                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 text-xs leading-relaxed text-slate-300">
                      ALERT: Critical obstruction reported along the{" "}
                      <span 
                        onMouseEnter={() => setHoveredEntity("location")}
                        onMouseLeave={() => setHoveredEntity(null)}
                        className="bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-mono font-semibold cursor-pointer transition-all inline-block"
                      >
                        Suez Canal Corridor [Location]
                      </span>
                      . Containership vessel grounded sideways, blocking shipping lanes in both directions. Directly affects{" "}
                      <span 
                        onMouseEnter={() => setHoveredEntity("hub")}
                        onMouseLeave={() => setHoveredEntity(null)}
                        className="bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded font-mono font-semibold cursor-pointer transition-all inline-block"
                      >
                        Rotterdam Entry Port [Hub]
                      </span>{" "}
                      schedules. Risk projection calculates a{" "}
                      <span 
                        onMouseEnter={() => setHoveredEntity("prob")}
                        onMouseLeave={() => setHoveredEntity(null)}
                        className="bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono font-semibold cursor-pointer transition-all inline-block"
                      >
                        95% [Probability]
                      </span>{" "}
                      probability of cascade. Estimated delay:{" "}
                      <span 
                        onMouseEnter={() => setHoveredEntity("time")}
                        onMouseLeave={() => setHoveredEntity(null)}
                        className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-semibold cursor-pointer transition-all inline-block"
                      >
                        10-14 days [Timeline]
                      </span>
                      .
                    </div>

                    {/* Saliency mapping HUD box */}
                    <div className="h-11 bg-slate-900/40 border border-slate-850 rounded-xl p-3 flex items-center justify-between font-mono text-[9.5px]">
                      {hoveredEntity ? (
                        <>
                          <span className="text-slate-500 uppercase font-bold">DETECTION CLASS:</span>
                          <span className="text-sky-400 uppercase">
                            {hoveredEntity === "location" && "PHYSICAL LOGISTICS CHOKEPOINT Node (DB-REF: LAT_32.05)"}
                            {hoveredEntity === "hub" && "PORT TERMINAL DESTINATION Node (DB-REF: ROT_BERTH_A)"}
                            {hoveredEntity === "prob" && "STATISTICAL INCIDENT PROBABILITY RANGE (Confidence: 0.98)"}
                            {hoveredEntity === "time" && "EXPECTED SCHEDULE DEVIATION METRIC INTERVAL (Unit: days)"}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-600 text-center w-full italic">Hover over entity pills in the text block to focus</span>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: REASONING STEPS */}
                {activeStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 w-full"
                  >
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                      AI Cognitive Reasoning Trace
                    </span>
                    
                    <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                      {displayDisruption.reasoning.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl flex items-start space-x-3.5"
                        >
                          <span className="w-5.5 h-5.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{step}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: STRUCTURED OUTPUT GENERATION */}
                {activeStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3.5 w-full"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        JSON Scheme Compiler Output
                      </span>
                      <span className="text-[8.5px] font-mono text-emerald-400 uppercase bg-emerald-950/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center space-x-1 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        <span>Core State machine validated</span>
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[10px] text-sky-400 overflow-x-auto max-h-[170px] overflow-y-auto leading-relaxed tab-size-2 max-w-full">
                      <pre>
{`{
  "headline": "${displayDisruption.headline}",
  "category": "${displayDisruption.category}",
  "severity": "${displayDisruption.severity}",
  "probability": ${displayDisruption.probability},
  "affectedNodes": ${JSON.stringify(displayDisruption.affectedNodes)},
  "impactMetrics": {
    "inventoryDrawdownPct": ${displayDisruption.impactInventory},
    "costSurgePct": +${displayDisruption.impactCost}
  }
}`}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Stepper controls footer */}
            <div className="mt-5 pt-3.5 border-t border-slate-850 flex items-center justify-between font-mono text-[9px] text-slate-500">
              <span>INFERENCE COMPLETE — COMPLIANCE ASSURED</span>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  disabled={activeStep === 1}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 hover:text-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
                  disabled={activeStep === 4}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-[10px] uppercase tracking-wider disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
