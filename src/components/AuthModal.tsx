import { useState } from "react";
import { motion } from "motion/react";
import { ShieldAlert, Key, Eye, EyeOff, Lock, Server, CloudLightning, ArrowRight } from "lucide-react";
import { IAMRole, IAMRoleType } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: IAMRole;
  onSelectRole: (role: IAMRole) => void;
}

export const IAM_ROLES: IAMRole[] = [
  {
    type: "SolutionsArchitect",
    title: "AWS Solutions Architect",
    description: "Full visibility into the server pipeline, Lambda triggers, Bedrock operations, and Secrets Manager integration.",
    clearanceLevel: "L9 Enterprise Lead",
    badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    permissions: ["READ_AWS_SCHEMAS", "SIMULATE_LAMBDA_PULSE", "VIEW_PIPELINE_METRICS", "TRIGGER_SNS_BROADCAST"]
  },
  {
    type: "LogisticsOfficer",
    title: "Lead Logistics Director",
    description: "Deep analytics on global ports, supplier risk metrics, rerouting playbooks, and inventory impact evaluations.",
    clearanceLevel: "L8 Global Operations",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    permissions: ["READ_PORT_METRICS", "EXECUTE_REROUTE_PLAYBOOK", "TRIGGER_SNS_BROADCAST"]
  },
  {
    type: "SecurityAuditor",
    title: "Chief Security Auditor",
    description: "Read-only access to system health, CloudWatch auditing logs, IAM permission grids, and decrypt keys.",
    clearanceLevel: "L7 Compliance Chief",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    permissions: ["READ_PORT_METRICS", "READ_AWS_SCHEMAS", "VIEW_PIPELINE_METRICS"]
  },
  {
    type: "SystemAdministrator",
    title: "DevOps Systems Admin",
    description: "Root root administrative access. Can force pipeline resets, purge logs, configure API endpoints, and monitor physical nodes.",
    clearanceLevel: "L10 Full Root Admin",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/30",
    permissions: ["READ_PORT_METRICS", "READ_AWS_SCHEMAS", "SIMULATE_LAMBDA_PULSE", "VIEW_PIPELINE_METRICS", "EXECUTE_REROUTE_PLAYBOOK", "TRIGGER_SNS_BROADCAST"]
  }
];

export default function AuthModal({ isOpen, onClose, activeRole, onSelectRole }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"federated" | "secrets">("federated");
  const [username, setUsername] = useState("admin@sentinelchain.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [ssoDone, setSsoDone] = useState(true);

  if (!isOpen) return null;

  const handleSsoClick = (role: IAMRole) => {
    setIsSigningIn(true);
    setTimeout(() => {
      onSelectRole(role);
      setIsSigningIn(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row"
      >
        {/* Left Side: Federated Identity info */}
        <div className="md:w-[40%] bg-gradient-to-b from-slate-950 to-slate-900 p-6 flex flex-col justify-between border-r border-slate-800">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">SentinelChain IAM</h3>
              <p className="text-xs text-slate-400 mt-1">
                Unified AWS Single Sign-On and Role-Based Access Control console for global logistics threat intelligence.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 md:pt-0">
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              <Server className="w-3.5 h-3.5 text-orange-500" />
              <span>AWS Identity Provider</span>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800/60 font-mono text-[10px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>STS Token:</span>
                <span className="text-sky-400">sts::123456...</span>
              </div>
              <div className="flex justify-between">
                <span>Domain:</span>
                <span className="text-slate-500">us-east-1.aws</span>
              </div>
              <div className="flex justify-between">
                <span>Auth State:</span>
                <span className="text-emerald-400">AUTHORIZED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tab selectors and action panels */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-slate-900">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("federated")}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                    activeTab === "federated"
                      ? "text-sky-400 border-sky-400"
                      : "text-slate-400 border-transparent hover:text-slate-200"
                  }`}
                >
                  SSO Roles
                </button>
                <button
                  onClick={() => setActiveTab("secrets")}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                    activeTab === "secrets"
                      ? "text-sky-400 border-sky-400"
                      : "text-slate-400 border-transparent hover:text-slate-200"
                  }`}
                >
                  Direct Login
                </button>
              </div>

              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xs font-mono font-bold">
                ESC ✕
              </button>
            </div>

            {/* TAB 1: FEDERATED SSO IAM ROLE SELECTION */}
            {activeTab === "federated" && (
              <div className="space-y-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                  <span>Select Active IAM Role to Assume</span>
                  <span className="text-amber-500 animate-pulse">● Live Provider Connection</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {IAM_ROLES.map((role) => {
                    const isCurrent = activeRole.type === role.type;
                    return (
                      <button
                        key={role.type}
                        onClick={() => handleSsoClick(role)}
                        disabled={isSigningIn}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? "bg-sky-950/15 border-sky-500/50 shadow-md shadow-sky-950/25"
                            : "bg-slate-950/40 border-slate-800 hover:bg-slate-950/75 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-100">{role.title}</span>
                          <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded uppercase ${role.badgeColor}`}>
                            {role.clearanceLevel}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{role.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {role.permissions.slice(0, 3).map((perm) => (
                            <span key={perm} className="text-[8px] font-mono bg-slate-900 border border-slate-800 text-slate-500 px-1 py-0.5 rounded">
                              {perm}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="text-[8px] font-mono bg-slate-900 border border-slate-800 text-slate-500 px-1 py-0.5 rounded">
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: SECRETS / DIRECT ACCESS KEY LOGIN */}
            {activeTab === "secrets" && (
              <div className="space-y-4 py-2">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                      IAM Username / ARN
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                      SSO Passcode / Secret Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 pr-10 text-xs text-slate-300 font-mono focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-start space-x-2.5">
                  <Key className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <div className="text-[10px] text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-200">Local Secrets Manager:</span> This applet is securely configured with cloud credentials dynamically synced with AI Studio platform layers. Direct API Keys can be managed in <span className="font-mono text-sky-400">Settings &gt; Secrets</span> in the sidebar.
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSigningIn(true);
                    setTimeout(() => {
                      setIsSigningIn(false);
                      onSelectRole(IAM_ROLES[0]); // Default to Architect
                      onClose();
                    }, 500);
                  }}
                  disabled={isSigningIn}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-2 rounded-lg text-xs tracking-wide flex items-center justify-center space-x-2 transition-colors mt-2"
                >
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="text-[9px] text-slate-500 font-mono mt-6 flex justify-between items-center border-t border-slate-800/80 pt-4">
            <span className="flex items-center space-x-1.5">
              <CloudLightning className="w-3 h-3 text-sky-400" />
              <span>TLS 1.3 SECURE CONNECTION</span>
            </span>
            <span>MFA STATE: ENABLED</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
