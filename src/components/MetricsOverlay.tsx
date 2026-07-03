import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gauge, Cpu, CloudCheck, HardDrive, AlertTriangle, Zap, RefreshCw, X } from "lucide-react";
import { PerformanceMetrics } from "../types";

interface MetricsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MetricsOverlay({ isOpen, onClose }: MetricsOverlayProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [history, setHistory] = useState<{ time: string; latency: number }[]>([]);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/performance-metrics");
      if (res.ok) {
        const data: PerformanceMetrics = await res.json();
        setMetrics(data);
        setLastUpdated(new Date().toLocaleTimeString());
        
        // Accumulate rolling chart history for CPU/Latency
        setHistory((prev) => {
          const updated = [...prev, { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            latency: data.awsLambdaLatencyMs 
          }];
          return updated.slice(-10); // Keep last 10 points
        });
      }
    } catch (err) {
      console.warn("Telemetry endpoint disconnected. Resorting to edge offline diagnostics:", err);
      // Mock localized fallback if API fails or in static-only dev modes
      const fallback: PerformanceMetrics = {
        status: "LOCAL_EMULATOR",
        uptimeSeconds: Math.round(performance.now() / 1000),
        serverRamMb: "128MB / 512MB",
        awsLambdaLatencyMs: Math.floor(Math.random() * 20) + 40,
        bedrockTokenThroughput: Math.floor(Math.random() * 100) + 1150,
        cloudWatchAlarms: 0,
        activeIngestStreams: 4,
        dynamoDbQueriesPerSec: (Math.random() * 10 + 35).toFixed(1),
        apiGatewayLatencyMs: Math.floor(Math.random() * 5) + 10,
      };
      setMetrics(fallback);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="bg-slate-950/90 border border-slate-800/90 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl text-slate-100 flex flex-col space-y-4"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                AWS Telemetry Console
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={fetchMetrics} 
                className="p-1 hover:bg-slate-900 rounded text-slate-400 hover:text-slate-200 transition-colors"
                title="Force refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={onClose} 
                className="p-1 hover:bg-slate-900 rounded text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {loading && !metrics ? (
            <div className="flex items-center justify-center py-8 font-mono text-xs text-slate-500">
              Establishing pipeline handshake...
            </div>
          ) : (
            metrics && (
              <div className="space-y-3.5 font-mono">
                {/* Health Overview */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-2.5">
                    <span className="text-[9px] text-slate-500 uppercase block tracking-wider">System State</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      <span>{metrics.status}</span>
                    </span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-2.5">
                    <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Uptime</span>
                    <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                      {Math.floor(metrics.uptimeSeconds / 3600)}h {Math.floor((metrics.uptimeSeconds % 3600) / 60)}m {metrics.uptimeSeconds % 60}s
                    </span>
                  </div>
                </div>

                {/* Main telemetry grid */}
                <div className="space-y-2 bg-slate-900/40 border border-slate-800/50 rounded-xl p-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-orange-500" />
                      <span>Lambda Compute:</span>
                    </span>
                    <span className="font-semibold text-slate-200">{metrics.awsLambdaLatencyMs}ms</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-400" />
                      <span>Bedrock Ingress:</span>
                    </span>
                    <span className="font-semibold text-sky-400">{metrics.bedrockTokenThroughput} T/sec</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                      <span>DynamoDB QPS:</span>
                    </span>
                    <span className="font-semibold text-slate-200">{metrics.dynamoDbQueriesPerSec} q/s</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <CloudCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Simulated Streams:</span>
                    </span>
                    <span className="font-semibold text-emerald-400">{metrics.activeIngestStreams} active</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                      <span>CloudWatch Alarms:</span>
                    </span>
                    <span className="font-semibold text-slate-400">{metrics.cloudWatchAlarms} active</span>
                  </div>
                </div>

                {/* Micro Live Spark Chart */}
                <div className="space-y-1 bg-slate-900/60 border border-slate-800/60 rounded-xl p-2.5">
                  <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Lambda Latency Stream</span>
                    <span className="text-sky-400">{metrics.awsLambdaLatencyMs}ms</span>
                  </div>
                  <div className="h-8 flex items-end justify-between pt-2 space-x-1">
                    {history.map((pt, idx) => {
                      // Normalize between 30 and 70 for 100% height
                      const normalizedHeight = Math.min(100, Math.max(10, ((pt.latency - 30) / 40) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative">
                          <div 
                            className="w-full bg-gradient-to-t from-sky-600/30 to-sky-400 rounded-sm transition-all"
                            style={{ height: `${normalizedHeight}%` }}
                          />
                          {/* Hover micro-tooltip */}
                          <div className="absolute bottom-10 scale-0 group-hover:scale-100 bg-slate-950 border border-slate-800 text-[8px] px-1 rounded transition-all pointer-events-none whitespace-nowrap">
                            {pt.latency}ms @ {pt.time.split(" ")[0]}
                          </div>
                        </div>
                      );
                    })}
                    {history.length === 0 && (
                      <div className="w-full text-center text-[9px] text-slate-600 py-1">Awaiting ingress data...</div>
                    )}
                  </div>
                </div>

                {/* Footer Sync */}
                <div className="text-[9px] text-slate-500 text-right">
                  Synced: {lastUpdated} | Refreshes every 3s
                </div>
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
