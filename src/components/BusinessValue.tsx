import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DollarSign, ShieldAlert, Zap, Globe, Target, BarChart2, Award, Calculator } from "lucide-react";

export default function BusinessValue() {
  const [annualSpend, setAnnualSpend] = useState(12.5); // Millions
  const [disruptionCount, setDisruptionCount] = useState(6); // per year

  // Dynamic calculations based on user input
  const baseLossPerDisruption = 1.25; // Millions
  const mitigationSavingsRatio = 0.88; // 88% reduction in losses
  
  const potentialTotalLosses = disruptionCount * baseLossPerDisruption;
  const savingsAverted = potentialTotalLosses * mitigationSavingsRatio;
  const netSaaSInvestment = 0.185; // $185k annual SaaS subscription
  const finalNetRoi = ((savingsAverted - netSaaSInvestment) / netSaaSInvestment * 100).toFixed(0);

  const valueMetrics = [
    {
      title: "Average Incident Response",
      before: "36.5 Hours",
      after: "12.8 Minutes",
      pct: 99.4,
      desc: "Real-time satellite ingestion bypasses legacy manual dispatch channels.",
      icon: Zap,
      color: "from-sky-500/20 to-sky-600/10 text-sky-400",
      preVal: 95,
      postVal: 5
    },
    {
      title: "Logistics Losses Avoided",
      before: "$1.4M / Anomaly",
      after: "$85K / Anomaly",
      pct: 93.9,
      desc: "Early diversion prevents premium spot air-charter surcharges.",
      icon: DollarSign,
      color: "from-emerald-500/20 to-emerald-600/10 text-emerald-400",
      preVal: 93,
      postVal: 12
    },
    {
      title: "Customer SLA Preservation",
      before: "88.2% Fill-Rate",
      after: "99.82% Fill-Rate",
      pct: 13.1,
      desc: "Active inventory buffers insulate assembly plants from transit shocks.",
      icon: Target,
      color: "from-indigo-500/20 to-indigo-600/10 text-indigo-400",
      preVal: 12,
      postVal: 99
    }
  ];

  return (
    <section
      id="business-value"
      className="min-h-screen flex flex-col justify-start items-center px-4 sm:px-6 py-20 w-full"
    >
      <div className="w-full max-w-5xl">
        {/* Title */}
        <div className="text-left mb-8 border-b border-slate-800/60 pb-5">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Stage IX — Business Impact Metrics</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Enterprise Commercial Value</h2>
          <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
            SentinelChain AI reduces risk into measurable balance sheet savings. Tune the logistics budget parameters below to view custom commercial ROI profiles.
          </p>
        </div>

        {/* Interactive ROI Calculator Widget */}
        <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-5 mb-8 text-left grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-850 pb-2">
              <Calculator className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">ROI Simulator Panel</span>
            </div>

            {/* Slider 1: annual logistics budget */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-400 uppercase">ANNUAL LOGISTICS BUDGET:</span>
                <span className="text-sky-400 font-bold">${annualSpend}M USD</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="100" 
                step="0.5"
                value={annualSpend} 
                onChange={(e) => setAnnualSpend(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* Slider 2: major disruptions per year */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-400 uppercase">EXPECTED INCIDENTS / YEAR:</span>
                <span className="text-amber-400 font-bold">{disruptionCount} DISRUPTIONS</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="24" 
                value={disruptionCount} 
                onChange={(e) => setDisruptionCount(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950 rounded-xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-5 border border-slate-850">
            <div className="text-left space-y-3 flex-1">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Estimated Annual Savings (Net)</span>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono block">
                  ${(savingsAverted - netSaaSInvestment).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-400 font-sans block">
                  Averting up to <strong className="text-slate-200">${savingsAverted.toFixed(2)}M</strong> in total contingency losses.
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-slate-850 pt-3 sm:pt-0 sm:pl-5 flex flex-row sm:flex-col justify-between sm:justify-center gap-3 font-mono text-xs">
              <div className="text-left">
                <span className="text-[8.5px] text-slate-500 block uppercase">SaaS Payback Ratio:</span>
                <span className="text-sky-400 font-bold text-lg">{finalNetRoi}% ROI</span>
              </div>
              <div className="text-left">
                <span className="text-[8.5px] text-slate-500 block uppercase">SLA Fill-Rate:</span>
                <span className="text-slate-200 font-bold">99.82% Target</span>
              </div>
            </div>
          </div>

        </div>

        {/* Comparison KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {valueMetrics.map((met, index) => {
            const Icon = met.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/30 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-800 hover:bg-slate-900/50"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-8.5 h-8.5 rounded-lg bg-gradient-to-tr ${met.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/15 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      -{met.pct}% Delta
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      {met.title}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed">
                      {met.desc}
                    </p>
                  </div>
                </div>

                {/* Horizontal Comparison Line Bar */}
                <div className="mt-5 pt-4 border-t border-slate-850/60 space-y-2.5 font-mono text-[9px]">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">PRE-SENTINEL:</span>
                      <span className="text-red-400 font-bold">{met.before}</span>
                    </div>
                    <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400/80" style={{ width: `${met.preVal}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">POST-SENTINEL:</span>
                      <span className="text-emerald-400 font-bold">{met.after}</span>
                    </div>
                    <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${met.postVal}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate Certification Seal block */}
        <div className="mt-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 text-left">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                ISO 27001 & SOC-2 Certified AI Infrastructure
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-xl font-sans leading-relaxed">
                Our services undergo rigorous auditing procedures matching federal supply standards. All Bedrock connections operate within secure VPC endpoints protecting trade telemetry.
              </p>
            </div>
          </div>
          
          <div className="text-[8.5px] font-mono text-slate-500 text-right shrink-0 uppercase tracking-wider leading-relaxed border-t md:border-t-0 md:border-l border-slate-850/60 pt-3 md:pt-0 md:pl-5">
            <div>AUDITOR ID: SG-995C</div>
            <div>VERIFIED COMPLIANCE: FULL DOMAIN</div>
            <div>SLA GUARANTEED: 99.98% CORE uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}
