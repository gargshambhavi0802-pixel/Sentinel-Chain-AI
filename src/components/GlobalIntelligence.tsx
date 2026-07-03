import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, ShieldAlert, ArrowDown, Key, Volume2, 
  VolumeX, Play, RotateCcw, Building2, Package, 
  CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle,
  TrendingDown, TrendingUp
} from "lucide-react";
import { IAMRole } from "../types";

interface GlobalIntelligenceProps {
  activeRole: IAMRole;
  onOpenAuth: () => void;
  onExplore: () => void;
  mode?: "all" | "map" | "feed";
}

interface SupplierInsight {
  name: string;
  category: string;
  material: string;
  exposure: "Critical" | "High" | "Medium" | "Low";
  safetyStock: number; // days
  alternativeSource: string;
  status: "Active" | "Bottlenecked" | "Standby";
}

export default function GlobalIntelligence({ activeRole, onOpenAuth, onExplore, mode = "all" }: GlobalIntelligenceProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<string>("Suez Canal Corridor");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [speechTimer, setSpeechTimer] = useState<number>(0);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const stats = [
    { label: "Global Nodes Monitored", value: "24,815", change: "Continuous Scan", color: "text-sky-400" },
    { label: "Global Risk Coefficient", value: "1.42", change: "Safe / Low", color: "text-emerald-400" },
    { label: "Active Regional Anomalies", value: "4 Nodes", change: "Mitigations Live", color: "text-amber-500" },
    { label: "Bedrock Engine SLA", value: "99.992%", change: "12ms Ingress", color: "text-purple-400" },
  ];

  const criticalHotspots = [
    { id: "suez", name: "Suez Canal Corridor", status: "WARN", details: "Congestion backlog. Vessel density +18%. Expected delays: 10-14 days.", coords: { x: 55, y: 38 }, traffic: "32 vessels/hr", risk: "High" },
    { id: "shanghai", name: "Shanghai Terminal Complex", status: "STABLE", details: "Operating at peak berth throughput. Smooth custom clearances.", coords: { x: 78, y: 40 }, traffic: "64 vessels/hr", risk: "Low" },
    { id: "la", name: "Los Angeles Terminal", status: "CRITICAL", details: "Labor strike dispute. Gate flow -70%. Container dwell time: 11.2 days.", coords: { x: 20, y: 35 }, traffic: "8 vessels/hr", risk: "Critical" },
    { id: "panama", name: "Panama Canal Transit", status: "STABLE", details: "Water level constraints stabilized. Booking slots normal.", coords: { x: 32, y: 52 }, traffic: "18 vessels/hr", risk: "Low" },
  ];

  const supplierInsights: SupplierInsight[] = [
    { name: "Taiwan Micro-Semi Corp", category: "Electronics", material: "ASIC Micro-controllers", exposure: "High", safetyStock: 14, alternativeSource: "Vietnam Assembly Facility B", status: "Bottlenecked" },
    { name: "Suez Freight Logistics Ltd", category: "Carrier", material: "Ocean Cargo Transit", exposure: "Critical", safetyStock: 3, alternativeSource: "Cape of Good Hope Overland route", status: "Bottlenecked" },
    { name: "Rotterdam Stevedoring", category: "Stevedoring", material: "Container Cranes Cap.", exposure: "Low", safetyStock: 45, alternativeSource: "Standby Carrier Pool Delta", status: "Active" },
    { name: "Euro-Chemicals Gmbh", category: "Chemicals", material: "Lithium Solvent Gels", exposure: "Medium", safetyStock: 22, alternativeSource: "Sourcing Alternative USA", status: "Standby" },
    { name: "Nippon Glass Fabricators", category: "Industrial", material: "Fiberglass Substrates", exposure: "Low", safetyStock: 30, alternativeSource: "Kyushu Mainland Plant", status: "Active" }
  ];

  // Speech Briefing transcripts based on active hotspot
  const voiceBriefings: Record<string, string[]> = {
    "Suez Canal Corridor": [
      "Securing audio handshake with Sentinel AI voice module...",
      "ALERT: Suez Canal Transit Corridor reports critical bottlenecks due to container ship grounding.",
      "Cascading effects indicate Rotterdam and Singapore arrival times are delayed by 10 to 14 days.",
      "Recommendations generated. High priority: Initiate Cape of Good Hope rerouting immediately."
    ],
    "Shanghai Terminal Complex": [
      "Securing audio handshake with Sentinel AI voice module...",
      "Shanghai Terminal Complex status declared: STABLE.",
      "Vessel density at peak capacity with standard customs clearing lead-times of 24 hours.",
      "No mitigation action required. Continued monitoring in progress."
    ],
    "Los Angeles Terminal": [
      "Securing audio handshake with Sentinel AI voice module...",
      "CRITICAL: Union dockworker disputes have initiated immediate walkouts at LA terminal blocks.",
      "Container dwell rates are projecting to break 14 days. Safety stock buffers are entering depletion phases.",
      "Action recommended: Redirect incoming container shipments north to Seattle and Tacoma ports."
    ],
    "Panama Canal Transit": [
      "Securing audio handshake with Sentinel AI voice module...",
      "Panama Canal Transit remains STABLE.",
      "Water level regulations have stabilized daily booking transits to 24 hulls.",
      "Standby alert state preserved for Central American supply lanes."
    ]
  };

  const activeSpeechLines = voiceBriefings[selectedHotspot] || voiceBriefings["Suez Canal Corridor"];

  useEffect(() => {
    let interval: any;
    if (isVoiceActive) {
      interval = setInterval(() => {
        setSpeechTimer(prev => {
          if (prev < activeSpeechLines.length - 1) {
            return prev + 1;
          } else {
            setIsVoiceActive(false);
            return 0;
          }
        });
      }, 4000);
    } else {
      setSpeechTimer(0);
    }
    return () => clearInterval(interval);
  }, [isVoiceActive, selectedHotspot]);

  const handleStartBriefing = () => {
    setIsVoiceActive(true);
    setSpeechTimer(0);
  };

  const handleStopBriefing = () => {
    setIsVoiceActive(false);
    setSpeechTimer(0);
  };

  const activeHotspotObj = criticalHotspots.find(h => h.name === selectedHotspot) || criticalHotspots[0];

  return (
    <section
      id="global-intelligence"
      className="relative min-h-screen flex flex-col justify-start items-center px-2 sm:px-6 py-16 text-left w-full"
    >
      {/* Top Welcome Indicator Dashboard Bar */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800/60 pb-5">
        <div className="flex items-center space-x-3">
          <div className="min-w-[40px] h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">THREAT MATRIX ACTIVE</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 uppercase font-sans">
              SentinelChain <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Command Center</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-lg flex items-center space-x-2 text-slate-400">
            <span>SSO Level:</span>
            <span className="text-sky-400 font-bold underline">{activeRole.title}</span>
          </div>

          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 text-slate-300 transition-all flex items-center space-x-2 cursor-pointer font-sans text-xs font-semibold"
          >
            <Key className="w-3.5 h-3.5 text-sky-400" />
            <span>Assumed IAM Profile</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map & Voice Assistant */}
      {(mode === "all" || mode === "map") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-5xl">
        
        {/* Left GIS Interactive Map Panel (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/85 backdrop-blur-xl rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">Geospatial GIS Threat Board</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Interactive Satellite Overlay</span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              Global Hotspots Tracking Map
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Select any pulsing target coordinate pin on the world grid below to focus telemetries, load risk indexes, and trigger vocalized operational briefs.
            </p>
          </div>

          {/* Map Representation SVG */}
          <div className="relative bg-slate-950/90 border border-slate-850 rounded-xl h-60 w-full overflow-hidden flex items-center justify-center p-2">
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(5,11,20,0.5)_0%,rgba(5,11,20,0.9)_100%] pointer-events-none" />
            
            {/* World Grid Lines Background */}
            <svg viewBox="0 0 100 60" className="w-full h-full opacity-40 stroke-slate-800/40 stroke-[0.2]" fill="none">
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 10} y1="0" x2={i * 10} y2="60" />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />
              ))}
            </svg>

            {/* Stylized continent vectors */}
            <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full opacity-[0.12]" fill="none" stroke="#1DE9B6" strokeWidth="0.5">
              {/* North America */}
              <path d="M 10,15 L 28,12 L 34,18 L 31,31 L 24,36 L 18,43 L 11,31 L 7,21 Z" />
              {/* South America */}
              <path d="M 24,44 L 31,50 L 34,66 L 27,83 L 21,60 Q 18,50 24,44 Z" />
              {/* Eurasia */}
              <path d="M 43,11 L 65,8 L 88,10 L 86,36 L 71,43 L 58,40 L 44,30 L 39,18 Z" />
              {/* Africa */}
              <path d="M 44,32 L 57,32 L 61,46 L 54,70 L 47,56 L 41,44 Z" />
              {/* Australia */}
              <path d="M 75,56 L 87,54 L 85,68 L 73,66 Z" />
            </svg>

            {/* Active connections between Hotspots */}
            <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full opacity-35" fill="none" stroke="rgba(29, 233, 182, 0.4)" strokeWidth="0.4" strokeDasharray="1,1">
              <path d="M 78,40 Q 66.5,39 55,38" /> {/* Shanghai -> Suez */}
              <path d="M 55,38 Q 50,30 45,22" /> {/* Suez -> Rotterdam */}
              <path d="M 20,35 Q 26,43.5 32,52" /> {/* LA -> Panama */}
              <path d="M 32,52 Q 43.5,45 55,38" /> {/* Panama -> Suez */}
            </svg>

            {/* Render interactive Hotspot Pins */}
            {criticalHotspots.map((hs) => {
              const isActive = selectedHotspot === hs.name;
              let pinColor = "bg-sky-400";
              let pinBorder = "border-sky-400/40";
              let pulseColor = "rgba(29, 233, 182, 0.4)";

              if (hs.status === "CRITICAL") {
                pinColor = "bg-red-400";
                pinBorder = "border-red-400/40";
                pulseColor = "rgba(255, 93, 115, 0.4)";
              } else if (hs.status === "WARN") {
                pinColor = "bg-amber-400";
                pinBorder = "border-amber-400/40";
                pulseColor = "rgba(244, 185, 66, 0.4)";
              }

              return (
                <button
                  key={hs.id}
                  onClick={() => {
                    setSelectedHotspot(hs.name);
                    setIsVoiceActive(false);
                  }}
                  className="absolute group/pin cursor-pointer"
                  style={{ left: `${hs.coords.x}%`, top: `${hs.coords.y}%` }}
                >
                  <span className="relative flex h-3.5 w-3.5">
                    {/* Pulsing halo */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: pulseColor }}></span>
                    {/* Center Core */}
                    <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border ${pinColor} ${pinBorder} ${isActive ? "scale-125 ring-2 ring-slate-100/50" : ""}`} />
                  </span>

                  {/* Tooltip on pin hover */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-[10px] text-slate-200 py-1 px-2.5 rounded shadow-xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-sans font-bold z-30">
                    {hs.name} ({hs.status})
                  </div>
                </button>
              );
            })}
          </div>

          {/* Focused Hotspot Telemetry Info Box */}
          <div className="mt-4 bg-slate-950/60 border border-slate-850 rounded-xl p-4">
            <div className="flex justify-between items-start border-b border-slate-850 pb-2 mb-3">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">CURRENT ACTIVE SECTOR FOCUS</span>
                <span className="text-xs font-bold text-slate-200 block uppercase">{activeHotspotObj.name}</span>
              </div>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                activeHotspotObj.status === "CRITICAL"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : activeHotspotObj.status === "WARN"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                {activeHotspotObj.status} STATUS
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {activeHotspotObj.details}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-850/60 font-mono text-[10px] text-slate-500">
              <div>
                <span>TRAFFIC DENSITY:</span>
                <span className="text-slate-300 block font-semibold">{activeHotspotObj.traffic}</span>
              </div>
              <div>
                <span>INCIDENT INDEX:</span>
                <span className="text-slate-300 block font-semibold">{activeHotspotObj.risk} SCALE</span>
              </div>
              <div>
                <span>COORDINATES:</span>
                <span className="text-sky-400 block font-semibold">{activeHotspotObj.coords.x}°N, {activeHotspotObj.coords.y}°W</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Sentinel Speech Voice Assistant Console (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/35 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold uppercase text-slate-200 tracking-wider">Sentinel AI Speech Briefing</span>
              </div>
              <div className="flex items-center space-x-1.5 font-mono text-[9px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span>VOICE COGNITIVE STREAM</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Deploying our custom LLM speech synthesizer models to extract structural supply-chain insights. Listen to real-time risk briefings.
            </p>

            {/* Interactive Audio Spectrum/Wave Visualizer */}
            <div className="h-28 bg-slate-950/80 border border-slate-850 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/20 to-indigo-950/10 pointer-events-none" />
              
              {isVoiceActive ? (
                /* Glowing Voice Waves */
                <div className="flex items-end justify-center h-12 space-x-1.5 w-full">
                  {Array.from({ length: 22 }).map((_, i) => {
                    const randomDelay = Math.random() * 1.5;
                    const duration = Math.random() * 0.8 + 0.4;
                    return (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-sky-500 to-indigo-400"
                        animate={{ height: ["10%", "95%", "10%"] }}
                        transition={{
                          repeat: Infinity,
                          duration,
                          delay: randomDelay,
                          ease: "easeInOut"
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                /* Flat/Silent Line */
                <div className="flex items-center justify-center h-12 w-full">
                  <div className="w-full max-w-[250px] h-[2px] bg-slate-800 rounded-full flex justify-between items-center relative">
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[8px] text-slate-500">
                      ||
                    </div>
                  </div>
                </div>
              )}

              {/* Speech transcript overlay */}
              <div className="text-center px-4 max-w-[280px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={speechTimer}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[11px] font-mono text-sky-400 truncate tracking-wide"
                  >
                    {isVoiceActive ? activeSpeechLines[speechTimer] : "Speech Briefing engine: STANDBY"}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Custom Interactive Controls */}
            <div className="flex items-center justify-center space-x-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              {isVoiceActive ? (
                <button
                  onClick={handleStopBriefing}
                  className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <VolumeX className="w-4 h-4" />
                  <span>Pause Briefing</span>
                </button>
              ) : (
                <button
                  onClick={handleStartBriefing}
                  className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md shadow-sky-500/10 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Vocalize Threat Briefing</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsVoiceActive(false);
                  setTimeout(() => {
                    setIsVoiceActive(true);
                    setSpeechTimer(0);
                  }, 200);
                }}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                title="Restart Audio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 leading-relaxed border-t border-slate-850/60 pt-4 mt-6">
            <span className="block text-[8px] uppercase tracking-widest text-slate-500">Bedrock Neural Voice Core</span>
            <span>Synthesizer Status: <span className="text-emerald-400">ONLINE (TTS_TLS_V2)</span></span>
          </div>
        </div>

      </div>
      )}

      {/* Supplier Insights Datatable Panel (Full Width) */}
      {(mode === "all" || mode === "feed") && (
        <div className="w-full max-w-5xl mt-6">
        <div className="bg-slate-900/40 border border-slate-800/85 backdrop-blur-xl rounded-2xl p-5 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3.5 mb-4">
            <div>
              <div className="flex items-center space-x-1.5 text-[9px] font-mono text-sky-400 uppercase tracking-widest mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Supplier Exposure & Material Flow Registry</span>
              </div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                Tier-1 & Tier-2 Supplier Insights
              </h3>
            </div>
            
            <div className="text-[9px] font-mono text-slate-500 uppercase flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>2 Bottleneck alerts active</span>
            </div>
          </div>

          {/* Supplier Grid table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Supplier Node</th>
                  <th className="py-2.5 px-3">Industry Cluster</th>
                  <th className="py-2.5 px-3">Primary Materials</th>
                  <th className="py-2.5 px-3">Stock Buffer</th>
                  <th className="py-2.5 px-3 text-center">Threat Index</th>
                  <th className="py-2.5 px-3">Alternative standby node</th>
                  <th className="py-2.5 px-3 text-right">Workflow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/50">
                {supplierInsights.map((sup, index) => {
                  let badgeCol = "text-sky-400 bg-sky-950/25 border-sky-500/10";
                  if (sup.exposure === "Critical") badgeCol = "text-red-400 bg-red-950/25 border-red-500/15";
                  if (sup.exposure === "High") badgeCol = "text-amber-400 bg-amber-950/25 border-amber-500/15";
                  
                  return (
                    <tr key={index} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-200">{sup.name}</td>
                      <td className="py-3 px-3 text-slate-400">{sup.category}</td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[10.5px]">{sup.material}</td>
                      <td className="py-3 px-3">
                        <span className={`font-mono font-bold ${sup.safetyStock < 10 ? "text-red-400" : "text-slate-300"}`}>
                          {sup.safetyStock} days
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold border px-1.5 py-0.5 rounded uppercase ${badgeCol}`}>
                          {sup.exposure}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 italic font-mono text-[10px]">{sup.alternativeSource}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-1 ${
                          sup.status === "Bottlenecked" 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                            : sup.status === "Standby"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          <span className={`w-1 h-1 rounded-full mr-1.5 ${sup.status === "Bottlenecked" ? "bg-red-400 animate-pulse" : sup.status === "Standby" ? "bg-amber-400" : "bg-emerald-400"}`} />
                          {sup.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-4 pt-3 border-t border-slate-850/60">
            <span>SHOWING 5 CRITICAL TIER-1 AND TIER-2 MANUFACTURER RECORDS</span>
            <span>SECURELY SYNCED WITH MASTER ERP DATABASES</span>
          </div>

        </div>
      </div>
      )}

      {/* Trigger assesment flow scroll pointer */}
      {mode === "all" && (
        <div className="mt-8 flex justify-center">
        <button
          onClick={onExplore}
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer hover:translate-y-0.5"
        >
          <span>Focus Ingest Signals Monitoring</span>
          <ArrowDown className="w-4 h-4 text-sky-400" />
        </button>
      </div>
      )}

    </section>
  );
}
