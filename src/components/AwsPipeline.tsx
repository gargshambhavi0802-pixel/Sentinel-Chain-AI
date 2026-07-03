import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, Cpu, Key, HelpCircle, HardDrive, 
  BellRing, ShieldCheck, Eye, EyeOff, Lock, AlertCircle,
  Terminal, Server, Play, RefreshCw, Layers, Radio
} from "lucide-react";

interface AwsPipelineProps {
  currentStep: "idle" | "ingest" | "processing" | "reasoning" | "storage" | "notification" | "done";
}

interface LogLine {
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARN" | "DEBUG";
  service: string;
  message: string;
}

export default function AwsPipeline({ currentStep }: AwsPipelineProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isBursting, setIsBursting] = useState(false);
  const [activeJobCount, setActiveJobCount] = useState(3);
  const [logs, setLogs] = useState<LogLine[]>([
    { timestamp: "05:18:12", level: "INFO", service: "S3", message: "Bucket landing event detected: s3://sentinel-raw-signals/news/reuters_congestion_0518.json" },
    { timestamp: "05:18:13", level: "SUCCESS", service: "Lambda", message: "Function 'SignalParser' invoked successfully. Warm start latency: 45ms" },
    { timestamp: "05:18:14", level: "DEBUG", service: "Bedrock", message: "Calling model 'anthropic.claude-3-5-sonnet' via STS role session token." },
    { timestamp: "05:18:15", level: "SUCCESS", service: "DynamoDB", message: "Transaction completed. Ingested structured payload into 'IncidentHistory'" }
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Translate active step into progress %
  const getProgressPercentage = () => {
    switch (currentStep) {
      case "idle": return 0;
      case "ingest": return 20;
      case "processing": return 40;
      case "reasoning": return 60;
      case "storage": return 80;
      case "notification": return 100;
      case "done": return 100;
    }
  };

  // Generate scrolling logs periodically
  useEffect(() => {
    const services = ["S3", "Lambda", "Bedrock", "DynamoDB", "SNS", "CloudWatch"];
    const infoMsgs = [
      "S3 object landed: s3://sentinel-raw-signals/telemetry_data_cube.json",
      "Lambda invoked: 'SignalParser'. Handshake verified with STS token pool",
      "STS token refreshed. Expiring in 3600 seconds.",
      "Bedrock token processing. Throughput: 1240 T/s",
      "DynamoDB partition write: incident_key=inc_995c",
      "SNS topic subscriber notified: arn:aws:sns:slack-notifications",
      "CloudWatch metrics synced: average lambda latency = 114ms"
    ];

    const interval = setInterval(() => {
      const chosenService = services[Math.floor(Math.random() * services.length)];
      const chosenMsg = infoMsgs[Math.floor(Math.random() * infoMsgs.length)];
      const levels: ("INFO" | "SUCCESS" | "DEBUG")[] = ["INFO", "SUCCESS", "DEBUG"];
      
      const newLog: LogLine = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        level: levels[Math.floor(Math.random() * levels.length)],
        service: chosenService,
        message: chosenMsg
      };

      setLogs(prev => [...prev, newLog].slice(-25));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleSimulateBurst = () => {
    setIsBursting(true);
    setActiveJobCount(prev => prev + 1);
    
    const burstLog: LogLine = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      level: "WARN",
      service: "CloudWatch",
      message: "MANUAL STRESS TRIGGER: Dispatching multithreaded S3 landing burst events..."
    };
    setLogs(prev => [...prev, burstLog]);

    setTimeout(() => {
      setIsBursting(false);
    }, 2500);
  };

  const steps = [
    {
      id: "sources",
      name: "1. Data Ingress",
      icon: "📡",
      arn: "feeds::logistics-hotspots",
      desc: "Aggregated unstructured news crawls, NOAA bulletins, and AIS transponder coordinates.",
      details: "Microservices poll REST points every 5 minutes.",
      metric: "4 streams"
    },
    {
      id: "s3",
      name: "2. Amazon S3",
      icon: "🪣",
      arn: "arn:aws:s3:::sentinelchain-raw-data-store",
      desc: "Highly durable secure object storage serving as the landing zone for unstructured raw intel.",
      details: "Configured with SSE-S3 encryption and Lifecycle transitions.",
      metric: "148,510 objs"
    },
    {
      id: "lambda",
      name: "3. AWS Lambda",
      icon: "λ",
      arn: "arn:aws:lambda:us-east-1:1234:function:SignalParser",
      desc: "Serverless Node.js computing. Cleans, tokenizes, and strips noise from inbound raw text logs.",
      details: "Memory: 512MB, Timeout: 15s. Dynamically triggered on S3:ObjectCreated events.",
      metric: "114ms latency"
    },
    {
      id: "bedrock",
      name: "4. Amazon Bedrock",
      icon: "🧠",
      arn: "bedrock::model/gemini-2.5-pro",
      desc: "Enterprise Generative AI layer. Formulates cascade risks, affected lanes, and coordinates playbooks.",
      details: "Leaverages temp = 0.15. Authenticated via secure IAM role policies.",
      metric: "1.2k tokens/s"
    },
    {
      id: "dynamodb",
      name: "5. Amazon DynamoDB",
      icon: "⚡",
      arn: "arn:aws:dynamodb:us-east-1:1234:table/IncidentHistory",
      desc: "Fast, fully-managed NoSQL database storing structured analyzed outcomes, timelines, and mitigations.",
      details: "Partition Key: incident_id. DynamoDB streams attached for down-pipe syncing.",
      metric: "41.5 QPS"
    },
    {
      id: "sns",
      name: "6. Amazon SNS",
      icon: "📢",
      arn: "arn:aws:sns:us-east-1:1234:SentinelChainAlerts",
      desc: "Simple Notification Service. Automatically dispatches multi-channel SMS, Email, and Slack topics.",
      details: "Standard SNS topic with SQS subscriptions to absorb downstream throttling.",
      metric: "100% dispatch"
    }
  ];

  const supportingServices = [
    { id: "cloudwatch", name: "Amazon CloudWatch", icon: "👁️", desc: "Monitors CPU, Lambda execution timeouts, and streams central logs." },
    { id: "iam", name: "AWS IAM Roles", icon: "🔑", desc: "Coordinates fine-grained access policies across all pipeline services dynamically." },
    { id: "quicksight", name: "Amazon QuickSight", icon: "📊", desc: "Builds real-time Business Intelligence analytics dashboards reading Direct records." },
    { id: "secrets", name: "AWS Secrets Manager", icon: "🔒", desc: "Secures sensitive operational API tokens, credential paths, and platform keys." }
  ];

  return (
    <section
      id="aws-pipeline"
      className="min-h-screen flex flex-col justify-start items-center px-4 sm:px-6 py-20 w-full"
    >
      <div className="w-full max-w-5xl">
        {/* Title */}
        <div className="text-left mb-8 border-b border-slate-800/60 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">Stage IV — Cloud Operations</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Serverless Event Stream</h2>
            <p className="text-slate-400 text-xs mt-1.5 max-w-xl">
              SentinelChain operates a fully serverless cloud pipeline. Monitor cluster node status, track live event paths, and trigger stress testing load bursts.
            </p>
          </div>

          <button
            onClick={handleSimulateBurst}
            disabled={isBursting}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <Play className={`w-3.5 h-3.5 text-sky-400 ${isBursting ? "animate-spin" : ""}`} />
            <span>Simulate Load Burst</span>
          </button>
        </div>

        {/* Centerpiece: Interactive Pipeline Visualizer */}
        <div className="bg-slate-900/40 border border-slate-800/85 backdrop-blur-xl rounded-2xl p-5 md:p-8 relative overflow-hidden mb-6 text-left">
          
          <div className="flex items-center justify-between mb-6 border-b border-slate-850 pb-3">
            <div className="flex items-center space-x-2.5 font-mono text-[10px] text-slate-500">
              <Server className="w-4 h-4 text-sky-400" />
              <span>AWS PIPELINE RESILIENCY CONSOLE</span>
            </div>
            <div className="flex items-center space-x-3 text-[9px] font-mono text-slate-500">
              <span>ACTIVE CLUSTER JOBS: <strong className="text-sky-400 font-bold">{activeJobCount}</strong></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Interactive Node Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative z-10">
            {steps.map((node, index) => {
              const isHovered = hoveredNode === node.id;
              
              // Map steps to determine node status
              let stepStatus: "pending" | "active" | "completed" = "pending";
              const stepIndex = ["idle", "ingest", "processing", "reasoning", "storage", "notification", "done"];
              const currentStepIdx = stepIndex.indexOf(currentStep);
              
              if (currentStep === "done") {
                stepStatus = "completed";
              } else if (index < currentStepIdx) {
                stepStatus = "completed";
              } else if (index === currentStepIdx - 1) {
                stepStatus = "active";
              }

              return (
                <div
                  key={node.id}
                  className="flex flex-col items-center text-center relative group"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer Pulsing Indicator for Active Stage */}
                  {(stepStatus === "active" || (isBursting && index === 2)) && (
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 opacity-60 blur-md animate-pulse" />
                  )}

                  {/* Node Icon Box */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all border relative z-10 cursor-pointer ${
                      stepStatus === "completed"
                        ? "bg-sky-950/20 border-sky-500/50 text-sky-400 shadow shadow-sky-950/20"
                        : stepStatus === "active"
                          ? "bg-slate-900 border-sky-400 text-sky-300 scale-105"
                          : "bg-slate-950/80 border-slate-850 text-slate-500 group-hover:border-slate-800"
                    }`}
                  >
                    <span>{node.icon}</span>

                    {/* Step complete checkmark marker */}
                    {stepStatus === "completed" && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-slate-200 mt-3 tracking-wide group-hover:text-sky-400 transition-colors uppercase">
                    {node.id}
                  </span>
                  
                  <span className="text-[8.5px] text-emerald-400 font-mono mt-0.5 tracking-wider block">
                    {node.metric}
                  </span>

                  {/* Custom Rich Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-18 left-1/2 -translate-x-1/2 w-64 bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-left z-30 shadow-2xl font-sans text-xs space-y-2 pointer-events-none"
                      >
                        <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                          <span className="font-bold text-slate-200">{node.name}</span>
                          <span className="text-[8px] font-mono text-sky-400">AWS SERVICE</span>
                        </div>
                        <p className="text-slate-400 text-[10.5px] leading-relaxed">
                          {node.desc}
                        </p>
                        <div className="p-1.5 bg-slate-900 border border-slate-850 rounded text-[8.5px] font-mono text-slate-500 break-all leading-relaxed">
                          <div className="text-orange-400 font-bold uppercase text-[7px] mb-0.5">Resource ARN:</div>
                          {node.arn}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono leading-relaxed pt-1 border-t border-slate-900 mt-1">
                          {node.details}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* SVG Connection line Overlay */}
          <div className="absolute top-[78px] left-12 right-12 h-1 pointer-events-none hidden md:block">
            <svg className="w-full h-8 overflow-visible" xmlns="http://www.w3.org/2000/svg">
              {/* Ground Track Line */}
              <line
                x1="0" y1="4" x2="100%" y2="4"
                stroke="rgba(30, 41, 59, 0.3)"
                strokeWidth="1.5"
              />
              {/* Dynamic Active Progress track */}
              <motion.line
                x1="0" y1="4" x2={`${getProgressPercentage()}%`} y2="4"
                stroke="url(#skyGradient)"
                strokeWidth="2"
                initial={{ x2: "0%" }}
                animate={{ x2: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />

              {/* Stress testing burst packets */}
              {isBursting && (
                <>
                  <circle r="3" fill="#10b981" filter="url(#glow)">
                    <animateMotion dur="1.2s" repeatCount="indefinite" path="M 0,4 L 800,4" />
                  </circle>
                  <circle r="2.5" fill="#38bdf8" filter="url(#glow)">
                    <animateMotion dur="0.8s" repeatCount="indefinite" path="M 0,4 L 800,4" />
                  </circle>
                </>
              )}

              {/* Normal Data carrier packet */}
              {currentStep !== "idle" && (
                <circle r="3" fill="#38bdf8" filter="url(#glow)">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 0,4 L 800,4" />
                </circle>
              )}

              <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>

        </div>

        {/* Bottom Grid: Live CloudWatch Terminal Logs & Infrastructure (Two-Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: CloudWatch Logs Terminal Emulator (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between text-left">
            <div className="space-y-3.5 w-full">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200 font-mono">
                    CloudWatch Live Application Log Streams
                  </span>
                </div>
                <div className="flex items-center space-x-1 font-mono text-[8px] text-slate-500">
                  <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                  <span>LIVE OVERFLOW</span>
                </div>
              </div>

              {/* Terminal Logs Box */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-[9px] h-[160px] overflow-y-auto space-y-1.5 leading-relaxed max-w-full">
                {logs.map((log, idx) => {
                  let col = "text-slate-400";
                  if (log.level === "SUCCESS") col = "text-emerald-400";
                  if (log.level === "WARN") col = "text-red-400 font-bold";
                  if (log.level === "DEBUG") col = "text-purple-400";

                  return (
                    <div key={idx} className="flex items-start space-x-1.5 hover:bg-slate-900/40">
                      <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                      <span className={`px-1 rounded bg-slate-900 text-[8px] uppercase font-bold shrink-0 ${col}`}>
                        {log.service}
                      </span>
                      <span className="text-slate-300 break-all">{log.message}</span>
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>
            </div>

            <div className="text-[9px] font-mono text-slate-500 mt-3 pt-2.5 border-t border-slate-900 flex justify-between">
              <span>STREAM GROUP: /aws/lambda/SignalParser</span>
              <span>SINK TARGET: CLOUDWATCH LOGSTREAM GLOBAL</span>
            </div>
          </div>

          {/* Right Column: Supporting Services Grid (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900/35 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between text-left">
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-3">
                Supporting Security & BI
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {supportingServices.slice(0, 3).map((serv) => (
                  <div
                    key={serv.id}
                    className="bg-slate-950/50 border border-slate-850 rounded-xl p-2.5 flex items-start space-x-2.5 hover:border-slate-800 transition-all"
                  >
                    <span className="text-sm shrink-0 mt-0.5">{serv.icon}</span>
                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                        {serv.name}
                      </h4>
                      <p className="text-[9px] text-slate-500 font-sans leading-relaxed">
                        {serv.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[8.5px] font-mono text-slate-500 border-t border-slate-850/60 pt-2.5 mt-3">
              <span>SLA GUARANTEED VIA SECURE VPC PEERING</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
