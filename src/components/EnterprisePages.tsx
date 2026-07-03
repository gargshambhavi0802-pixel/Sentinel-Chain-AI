import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, Globe, Flame, Ship, Factory, Lightbulb, BarChart3, Mic, BellRing, Settings,
  Play, Pause, ChevronRight, AlertTriangle, ShieldCheck, Key, Compass, ArrowUp, 
  RefreshCw, Layers, TrendingUp, Cpu, User, Users, Lock, Anchor, Clock, 
  CheckSquare, Search, Sparkles, Terminal, Database, Zap, FileText, AlertCircle, Check
} from "lucide-react";
import { IAMRole, Disruption } from "../types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

// ----------------------------------------------------------------------
// 1. DASHBOARD OVERVIEW
// ----------------------------------------------------------------------
interface DashboardOverviewProps {
  activeRole: IAMRole;
  onNavigate: (section: string) => void;
  isAnalyzing: boolean;
  activeDisruption: Disruption | null;
  pipelineStep: string;
}

export function DashboardOverview({ activeRole, onNavigate, isAnalyzing, activeDisruption, pipelineStep }: DashboardOverviewProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  const kpis = [
    { label: "Aggregate Risk Score", value: "3.4 / 10", desc: "Low Volatility Peak", trend: "-0.4%", icon: ShieldCheck, color: "text-emerald-400" },
    { label: "Active Tracked Routes", value: "148 Corridor Lines", desc: "8 Critical Ports Syncing", trend: "Stable", icon: Compass, color: "text-sky-400" },
    { label: "Saved Outage Costs", value: "$1.84M USD", desc: "AI Pre-emptive rerouting", trend: "+$240k", icon: TrendingUp, color: "text-amber-400" },
    { label: "Cognito User Session", value: "Active Token", desc: activeRole.title, trend: "Secure", icon: Key, color: "text-purple-400" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Command Control Hub</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">
            SentinelChain Sentinel-Core Dashboard
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 max-w-xl leading-relaxed">
            Autonomous threat detection, supplier vulnerability indexing, and Bedrock-powered mitigation.
          </p>
        </div>
        <div className="bg-slate-950/80 border border-slate-850 p-3.5 rounded-xl font-mono text-right shrink-0">
          <div className="text-[10px] text-slate-500 uppercase">SYS_TIME (UTC)</div>
          <div className="text-sm font-bold text-sky-400">{currentTime || "00:00:00"}</div>
          <div className="text-[8px] text-emerald-500 mt-1 uppercase flex items-center justify-end space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Online</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 text-left flex flex-col justify-between min-h-[110px]">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider max-w-[140px] leading-tight">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color} shrink-0`} />
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold text-slate-200 tracking-tight">{kpi.value}</div>
                <div className="flex justify-between items-center mt-1 text-[9px] font-mono">
                  <span className="text-slate-400">{kpi.desc}</span>
                  <span className={kpi.trend.startsWith("-") || kpi.trend.startsWith("+") ? "text-emerald-400 font-semibold" : "text-slate-500"}>{kpi.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Interactive Panel (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/85 backdrop-blur-xl rounded-2xl p-5 text-left flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">Core Workflows</span>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Supply Chain Action Hub</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Deploy machine learning parameters to isolate global logistics friction. Select a node to command operations.
            </p>
          </div>

          {/* Quick Navigate Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div 
              onClick={() => onNavigate("live-risk-map")}
              className="bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-sky-500/40 transition-all p-3.5 rounded-xl cursor-pointer group text-left"
            >
              <div className="flex items-center space-x-2 text-sky-400 mb-1.5">
                <Globe className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold uppercase">Geospatial Risk Map</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                Observe live ocean corridors, weather disruptions, and harbor coordinate delays.
              </p>
            </div>

            <div 
              onClick={() => onNavigate("active-disruptions")}
              className="bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-red-500/40 transition-all p-3.5 rounded-xl cursor-pointer group text-left"
            >
              <div className="flex items-center space-x-2 text-red-400 mb-1.5">
                <Flame className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold uppercase">Active Threat Feed</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                Manually trigger custom simulated logistics shocks, and run NLP extractors.
              </p>
            </div>

            <div 
              onClick={() => onNavigate("recovery-actions")}
              className="bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-emerald-500/40 transition-all p-3.5 rounded-xl cursor-pointer group text-left"
            >
              <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
                <Lightbulb className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold uppercase">AI Playbooks</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                Inspect Bedrock multi-agent recommended mitigation plans and activate suppliers.
              </p>
            </div>

            <div 
              onClick={() => onNavigate("business-impact")}
              className="bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-amber-500/40 transition-all p-3.5 rounded-xl cursor-pointer group text-left"
            >
              <div className="flex items-center space-x-2 text-amber-400 mb-1.5">
                <BarChart3 className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold uppercase">Impact Metrics</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                Analyze total financial cost exposures, SLA decay percentages, and buffer charts.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-850 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>COGNITO IDENTITY SERVICE v2.0</span>
            <span className="text-sky-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FedRAMP Compliance Certified</span>
            </span>
          </div>
        </div>

        {/* Right Console Pipeline (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/85 border border-slate-800/80 rounded-2xl p-5 text-left flex flex-col justify-between">
          <div className="space-y-1 mb-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">Live Ingestion pipeline</span>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">System Signal Handshakes</h3>
          </div>

          <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 flex-1 flex flex-col justify-center relative overflow-hidden min-h-[220px]">
            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
                  <span className="text-xs font-mono text-sky-400 animate-pulse uppercase font-semibold">AI Ingestion Running</span>
                </div>
                <div className="text-center font-mono text-[10px] text-slate-400 bg-slate-900/40 p-3 rounded-lg border border-slate-850">
                  <div className="text-[8px] text-slate-500 uppercase">CURRENT STAGE: {pipelineStep.toUpperCase()}</div>
                  <p className="mt-1 text-slate-300">Classifying raw JSON feeds inside secure VPC S3 instances...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-sky-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div className="max-w-[200px] mx-auto">
                  <span className="text-xs font-mono text-slate-300 uppercase font-semibold">VPC Buffer Standby</span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Awaiting manual signal disruption trigger inside Incidents Console.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-850/60 pt-3 mt-4 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>STATUS: S3_IDLE_BURST</span>
            <span>SECURE AES_256</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. SHIPMENTS — LIVE SHIPMENT TRACKING
// ----------------------------------------------------------------------
export function LiveShipmentTracking() {
  const [search, setSearch] = useState("");
  const shipments = [
    { id: "SNT-9082", vessel: "Maersk Horizon", carrier: "APM-Maersk", route: "Suez -> Rotterdam Corridor", cargo: "Microchips & ASIC Boards", eta: "July 12, 2026", status: "Transit", delay: "None" },
    { id: "SNT-1102", vessel: "COSCO Nebula", carrier: "COSCO Group", route: "Shanghai -> Los Angeles", cargo: "Battery Packs & Gels", eta: "July 22, 2026", status: "Delayed", delay: "+10 Days" },
    { id: "SNT-4482", vessel: "Ever Albatross", carrier: "Evergreen Marine", route: "Panama Transit Corridor", cargo: "Automotive Steel Substrates", eta: "July 15, 2026", status: "Transit", delay: "None" },
    { id: "SNT-3304", vessel: "CMA CGM Aquila", carrier: "CMA CGM", route: "Suez -> Rotterdam Corridor", cargo: "Tier-2 Polymer Compounds", eta: "July 28, 2026", status: "Delayed", delay: "+12 Days" },
    { id: "SNT-7721", vessel: "One Crane", carrier: "Ocean Network Express", route: "Yokohama -> Seattle Dock", cargo: "Precision Tooling Die Sets", eta: "July 19, 2026", status: "Transit", delay: "None" }
  ];

  const filtered = shipments.filter(s => 
    s.id.toLowerCase().includes(search.toLowerCase()) || 
    s.vessel.toLowerCase().includes(search.toLowerCase()) ||
    s.cargo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Logistics Matrix</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Live Cargo Shipment Tracking</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Monitor trans-ocean cargo liners. Integrated with real-time AIS transponder networks to provide telemetry overlays, speed statistics, and immediate risk-exposure warnings.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by vessel, cargo, shipment ID..." 
              className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/10 font-mono"
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">{filtered.length} Shipments Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Shipment ID</th>
                <th className="py-2.5 px-3">Ocean Vessel</th>
                <th className="py-2.5 px-3">Transit Route</th>
                <th className="py-2.5 px-3">Manifest Cargo</th>
                <th className="py-2.5 px-3">Expected ETA</th>
                <th className="py-2.5 px-3">SLA Delay</th>
                <th className="py-2.5 px-3 text-right">Route Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50">
              {filtered.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-sky-400 font-semibold">{s.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{s.vessel}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{s.carrier}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{s.route}</td>
                  <td className="py-3 px-3 text-slate-400">{s.cargo}</td>
                  <td className="py-3 px-3 text-slate-300">{s.eta}</td>
                  <td className="py-3 px-3 font-mono">
                    <span className={s.delay === "None" ? "text-slate-500" : "text-red-400 font-bold"}>
                      {s.delay}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center ${
                      s.status === "Transit" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      <span className={`w-1 h-1 rounded-full mr-1.5 ${s.status === "Transit" ? "bg-emerald-400" : "bg-red-400 animate-pulse"}`} />
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. SHIPMENTS — DELAYED SHIPMENTS
// ----------------------------------------------------------------------
interface DelayedShipmentsProps {
  onNavigate: (section: string) => void;
}

export function DelayedShipments({ onNavigate }: DelayedShipmentsProps) {
  const delays = [
    { id: "SNT-1102", vessel: "COSCO Nebula", carrier: "COSCO Group", route: "Shanghai -> Los Angeles", cargo: "Battery Packs & Gels", eta: "July 22, 2026", cost: "$480,000", delay: "Dockworker strike at Los Angeles", risk: "Critical" },
    { id: "SNT-3304", vessel: "CMA CGM Aquila", carrier: "CMA CGM", route: "Suez -> Rotterdam Corridor", cargo: "Tier-2 Polymer Compounds", eta: "July 28, 2026", cost: "$210,000", delay: "Suez corridor container grounding delay", risk: "High" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-red-400 uppercase tracking-widest block mb-1">SLA Disruptions</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Delayed Ocean Shipments</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          The following transport routes currently exceed SLA parameters. Activate the cognitive AI recommendation playbook to initiate standby alternative hubs and protect supply continuity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {delays.map((d, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-red-500/20 hover:border-red-500/30 transition-all rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase">{d.id} • {d.carrier}</span>
                <h3 className="text-base font-bold text-slate-200 mt-1">{d.vessel}</h3>
              </div>
              <span className="text-[8.5px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded uppercase">
                {d.risk} Risk
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-850 pb-1 text-slate-400">
                <span>Cargo:</span>
                <span className="text-slate-200 font-sans">{d.cargo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-1 text-slate-400">
                <span>SLA Delay Factor:</span>
                <span className="text-red-400 font-bold">{d.delay}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-1 text-slate-400">
                <span>Direct Est. Losses:</span>
                <span className="text-amber-400 font-bold">{d.cost} USD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Expected Arrival:</span>
                <span className="text-slate-300">{d.eta}</span>
              </div>
            </div>

            <button 
              onClick={() => onNavigate("recovery-actions")}
              className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Initiate AI Mitigation</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. SUPPLIERS — SUPPLIER HEALTH
// ----------------------------------------------------------------------
export function SupplierHealth() {
  const suppliers = [
    { name: "Taiwan Micro-Semi Corp", region: "Hsinchu, Taiwan", category: "Microcontrollers", status: "Critical", score: "42%", leadTime: "+18 days", safetyStock: "14 days", backup: "Vietnam Assembly Facility B" },
    { name: "Suez Freight Logistics Ltd", region: "Port Said, Egypt", category: "Maritime Carrier", status: "Critical", score: "25%", leadTime: "+14 days", safetyStock: "3 days", backup: "Cape of Good Hope Route" },
    { name: "Rotterdam Stevedoring", region: "Rotterdam, NL", category: "Harbor Loading", status: "Stable", score: "98%", leadTime: "Normal", safetyStock: "45 days", backup: "Standby Carrier Pool Delta" },
    { name: "Euro-Chemicals Gmbh", region: "Ludwigshafen, Germany", category: "Chemical Solvents", status: "Warning", score: "74%", leadTime: "+4 days", safetyStock: "22 days", backup: "Sourcing Alternative USA" },
    { name: "Nippon Glass Fabricators", region: "Kyoto, Japan", category: "Substrates", status: "Stable", score: "96%", leadTime: "Normal", safetyStock: "30 days", backup: "Kyushu Mainland Plant" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Vulnerability Registry</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Supplier Health Dashboard</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Monitor manufacturing capacities, lead-time deviations, and security assessment compliance across Tier-1 and Tier-2 supply nodes.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Supplier Facility</th>
                <th className="py-2.5 px-3">Category Group</th>
                <th className="py-2.5 px-3">Safety Index</th>
                <th className="py-2.5 px-3">Lead Deviation</th>
                <th className="py-2.5 px-3">On-Hand Stock</th>
                <th className="py-2.5 px-3">Backup Node</th>
                <th className="py-2.5 px-3 text-right">Status State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50">
              {suppliers.map((s, idx) => {
                let statusColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                let dotColor = "bg-emerald-400";
                if (s.status === "Critical") {
                  statusColor = "bg-red-500/10 text-red-400 border border-red-500/20";
                  dotColor = "bg-red-400 animate-pulse";
                } else if (s.status === "Warning") {
                  statusColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                  dotColor = "bg-amber-400";
                }

                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{s.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{s.region}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{s.category}</td>
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${s.status === "Critical" ? "bg-red-500" : s.status === "Warning" ? "bg-amber-500" : "bg-emerald-500"}`} 
                            style={{ width: s.score }}
                          />
                        </div>
                        <span className="text-slate-200 font-bold">{s.score}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{s.leadTime}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{s.safetyStock}</td>
                    <td className="py-3 px-3 italic text-slate-400 font-mono text-[10px]">{s.backup}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center ${statusColor}`}>
                        <span className={`w-1 h-1 rounded-full mr-1.5 ${dotColor}`} />
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. SUPPLIERS — ALTERNATIVE SUPPLIERS
// ----------------------------------------------------------------------
export function AlternativeSuppliers() {
  const backups = [
    { target: "Taiwan Micro-Semi Corp", backup: "Vietnam Assembly Facility B", region: "Hanoi, Vietnam", reliability: "92%", premium: "1.12x Cost", onboarding: "Ready", active: false },
    { target: "Suez Freight Logistics Ltd", backup: "Cape of Good Hope Overland route", region: "South Africa Bypass", reliability: "85%", premium: "1.35x Cost", onboarding: "Ready", active: false },
    { target: "Euro-Chemicals Gmbh", backup: "Sourcing Alternative USA", region: "Texas, USA", reliability: "94%", premium: "1.08x Cost", onboarding: "Pending Review", active: false }
  ];

  const [activeBackupStates, setActiveBackupStates] = useState<Record<number, boolean>>({});

  const handleActivate = (idx: number) => {
    setActiveBackupStates(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Standby Pool</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Alternative Suppliers Directory</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Pre-vetted redundancy contracts designed to bypass bottleneck areas. Standby nodes maintain passive data pipelines to absorb supply deviations instantly.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Impacted Original Node</th>
                <th className="py-2.5 px-3">standby redundant facility</th>
                <th className="py-2.5 px-3">Reliability Index</th>
                <th className="py-2.5 px-3">Cost Premium</th>
                <th className="py-2.5 px-3">Onboarding SLA</th>
                <th className="py-2.5 px-3 text-right">Contract Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50">
              {backups.map((b, idx) => {
                const isActive = activeBackupStates[idx] || false;
                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-red-400">{b.target}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{b.backup}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{b.region}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-sky-400">{b.reliability}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{b.premium}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{b.onboarding}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleActivate(idx)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center space-x-1.5 ml-auto cursor-pointer ${
                          isActive 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                            : "bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>ACTIVE STANDBY</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            <span>ACTIVATE STANDBY</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. AI RECOMMENDATIONS — ROUTE OPTIMIZATION
// ----------------------------------------------------------------------
export function RouteOptimization() {
  const [selectedBypass, setSelectedBypass] = useState<"cape" | "rail" | "seattle">("cape");

  const rerouteOptions = {
    cape: {
      title: "Cape of Good Hope Overland Bypass",
      details: "Divert raw shipments around the southern tip of Africa, bypassing Suez Canal gridlocks completely.",
      costMultiplier: "+1.35x Fuel Premium",
      transitDelta: "+12 Days deviation",
      slaAssurance: "98.2% Guaranteed Passage"
    },
    rail: {
      title: "Euro-Asian Intercontinental Rail",
      details: "Ingress cargo onto inland express railways at Shanghai hubs, routing directly through European logistic lines.",
      costMultiplier: "+2.10x High-Freight cost",
      transitDelta: "-4 Days speed gain",
      slaAssurance: "84.5% Ground clearance rate"
    },
    seattle: {
      title: "Pacific Northwest Rail Bridge",
      details: "Redirect marine vessels headed for Los Angeles terminals to Seattle/Tacoma harbors, transferring cargo to overland rail.",
      costMultiplier: "+1.15x Intermodal premium",
      transitDelta: "+3 Days deviation",
      slaAssurance: "99.1% Labor conflict safety"
    }
  };

  const current = rerouteOptions[selectedBypass];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Route Planner AI</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Interactive Route Optimization</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Simulate maritime detours to isolate shipping lines from regional conflicts or extreme weather typhoons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-start gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Select Bypass Corridor</span>
          <button
            onClick={() => setSelectedBypass("cape")}
            className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col ${
              selectedBypass === "cape" 
                ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold" 
                : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800"
            }`}
          >
            <span className="text-xs uppercase">Suez Bypass</span>
            <span className="text-[10px] font-mono text-slate-500 mt-1 font-normal">Cape of Good Hope Overland</span>
          </button>
          <button
            onClick={() => setSelectedBypass("rail")}
            className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col ${
              selectedBypass === "rail" 
                ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold" 
                : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800"
            }`}
          >
            <span className="text-xs uppercase">Inland Freight Bridge</span>
            <span className="text-[10px] font-mono text-slate-500 mt-1 font-normal">Euro-Asian Intercontinental Rail</span>
          </button>
          <button
            onClick={() => setSelectedBypass("seattle")}
            className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col ${
              selectedBypass === "seattle" 
                ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold" 
                : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800"
            }`}
          >
            <span className="text-xs uppercase">Los Angeles Strike Bypass</span>
            <span className="text-[10px] font-mono text-slate-500 mt-1 font-normal">Pacific Northwest Intermodal Bridge</span>
          </button>
        </div>

        <div className="md:col-span-8 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 text-left flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-mono text-sky-400 uppercase">ACTIVE SIMULATION</span>
              <h3 className="text-base font-bold text-slate-200 mt-1">{current.title}</h3>
              <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">{current.details}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-900/30 p-4 rounded-xl border border-slate-850">
              <div className="text-left font-mono">
                <span className="text-[8px] text-slate-500 uppercase block">Cost Multiplier</span>
                <span className="text-xs font-bold text-slate-300">{current.costMultiplier}</span>
              </div>
              <div className="text-left font-mono">
                <span className="text-[8px] text-slate-500 uppercase block">Transit Time</span>
                <span className="text-xs font-bold text-amber-500">{current.transitDelta}</span>
              </div>
              <div className="text-left font-mono">
                <span className="text-[8px] text-slate-500 uppercase block">SLA Assurance</span>
                <span className="text-xs font-bold text-emerald-400">{current.slaAssurance}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-850 mt-4 text-[9px] font-mono text-slate-500">
            <span>RECOMMENDED FOR HIGH VALUE DWELL CARGO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 7. AI RECOMMENDATIONS — INVENTORY SUGGESTIONS
// ----------------------------------------------------------------------
export function InventorySuggestions() {
  const suggestions = [
    { component: "ASIC Microcontrollers", current: "14 Days", recommended: "45 Days", adjustment: "+31 Days", cost: "+$24k Buffer Fee", status: "Depleted" },
    { component: "Lithium Solvent Gels", current: "22 Days", recommended: "35 Days", adjustment: "+13 Days", cost: "+$12k Buffer Fee", status: "Depleted" },
    { component: "Fiberglass Substrates", current: "30 Days", recommended: "30 Days", adjustment: "0 Days", cost: "No change", status: "Optimal" }
  ];

  const [approvedList, setApprovedList] = useState<Record<number, boolean>>({});

  const handleApprove = (idx: number) => {
    setApprovedList(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Stock Optimization</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">AI Inventory Suggestions</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Dynamic calculations to insulate your operations from sudden maritime gridlocks. Auto-adjust safety buffers based on regional shock probability.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Inventory Component</th>
                <th className="py-2.5 px-3">Current Stock</th>
                <th className="py-2.5 px-3">Recommended Buffer</th>
                <th className="py-2.5 px-3">Buffer Adjustment</th>
                <th className="py-2.5 px-3">Financial Cost</th>
                <th className="py-2.5 px-3">Stock State</th>
                <th className="py-2.5 px-3 text-right">Approve Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50">
              {suggestions.map((s, idx) => {
                const isApproved = approvedList[idx] || false;
                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-200">{s.component}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{s.current}</td>
                    <td className="py-3 px-3 font-mono font-bold text-sky-400">{s.recommended}</td>
                    <td className="py-3 px-3 font-mono text-amber-400">{s.adjustment}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{s.cost}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded uppercase ${
                        s.status === "Depleted" ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isApproved ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold inline-flex items-center">
                          <Check className="w-3.5 h-3.5 mr-1" /> Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApprove(idx)}
                          className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 font-mono text-[9.5px] font-bold uppercase transition-all cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 8. ANALYTICS — RISK TRENDS
// ----------------------------------------------------------------------
export function RiskTrends() {
  const trendData = [
    { month: "Jan", baseline: 25, current: 28 },
    { month: "Feb", baseline: 22, current: 34 },
    { month: "Mar", baseline: 30, current: 42 },
    { month: "Apr", baseline: 28, current: 64 },
    { month: "May", baseline: 35, current: 50 },
    { month: "Jun", baseline: 40, current: 38 }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Analytics Engine</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Risk Trends Volatility</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Supply chain volatility patterns over the previous 6 months. High-density signals are mapped to locate predictive anomalies.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 min-h-[300px] flex flex-col justify-between">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
              <Area type="monotone" dataKey="current" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCurrent)" name="Current Risk Coefficient" />
              <Line type="monotone" dataKey="baseline" stroke="#475569" strokeDasharray="5 5" name="Baseline Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-850 pt-3 mt-4">
          <span>MODEL: COGNITIVE_VOLATILITY_CHART_V1</span>
          <span>SLA RETENTION STATS ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 9. ANALYTICS — REPORTS
// ----------------------------------------------------------------------
export function Reports() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("Report compiled and ready for transport (JSON/CSV manifest simulation complete).");
    }, 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Corporate Exporter</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Generate Logistics Exposure Report</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Compile all active disruptions, supply chain health scores, alternate standby activations, and financial saved loss indices.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center space-x-2 text-sky-400">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wide">SentinelChain Executive Posture.pdf</span>
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Contains structured AWS Lambda log indexes, S3 ingress events, Bedrock token extractions, and regional hotspot coefficients formatted for executive presentations.
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[9px] text-slate-500 space-y-1">
            <div>SIZE: <span className="text-slate-300">4.82 MB</span></div>
            <div>COMPILATION STATUS: <span className="text-emerald-400">READY</span></div>
            <div>VPC HANDSHAKE: <span className="text-slate-300">SECURE COGNITO ENCRYPTED</span></div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-sky-950 disabled:text-sky-600 hover:scale-[1.02] text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shrink-0 cursor-pointer shadow-lg shadow-sky-500/10"
        >
          {downloading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Compiling Report...</span>
            </>
          ) : (
            <>
              <ArrowUp className="w-4 h-4 transform rotate-180" />
              <span>Download Executive PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 10. AI ASSISTANT — VOICE ASSISTANT
// ----------------------------------------------------------------------
export function VoiceAssistant() {
  const [isVocalizing, setIsVocalizing] = useState(false);
  const [lines, setLines] = useState<string[]>([
    "Initial connection made to Bedrock voice engine.",
    "Ready for verbal briefing mandate..."
  ]);

  const handleVerbalBriefing = () => {
    setIsVocalizing(true);
    setLines(prev => [...prev, "Vocalizing real-time regional threat briefing..."]);
    setTimeout(() => {
      setLines(prev => [...prev, "Suez Canal Corridor alert read out complete. Cape alternative active."]);
      setIsVocalizing(false);
    }, 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Verbal briefings</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Cognitive Voice Assistant</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Initiate synthetic vocal handshakes to broadcast operational threat summaries directly over harbor secure lines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="h-40 bg-slate-950 rounded-xl p-4 overflow-y-auto border border-slate-850 font-mono text-[10.5px] text-slate-400 space-y-2">
            {lines.map((l, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-sky-400 select-none">&gt;&gt;</span>
                <p>{l}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleVerbalBriefing}
              disabled={isVocalizing}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-sky-950 disabled:text-sky-600 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-sky-500/10"
            >
              <Mic className="w-4 h-4 shrink-0" />
              <span>{isVocalizing ? "Synthesizing..." : "Vocalize Briefing"}</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-left flex flex-col justify-between font-mono text-[10px]">
          <div className="space-y-3">
            <span className="text-slate-500 block uppercase">Synthesizer Core Specs</span>
            <div className="space-y-1 text-slate-300">
              <div>ENGINE: <span className="text-sky-400">BEDROCK_VOICE_v2</span></div>
              <div>LATENCY: <span className="text-slate-300">14 ms</span></div>
              <div>SSO: <span className="text-slate-300">ACTIVE IAM SESSION</span></div>
            </div>

            {/* Simulated audio waveform */}
            <div className="h-16 bg-slate-900/50 border border-slate-850 rounded-lg p-2 flex items-center justify-center">
              {isVocalizing ? (
                <div className="flex items-end space-x-1 h-10 w-full justify-center">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full bg-sky-400"
                      animate={{ height: ["10%", "95%", "10%"] }}
                      transition={{ repeat: Infinity, duration: Math.random() * 0.6 + 0.3, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-[1px] bg-slate-800 rounded" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 11. AI ASSISTANT — AI CHAT
// ----------------------------------------------------------------------
export function AiChat() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Greetings. I am Sentinel AI. How can I help secure your supply lines today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");

    setTimeout(() => {
      let reply = "I am processing that logistical parameter. Let's analyze risk indexes to suggest optimal backups.";
      if (userMsg.toLowerCase().includes("suez")) {
        reply = "Suez Canal Corridor is currently bottlenecked. Recommending immediate diversion via Cape of Good Hope, protecting SLA buffers.";
      } else if (userMsg.toLowerCase().includes("la") || userMsg.toLowerCase().includes("strike")) {
        reply = "Los Angeles Terminal labor strike is active. Suggesting dynamic freight redirection north to Seattle hubs.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Conversational AI</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Cognitive Logistics Chat</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Query the AI agent regarding active supply chain disruptions, dwell times, and recommended route parameters.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[420px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 custom-scrollbar">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col space-y-1 max-w-[80%] ${m.role === "user" ? "ml-auto text-right" : "mr-auto text-left"}`}
            >
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{m.role.toUpperCase()}</span>
              <div className={`p-3 rounded-2xl text-xs font-sans leading-relaxed ${
                m.role === "user" 
                  ? "bg-sky-500/10 text-sky-300 border border-sky-500/20 rounded-tr-none" 
                  : "bg-slate-950/80 text-slate-200 border border-slate-850 rounded-tl-none"
              }`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <div className="flex items-center space-x-2 border-t border-slate-850/60 pt-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Query about Suez bottlenecks, alternate routes, or safety stock guidelines..." 
            className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-2 px-4 text-xs text-slate-300 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/10 font-sans"
          />
          <button 
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-sky-500/10"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 12. SETTINGS — PROFILE
// ----------------------------------------------------------------------
interface ProfileProps {
  activeRole: IAMRole;
  onOpenAuth: () => void;
}

export function Profile({ activeRole, onOpenAuth }: ProfileProps) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Identity Access</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">My Profile Security</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          Verify active Single Sign-On session attributes, federated Amazon Cognito keys, and cryptographic role credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-850">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shadow-inner">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Cognito Federated Identity</span>
                <h3 className="text-base font-bold text-slate-200">{activeRole.title}</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-850 pb-1 text-slate-400">
                <span>Access Level Policy:</span>
                <span className="text-emerald-400 font-bold">{activeRole.type.toUpperCase()}_POLICY_ROLE</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-1 text-slate-400">
                <span>Session ID Key:</span>
                <span className="text-slate-300">sso-session-9082-aws-cognito</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-1 text-slate-400">
                <span>VPC Tunnel Routing:</span>
                <span className="text-slate-300">10.142.0.42 (Internal Gateway)</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-850 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span>Switch IAM / SSO Profiles</span>
          </button>
        </div>

        <div className="md:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-left flex flex-col justify-between font-mono text-[10px]">
          <div className="space-y-2.5">
            <span className="text-slate-500 block uppercase">Audit Compliance Log</span>
            <div className="bg-slate-900/50 p-3 rounded border border-slate-850 text-[9px] text-slate-400 space-y-1 h-36 overflow-y-auto">
              <div>[05:01:22] - Authorized session via Amazon Cognito</div>
              <div>[05:01:23] - Assumed role: {activeRole.title}</div>
              <div>[05:02:11] - Fetched encrypted telemetry buffer indices</div>
              <div>[05:02:42] - Verified IAM compliance signatures</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 13. SETTINGS — COGNITO LOGIN PLACEHOLDER
// ----------------------------------------------------------------------
interface CognitoLoginProps {
  onOpenAuth: () => void;
  activeRole: IAMRole;
}

export function CognitoLogin({ onOpenAuth, activeRole }: CognitoLoginProps) {
  const [cognitoUser, setCognitoUser] = useState<{ name: string; email: string; company: string; role: string } | null>(() => {
    const saved = localStorage.getItem("sentinel_cognito_session");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      <div className="border-b border-slate-800/60 pb-5">
        <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">User Pool Auth</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Amazon Cognito Login Settings</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
          SentinelChain relies on federated Amazon Cognito User Pools for SSO authorization, allowing role-based access control for security auditors, global operations coordinators, and solutions architects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wide">Cognito Federated SSO Session</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Your current federated session is fully authenticated via Cognito User Pool <span className="font-mono text-sky-400">us-east-1_SentChainUser</span>.
            </p>
            
            {cognitoUser && (
              <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-mono uppercase block text-[9px]">Authenticated User</span>
                  <span className="text-slate-200 font-semibold">{cognitoUser.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono uppercase block text-[9px]">Identity Pool Email</span>
                  <span className="text-slate-300 font-mono">{cognitoUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono uppercase block text-[9px]">Corporate Company</span>
                  <span className="text-slate-200">{cognitoUser.company}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono uppercase block text-[9px]">Assigned Cognito Role</span>
                  <span className="text-sky-400 font-mono font-semibold">{cognitoUser.role}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-850/65 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-[10px] text-slate-500 font-mono leading-tight">
              Active profile role assumed in AWS Security Token Service: <span className="text-sky-400 font-semibold">{activeRole.title}</span>.
            </p>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white text-[11px] font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shrink-0 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>STS Role Assumer</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 text-left flex flex-col justify-between font-mono text-[10px]">
          <div className="space-y-3">
            <span className="text-slate-500 block uppercase tracking-wider">Cognito STS Audit log</span>
            <div className="bg-slate-900/50 p-3 rounded border border-slate-850 text-[9px] text-slate-400 space-y-1.5 h-44 overflow-y-auto">
              <div>[05:01:22] - Cognito Session: init handshake</div>
              <div>[05:01:23] - Token verify: SUCCESS (JWT SHA-256)</div>
              {cognitoUser && (
                <>
                  <div>[05:01:24] - Subject: {cognitoUser.email}</div>
                  <div>[05:01:24] - Claims: group={cognitoUser.role}</div>
                </>
              )}
              <div>[05:01:25] - Assumed role: {activeRole.title}</div>
              <div>[05:02:11] - Fetched encrypted telemetry buffer</div>
              <div>[05:02:42] - Verified IAM compliance signatures</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
