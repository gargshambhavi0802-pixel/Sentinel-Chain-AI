import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingDown, TrendingUp, Clock, AlertCircle, 
  Calendar, RefreshCw, BarChart4, Sliders, ShieldCheck
} from "lucide-react";
import { Disruption } from "../types";

interface BusinessImpactProps {
  activeDisruption: Disruption | null;
}

type SimModel = "exponential" | "linear" | "mitigated";

export default function BusinessImpact({ activeDisruption }: BusinessImpactProps) {
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
  const [simModel, setSimModel] = useState<SimModel>("exponential");

  const displayDisruption: Disruption = activeDisruption || {
    headline: "Suez Canal Critical Transit Blockage",
    category: "Port",
    severity: "Critical",
    probability: 95,
    affectedNodes: ["Suez Canal Transit Corridor", "Rotterdam Entry Port", "Singapore Terminal Hub"],
    impactInventory: -40,
    impactDeliveries: "Severe backlog. Vessel queues exceeding 120 ships. Alternate Cape of Good Hope routing adds 10-14 days.",
    impactCost: 28,
    reasoning: [],
    recommendations: []
  };

  const inventoryValue = Math.abs(displayDisruption.impactInventory);
  const costValue = displayDisruption.impactCost;

  // Generate dynamic timelines depending on the selected simulation model
  const generateTimelineData = () => {
    const data = [];
    let stock = 100;
    let cost = 100;

    for (let day = 1; day <= 15; day++) {
      let multiplier = 1.0;
      if (simModel === "exponential") {
        multiplier = Math.pow(1.12, day / 2);
      } else if (simModel === "mitigated") {
        multiplier = Math.max(0.3, 1.2 - (day / 12));
      }

      const invDrawdownStep = (inventoryValue / 15) * multiplier * (1 + 0.08 * Math.sin(day));
      const costSurgeStep = (costValue / 15) * multiplier * (1 + 0.12 * Math.cos(day));
      
      stock = Math.max(8, Math.round(100 - (invDrawdownStep * day)));
      cost = Math.round(100 + (costSurgeStep * day));
      
      data.push({ day, stock, cost });
    }
    return data;
  };

  const timelineData = generateTimelineData();

  // SVG chart dimensions
  const width = 450;
  const height = 150;
  const padding = 25;

  const getCoordinates = (type: "stock" | "cost") => {
    const points: [number, number][] = [];
    const stepX = (width - padding * 2) / (timelineData.length - 1);
    
    timelineData.forEach((d, i) => {
      const x = padding + i * stepX;
      let y = padding;
      if (type === "stock") {
        y = height - padding - (d.stock / 100) * (height - padding * 2);
      } else {
        const maxCost = 160;
        const minCost = 80;
        const range = maxCost - minCost;
        y = height - padding - ((d.cost - minCost) / range) * (height - padding * 2);
      }
      points.push([x, y]);
    });
    return points;
  };

  const stockPoints = getCoordinates("stock");
  const costPoints = getCoordinates("cost");

  const createPathString = (points: [number, number][]) => {
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p[0]} ${p[1]}` : `${acc} L ${p[0]} ${p[1]}`;
    }, "");
  };

  const createAreaPathString = (points: [number, number][]) => {
    if (points.length === 0) return "";
    const startX = points[0][0];
    const endX = points[points.length - 1][0];
    const baselineY = height - padding;
    return `${createPathString(points)} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;
  };

  const isCriticalStockBreach = timelineData[timelineData.length - 1].stock < 25;

  return (
    <section
      id="business-impact"
      className="min-h-screen flex flex-col justify-start items-center px-4 sm:px-6 py-20 w-full"
    >
      <div className="w-full max-w-5xl">
        {/* Title / Controls Panel */}
        <div className="text-left mb-8 border-b border-slate-800/60 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Stage VI — Cascade Simulator</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Financial & Stock Impacts</h2>
            <p className="text-slate-400 text-xs mt-1.5 max-w-xl">
              Model immediate disruptions into physical and premium parameters. Toggle cognitive model modes to observe 15-day cascading trends.
            </p>
          </div>

          {/* Model toggles */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 self-end sm:self-auto">
            {(["exponential", "linear", "mitigated"] as SimModel[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSimModel(mode)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  simModel === mode 
                    ? "bg-slate-900 text-sky-400 border border-slate-800" 
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Key Performance Indicators (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 text-left">
          
          {/* Card 1: Safety Stock Drawdown */}
          <div className="bg-slate-900/45 border border-slate-800/80 rounded-2xl p-4.5 flex items-start space-x-4">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">STOCK BUFFER REDUCTION</span>
              <span className="text-xl font-bold font-mono text-red-400 block">
                {displayDisruption.impactInventory}%
              </span>
              <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                Warehouse inventory coverage is forecast to drop below threshold buffer limits by Day 15.
              </p>
            </div>
          </div>

          {/* Card 2: Cost surge */}
          <div className="bg-slate-900/45 border border-slate-800/80 rounded-2xl p-4.5 flex items-start space-x-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">LOGISTICS PREMIUM</span>
              <span className="text-xl font-bold font-mono text-amber-500 block">
                +{displayDisruption.impactCost}%
              </span>
              <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                Emergency spot rate premiums, detour fuel, and express demurrage fees inject unit carriage penalties.
              </p>
            </div>
          </div>

          {/* Card 3: Delivery Delay Scope */}
          <div className="bg-slate-900/45 border border-slate-800/80 rounded-2xl p-4.5 flex items-start space-x-4">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">TRANSIT DEVIATION</span>
              <span className="text-xs font-bold text-sky-300 block truncate max-w-full" title={displayDisruption.impactDeliveries}>
                {displayDisruption.impactDeliveries.split(".")[0]}.
              </span>
              <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans mt-0.5">
                Vessel dwell times spike, delaying Tier-1 assemblies and customer contract SLAs.
              </p>
            </div>
          </div>

        </div>

        {/* Twin Chart Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* Chart 1: Safety stock drawdown */}
          <div className="bg-slate-900/35 border border-slate-800/85 backdrop-blur-xl rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                15-Day Buffer Inventory Drain
              </span>
              {isCriticalStockBreach ? (
                <span className="text-[8.5px] font-mono text-red-400 uppercase flex items-center space-x-1 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>SLA BUFFER BREACHED</span>
                </span>
              ) : (
                <span className="text-[8.5px] font-mono text-emerald-400 uppercase flex items-center space-x-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>BUFFER SECURE</span>
                </span>
              )}
            </div>

            {/* Custom SVG Graph */}
            <div className="relative">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
                {/* Horizontal grids */}
                {[0, 25, 50, 75, 100].map((grid, index) => {
                  const y = height - padding - (grid / 100) * (height - padding * 2);
                  return (
                    <line
                      key={index}
                      x1={padding} y1={y} x2={width - padding} y2={y}
                      stroke="rgba(255, 255, 255, 0.04)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Shaded Area */}
                <path
                  d={createAreaPathString(stockPoints)}
                  fill="url(#stockAreaGradient)"
                  opacity="0.25"
                />

                {/* Highlight Path line */}
                <path
                  d={createPathString(stockPoints)}
                  stroke="#ef4444"
                  strokeWidth="2"
                  fill="none"
                />

                {/* Interactive Dot Triggers */}
                {stockPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt[0]} cy={pt[1]} r="3"
                    fill="#ef4444"
                    className="cursor-pointer transition-all hover:r-5"
                    onMouseEnter={() => setHoveredPointIdx(idx)}
                    onMouseLeave={() => setHoveredPointIdx(null)}
                  />
                ))}

                <defs>
                  <linearGradient id="stockAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating micro-legend tooltip */}
              <AnimatePresence>
                {hoveredPointIdx !== null && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[9px] font-mono text-slate-300 shadow-xl"
                  >
                    Day {timelineData[hoveredPointIdx].day}: Safety Stock at <span className="text-red-400 font-bold">{timelineData[hoveredPointIdx].stock}%</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-between font-mono text-[8.5px] text-slate-500 mt-2">
              <span>DAY 1</span>
              <span>DAY 8 (MID-POINT)</span>
              <span>DAY 15 (MAX OUT)</span>
            </div>
          </div>

          {/* Chart 2: Logistics overhead surge */}
          <div className="bg-slate-900/35 border border-slate-800/85 backdrop-blur-xl rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                15-Day Logistics Premium Surge
              </span>
              <span className="text-[8.5px] font-mono text-amber-400 uppercase flex items-center space-x-1 font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>OVERHEAD STRESS</span>
              </span>
            </div>

            {/* Custom SVG Graph */}
            <div className="relative">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
                {/* Horizontal grids */}
                {[0, 25, 50, 75, 100].map((grid, index) => {
                  const y = height - padding - (grid / 100) * (height - padding * 2);
                  return (
                    <line
                      key={index}
                      x1={padding} y1={y} x2={width - padding} y2={y}
                      stroke="rgba(255, 255, 255, 0.04)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Shaded Area */}
                <path
                  d={createAreaPathString(costPoints)}
                  fill="url(#costAreaGradient)"
                  opacity="0.25"
                />

                {/* Highlight Path line */}
                <path
                  d={createPathString(costPoints)}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  fill="none"
                />

                {/* Interactive Dot Triggers */}
                {costPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt[0]} cy={pt[1]} r="3"
                    fill="#f59e0b"
                    className="cursor-pointer transition-all hover:r-5"
                    onMouseEnter={() => setHoveredPointIdx(idx)}
                    onMouseLeave={() => setHoveredPointIdx(null)}
                  />
                ))}

                <defs>
                  <linearGradient id="costAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating micro-legend tooltip */}
              <AnimatePresence>
                {hoveredPointIdx !== null && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[9px] font-mono text-slate-300 shadow-xl"
                  >
                    Day {timelineData[hoveredPointIdx].day}: Cost Overhead Index <span className="text-amber-500 font-bold">{timelineData[hoveredPointIdx].cost}%</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-between font-mono text-[8.5px] text-slate-500 mt-2">
              <span>DAY 1</span>
              <span>DAY 8 (MID-POINT)</span>
              <span>DAY 15 (MAX OUT)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
