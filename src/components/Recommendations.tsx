import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckSquare, ArrowUpRight, DollarSign, Activity, 
  Play, CloudLightning, RefreshCw, Check, Sliders, ShieldCheck,
  Calendar, Award
} from "lucide-react";
import { Disruption, Recommendation } from "../types";

interface RecommendationsProps {
  activeDisruption: Disruption | null;
  onDeploySuccess: (reductionValue: number) => void;
}

export default function Recommendations({ activeDisruption, onDeploySuccess }: RecommendationsProps) {
  const [deployedPlaybooks, setDeployedPlaybooks] = useState<string[]>([]);
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [transitSpeedBuffer, setTransitSpeedBuffer] = useState(85); // Interactive slide parameter
  const [budgetCap, setBudgetCap] = useState(120); // Interactive slide parameter

  const displayDisruption: Disruption = activeDisruption || {
    headline: "Suez Canal Critical Transit Blockage",
    category: "Port",
    severity: "Critical",
    probability: 95,
    affectedNodes: ["Suez Canal Transit Corridor"],
    impactInventory: -40,
    impactDeliveries: "Alternate Cape of Good Hope routing adds 10-14 days.",
    impactCost: 28,
    reasoning: [],
    recommendations: [
      {
        title: "Cape of Good Hope Maritime Reroute",
        reduction: 60,
        cost: "$$$ High",
        description: "Re-manifest all inbound container vessels around South Africa. Secures absolute arrival timelines, bypassing Suez maritime gridlock."
      },
      {
        title: "Intercontinental Rail Pivot",
        reduction: 45,
        cost: "$$ Medium",
        description: "Reroute premium components via Central Asian dry rails. Avoids maritime delays entirely, delivering assemblies to central hubs in 10 days."
      }
    ]
  };

  const handleDeployPlaybook = (title: string, reduction: number) => {
    if (deployedPlaybooks.includes(title)) return;
    
    setDeployingId(title);
    
    // Simulate AWS cloud infrastructure dispatcher trigger
    setTimeout(() => {
      setDeployedPlaybooks(prev => [...prev, title]);
      setDeployingId(null);
      // Adjust reduction dynamically based on our interactive speed buffer modifiers
      const customizedReduction = Math.round(reduction * (transitSpeedBuffer / 100));
      onDeploySuccess(customizedReduction);
    }, 1200);
  };

  return (
    <section
      id="recommendations"
      className="min-h-screen flex flex-col justify-start items-center px-4 sm:px-6 py-20 w-full"
    >
      <div className="w-full max-w-5xl">
        {/* Title */}
        <div className="text-left mb-8 border-b border-slate-800/60 pb-5">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Stage VII — Operational Playbooks</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Mitigation Planner & Dispatch</h2>
          <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
            SentinelChain AI evaluates alternative logistics pipelines. Review alternative routing configurations, customize speed/budget limits, and dispatch secure actions directly to third-party providers.
          </p>
        </div>

        {/* Interactive Playbook Fine-Tuner HUD (Dual Slider Console) */}
        <div className="bg-slate-900/35 border border-slate-850 rounded-2xl p-4.5 mb-6 text-left grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          <div className="md:col-span-4 space-y-1">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Mitigation Controls HUD</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
              Tune transit speed targets and allocation caps. Mitigation calculations adapt dynamically prior to execution.
            </p>
          </div>

          {/* Slider 1: Speed Buffer */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-400 uppercase">TRANSIT ACCELERATION TOLERANCE:</span>
              <span className="text-sky-400 font-bold">{transitSpeedBuffer}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="120" 
              value={transitSpeedBuffer} 
              onChange={(e) => setTransitSpeedBuffer(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Slider 2: Budget Cap */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-400 uppercase">EMERGENCY ALLOCATION LIMIT:</span>
              <span className="text-amber-400 font-bold">${budgetCap}k SPOT CAP</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="300" 
              value={budgetCap} 
              onChange={(e) => setBudgetCap(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

        </div>

        {/* Playbooks recommendations card grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {displayDisruption.recommendations.map((play, index) => {
            const isDeployed = deployedPlaybooks.includes(play.title);
            const isDeploying = deployingId === play.title;
            // Calculate dynamic customized reduction value
            const customizedReduction = Math.round(play.reduction * (transitSpeedBuffer / 100));

            return (
              <div
                key={index}
                className={`bg-slate-900/30 border rounded-2xl p-5 text-left flex flex-col justify-between transition-all ${
                  isDeployed
                    ? "border-emerald-500/50 bg-emerald-950/5 shadow-md shadow-emerald-950/10"
                    : "border-slate-850 hover:border-slate-800 hover:bg-slate-900/60"
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between border-b border-slate-850/60 pb-2.5">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                        {play.title}
                      </h4>
                      <div className="flex items-center space-x-2.5 font-mono text-[9px]">
                        <span className="flex items-center text-emerald-400 font-bold">
                          <Activity className="w-3.5 h-3.5 mr-1" />
                          Risk Offset: -{customizedReduction}%
                        </span>
                        <span className="text-slate-500">• Budget Cost: {play.cost}</span>
                      </div>
                    </div>
                    
                    <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-850 text-sky-400 flex items-center justify-center text-[10px] font-mono">
                      0{index + 1}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans min-h-[50px]">
                    {play.description}
                  </p>
                </div>

                {/* Footer dispatch actions */}
                <div className="mt-5 pt-3.5 border-t border-slate-850/60 flex items-center justify-between">
                  <div className="text-[8.5px] font-mono text-slate-500">
                    {isDeployed ? (
                      <span className="text-emerald-400 font-bold uppercase">ACTIVE: SECURED LOCKS</span>
                    ) : (
                      <span>STANDBY LOGISTICS RE-ROUTE</span>
                    )}
                    <span className="block mt-0.5">TARGET API: COURIER_GATE_0x71</span>
                  </div>

                  <button
                    onClick={() => handleDeployPlaybook(play.title, play.reduction)}
                    disabled={isDeployed || isDeploying}
                    className={`px-4 py-2 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
                      isDeployed
                        ? "bg-emerald-950/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md"
                    }`}
                  >
                    {isDeploying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Deploying...</span>
                      </>
                    ) : isDeployed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Enforced</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Enforce Playbook</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dispatch Compliance Logs summary Console */}
        <div className="mt-6 bg-slate-950/80 border border-slate-850 rounded-2xl p-4.5 text-left font-mono text-[9px] w-full">
          <div className="flex items-center space-x-2 text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-900 pb-2">
            <CloudLightning className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">Cryptographic Action Ledger (S3 Secure Vault)</span>
          </div>
          
          <div className="space-y-1.5 text-slate-500 leading-relaxed">
            <div>[ST-LOG] System sync verified. Connection pool with third-party carriers is active.</div>
            {deployedPlaybooks.length > 0 ? (
              deployedPlaybooks.map((p, idx) => {
                const customizedReduction = Math.round(
                  (displayDisruption.recommendations.find(r => r.title === p)?.reduction || 50) * (transitSpeedBuffer / 100)
                );
                return (
                  <div key={idx} className="text-emerald-400">
                    [STS-DISPATCH] SHA-256 Auth Signature: <span className="text-slate-400">0x9B1C...FF82</span> | Deployed Playbook: &apos;{p}&apos;. Offset parameter: -{customizedReduction}% risk. Transmitted signed carrier mandate.
                  </div>
                );
              })
            ) : (
              <div>[ST-LOG] Status standby. Customize parameters and select a playbook above to dispatch secure carrier directions.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
