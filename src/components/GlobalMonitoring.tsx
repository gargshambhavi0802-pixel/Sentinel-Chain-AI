import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, Newspaper, CloudRain, Anchor, ShieldCheck, 
  Database, RefreshCw, Search, Terminal, FileText, 
  AlertCircle, CheckCircle2, ChevronRight, HardDrive, BarChart2
} from "lucide-react";

interface StreamItem {
  id: string;
  source: "News" | "Weather" | "Port" | "Supplier";
  message: string;
  timestamp: string;
  status: "queued" | "ingested" | "failed";
  latencyMs: number;
  sizeKb: number;
  s3Key: string;
}

export default function GlobalMonitoring() {
  const [selectedSource, setSelectedSource] = useState<"All" | "News" | "Weather" | "Port" | "Supplier">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLogItem, setSelectedLogItem] = useState<StreamItem | null>(null);
  const [totalIngested, setTotalIngested] = useState(14852);
  const [streams, setStreams] = useState<StreamItem[]>([
    { id: "1", source: "News", message: "Reuters: UN commission warns on maritime congestion spikes in Rotterdam corridors", timestamp: "05:18:12", status: "ingested", latencyMs: 142, sizeKb: 1.2, s3Key: "s3://sentinel-raw-signals/news/2026-07-03/reuters_congestion_0518.json" },
    { id: "2", source: "Weather", message: "NOAA: Category-4 Typhoon 'In-Fa' forming in East China Sea near sea corridors", timestamp: "05:19:04", status: "ingested", latencyMs: 215, sizeKb: 4.8, s3Key: "s3://sentinel-raw-signals/weather/2026-07-03/noaa_typhoon_0519.json" },
    { id: "3", source: "Port", message: "AIS Marine: Los Angeles Terminal dwell times increase to 11.2 days across berths", timestamp: "05:19:45", status: "queued", latencyMs: 98, sizeKb: 2.1, s3Key: "s3://sentinel-raw-signals/port/2026-07-03/ais_la_dwell_0519.json" },
    { id: "4", source: "Supplier", message: "ERP: Tier-1 microchip supplier Taiwan Micro-Semi announces silicon wafer limitations", timestamp: "05:20:11", status: "queued", latencyMs: 310, sizeKb: 3.5, s3Key: "s3://sentinel-raw-signals/erp/2026-07-03/erp_wafer_limit_0520.json" },
    { id: "5", source: "Port", message: "Suez Canal Authority: Suez corridor containership grounding delays primary ocean routing", timestamp: "05:20:30", status: "queued", latencyMs: 125, sizeKb: 5.2, s3Key: "s3://sentinel-raw-signals/port/2026-07-03/suez_grounding_0520.json" }
  ]);

  // Generate mock signals periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newsOptions = [
        "Bloomberg: Fuel price surcharges climb by 4.2% on Trans-Pacific container shipping routes",
        "AP News: Dockworker contract negotiations stall indefinitely across Northwest ports",
        "Lloyds List: Rotterdam port logs record-high container dwell times in central hubs",
        "Kyodo: Tokyo freight rails suspended due to regional grid failure and electrical issues"
      ];
      const weatherOptions = [
        "METAR: Heavy coastal fog limits Shanghai container vessel berthing operations",
        "NOAA: Gale warning issued for North Atlantic high-density transit corridors",
        "WMO: Flood alerts in lower Mississippi valley slow barge traffic and grain carriers"
      ];
      const portOptions = [
        "AIS Transponder: Suez queues increase to 42 bulk cargo vessels awaiting transit",
        "Port Authority: Los Angeles gates declare staging space capacity limits in sector G",
        "Singapore Terminal: Crane automated calibration maintenance completed in berth 4"
      ];
      const supplierOptions = [
        "Supplier ERP: Direct lithium battery shipments flagged for hazardous safety check",
        "SAP Ledger: Lead-times on micro-controllers delayed by 18 days for secondary lines",
        "Logistics Webhook: Secondary packaging plant declares immediate operations restart"
      ];

      const categories: ("News" | "Weather" | "Port" | "Supplier")[] = ["News", "Weather", "Port", "Supplier"];
      const chosenCat = categories[Math.floor(Math.random() * categories.length)];
      let msg = "";

      if (chosenCat === "News") msg = newsOptions[Math.floor(Math.random() * newsOptions.length)];
      if (chosenCat === "Weather") msg = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      if (chosenCat === "Port") msg = portOptions[Math.floor(Math.random() * portOptions.length)];
      if (chosenCat === "Supplier") msg = supplierOptions[Math.floor(Math.random() * supplierOptions.length)];

      const newItem: StreamItem = {
        id: Date.now().toString(),
        source: chosenCat,
        message: msg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: "queued",
        latencyMs: Math.floor(Math.random() * 250) + 80,
        sizeKb: parseFloat((Math.random() * 5 + 1).toFixed(1)),
        s3Key: `s3://sentinel-raw-signals/${chosenCat.toLowerCase()}/2026-07-03/signal_${Date.now().toString().slice(-4)}.json`
      };

      setStreams((prev) => {
        // Ingest previous queued items
        const updated = prev.map(s => s.status === "queued" ? { ...s, status: "ingested" as const } : s);
        return [newItem, ...updated].slice(0, 10);
      });
      setTotalIngested(prev => prev + 1);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  // Sync default selection
  useEffect(() => {
    if (streams.length > 0 && !selectedLogItem) {
      setSelectedLogItem(streams[0]);
    }
  }, [streams, selectedLogItem]);

  const sources = [
    { name: "News", icon: Newspaper, desc: "Global RSS feeds, maritime registers, risk crawls.", color: "text-sky-400 border-sky-500/20 bg-sky-950/10" },
    { name: "Weather", icon: CloudRain, desc: "NOAA gale alerts, marine swell forecasts.", color: "text-amber-400 border-amber-500/20 bg-amber-950/10" },
    { name: "Port", icon: Anchor, desc: "AIS ship transponders, port dwell indexes.", color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/10" },
    { name: "Supplier", icon: ShieldCheck, desc: "SAP ledgers, critical supplier webhooks.", color: "text-purple-400 border-purple-500/20 bg-purple-950/10" }
  ];

  const filteredStreams = streams.filter(s => {
    const matchesSource = selectedSource === "All" || s.source === selectedSource;
    const matchesSearch = s.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.s3Key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  return (
    <section
      id="global-monitoring"
      className="min-h-screen flex flex-col justify-start items-center px-4 sm:px-6 py-20 w-full"
    >
      <div className="w-full max-w-5xl">
        {/* Section Header */}
        <div className="text-left mb-8 border-b border-slate-800/60 pb-5">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Stage II — Ingest Engine</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Live Signal Ingestion Console</h2>
          <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
            SentinelChain collects unstructured logistics telemetry, shipping transponders, and global weather feeds, queuing them securely inside Amazon S3 buckets before feeding the AI classifiers.
          </p>
        </div>

        {/* Live Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Total Aggregated S3 Objects</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-lg font-mono font-bold text-slate-200">{totalIngested.toLocaleString()}</span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">+5.2k today</span>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Ingress Bandwidth</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-lg font-mono font-bold text-sky-400">42.8 kb/s</span>
              <span className="text-[9px] font-mono text-slate-400">RMS mean</span>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">AWS S3 Write Latency</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-lg font-mono font-bold text-slate-200">114 ms</span>
              <span className="text-[9px] font-mono text-emerald-400">Normal range</span>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Handshake Integrity</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-400">100% HEALTHY</span>
            </div>
          </div>
        </div>

        {/* Dashboard Control Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Panel: Stream Sources & Search (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Search Input */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 text-left">
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Search Signals Registry</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword / URL..."
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/10 font-mono"
                />
              </div>
            </div>

            {/* Ingestion Channels Selectors */}
            <div className="bg-slate-900/35 border border-slate-800/80 rounded-xl p-4 text-left flex-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-3">Filter Channel Feed</span>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedSource("All")}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between text-xs ${
                    selectedSource === "All"
                      ? "bg-sky-500/10 border-sky-500 text-sky-400"
                      : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800"
                  }`}
                >
                  <span className="font-bold">ALL DATA CHANNELS</span>
                  <span className="text-[9px] font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-500">10 active</span>
                </button>

                {sources.map((src) => {
                  const Icon = src.icon;
                  const isSelected = selectedSource === src.name;
                  return (
                    <button
                      key={src.name}
                      onClick={() => setSelectedSource(src.name as any)}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? "bg-slate-900 border-sky-500/70 text-sky-400"
                          : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="font-bold uppercase">{src.name} CHANNEL</span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </button>
                  );
                })}
              </div>

              {/* Feed Meta Details */}
              <div className="mt-4 pt-3 border-t border-slate-850 text-[10px] text-slate-500 space-y-2">
                <p className="leading-relaxed font-sans">
                  {selectedSource === "All" 
                    ? "Subscribers execute cron triggers pulling maritime registries, NOAA gale files, and SAP manufacturing ledgers." 
                    : sources.find(s => s.name === selectedSource)?.desc
                  }
                </p>
                <div className="bg-slate-950/90 p-2.5 rounded border border-slate-850/60 font-mono text-[8.5px] leading-relaxed">
                  <div className="truncate">HOST: <span className="text-sky-400">api.sentinelchain.ai/v2/{selectedSource.toLowerCase()}</span></div>
                  <div>SCHEMA: <span className="text-amber-500">AWS_UNSTRUCTURED_JSON</span></div>
                </div>
              </div>

            </div>

          </div>

          {/* Center Panel: Active S3 Bucket Live Table & Logs (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 mb-3.5">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold uppercase text-slate-200 tracking-wider">S3 Buffer Ingress Queue</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500">BUCKET: s3://sentinel-raw-signals</span>
              </div>

              {/* Queue Items */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {filteredStreams.map((item) => {
                    const isSelected = selectedLogItem?.id === item.id;
                    let catColor = "text-sky-400 bg-sky-950/20 border-sky-500/20";
                    if (item.source === "Weather") catColor = "text-amber-400 bg-amber-950/20 border-amber-500/20";
                    if (item.source === "Port") catColor = "text-emerald-400 bg-emerald-950/20 border-emerald-500/20";
                    if (item.source === "Supplier") catColor = "text-purple-400 bg-purple-950/20 border-purple-500/20";

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setSelectedLogItem(item)}
                        className={`p-2.5 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-slate-950 border-sky-500/50"
                            : "bg-slate-950/40 border-slate-850 hover:bg-slate-950/80 hover:border-slate-800"
                        }`}
                      >
                        <div className="space-y-1 flex-1 min-w-0 pr-1.5 text-[10.5px]">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[7.5px] font-mono border px-1.5 py-0.2 rounded uppercase ${catColor}`}>
                              {item.source}
                            </span>
                            <span className="text-[7.5px] font-mono text-slate-500">{item.timestamp}</span>
                          </div>
                          <p className="text-slate-300 font-sans truncate">{item.message}</p>
                        </div>
                        
                        <div className="shrink-0">
                          {item.status === "queued" ? (
                            <span className="text-[7px] font-mono text-amber-500 bg-amber-950/10 border border-amber-500/30 px-1 py-0.2 rounded animate-pulse uppercase">
                              Buffering
                            </span>
                          ) : (
                            <span className="text-[7px] font-mono text-emerald-400 bg-emerald-950/10 border border-emerald-500/30 px-1 py-0.2 rounded uppercase">
                              Ingested
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredStreams.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-xs font-mono border border-dashed border-slate-850 rounded-xl">
                    No active S3 object matching filters
                  </div>
                )}
              </div>
            </div>

            {/* Sparkline chart of signal ingress frequency */}
            <div className="mt-4 pt-3.5 border-t border-slate-850 space-y-1.5">
              <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-500 uppercase">
                <span>Signal Velocity (Events/Sec)</span>
                <span className="text-sky-400 font-bold">14 events/m mean</span>
              </div>
              
              {/* Custom SVG Line Sparkline Chart */}
              <div className="h-10 bg-slate-950/50 border border-slate-850 rounded-lg p-1.5 flex items-center justify-center">
                <svg viewBox="0 0 100 20" className="w-full h-full stroke-sky-500 stroke-[1.5] fill-none">
                  <path 
                    d="M 0,15 L 10,13 L 20,18 L 30,12 L 40,8 L 50,14 L 60,3 L 70,16 L 80,10 L 90,4 L 100,8" 
                    className="stroke-sky-500/80"
                  />
                  {/* Glowing dynamic fill under the curve */}
                  <path 
                    d="M 0,15 L 10,13 L 20,18 L 30,12 L 40,8 L 50,14 L 60,3 L 70,16 L 80,10 L 90,4 L 100,8 L 100,20 L 0,20 Z" 
                    fill="rgba(14, 165, 233, 0.08)"
                    stroke="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Panel: Amazon S3 Object Meta Inspector (3 Cols) */}
          <div className="lg:col-span-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between text-left font-mono text-[10px]">
            <div>
              <div className="flex items-center space-x-2 border-b border-slate-850 pb-2 mb-3.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wide">S3 Metadata Inspector</span>
              </div>

              {selectedLogItem ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Object Key URI</span>
                    <span className="text-sky-400 break-all select-all">{selectedLogItem.s3Key}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Event Class</span>
                    <span className="text-slate-300 font-bold uppercase">{selectedLogItem.source} telemetry</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Payload Size</span>
                    <span className="text-slate-300">{selectedLogItem.sizeKb} KB</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Ingest Latency</span>
                    <span className="text-slate-300">{selectedLogItem.latencyMs} ms</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Data Integrity Signature</span>
                    <span className="text-emerald-400 flex items-center space-x-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>SHA-256 Validated</span>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-850/60">
                    <span className="text-slate-500 block text-[9px] uppercase mb-1">Raw JSON Preview</span>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-850 text-[8.5px] leading-relaxed text-slate-400 font-mono h-[110px] overflow-y-auto max-w-full">
                      {`{\n  "event_id": "${selectedLogItem.id}",\n  "stream_source": "${selectedLogItem.source}",\n  "timestamp": "${selectedLogItem.timestamp}",\n  "payload": {\n    "msg": "${selectedLogItem.message.slice(0, 30)}...",\n    "integrity": "pass"\n  }\n}`}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500">
                  Select an S3 buffer queue item to inspect metadata.
                </div>
              )}
            </div>

            <div className="text-[8.5px] text-slate-600 border-t border-slate-850/50 pt-3 mt-4">
              <span>SECURITY PROTOCOL: AWS SSE-S3 AES-256</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
