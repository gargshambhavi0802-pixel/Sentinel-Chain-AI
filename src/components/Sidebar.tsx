import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, Globe, Flame, Ship, Factory, Lightbulb, BarChart3, Mic, BellRing, Settings,
  ChevronDown, ChevronRight, ShieldCheck, Terminal, Map, Newspaper, AlertCircle,
  FileText, Anchor, Clock, HeartPulse, RefreshCw, Zap, Compass, Database, TrendingUp,
  ClipboardList, User, Lock, Users
} from "lucide-react";
import { IAMRole } from "../types";

interface SidebarProps {
  activeRole: IAMRole;
  onOpenAuth: () => void;
  onToggleMetrics: () => void;
  showMetrics: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface ChildItem {
  id: string;
  label: string;
  icon?: any;
}

interface NavGroup {
  id: string;
  label: string;
  icon: any;
  children?: ChildItem[];
}

export default function Sidebar({ activeRole, onOpenAuth, onToggleMetrics, showMetrics, activeSection, setActiveSection }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["global-intelligence"]);

  const navGroups: NavGroup[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home
    },
    {
      id: "global-intelligence",
      label: "Global Intelligence",
      icon: Globe,
      children: [
        { id: "live-risk-map", label: "Live Risk Map", icon: Map },
        { id: "global-threat-feed", label: "Global Threat Feed", icon: Newspaper }
      ]
    },
    {
      id: "incidents",
      label: "Incidents",
      icon: AlertCircle,
      children: [
        { id: "active-disruptions", label: "Active Disruptions", icon: Flame },
        { id: "incident-details", label: "Incident Details", icon: FileText }
      ]
    },
    {
      id: "shipments",
      label: "Shipments",
      icon: Ship,
      children: [
        { id: "live-shipment-tracking", label: "Live Shipment Tracking", icon: Anchor },
        { id: "delayed-shipments", label: "Delayed Shipments", icon: Clock }
      ]
    },
    {
      id: "suppliers",
      label: "Suppliers",
      icon: Factory,
      children: [
        { id: "supplier-health", label: "Supplier Health", icon: HeartPulse },
        { id: "alternative-suppliers", label: "Alternative Suppliers", icon: RefreshCw }
      ]
    },
    {
      id: "ai-recommendations",
      label: "AI Recommendations",
      icon: Lightbulb,
      children: [
        { id: "recovery-actions", label: "Recovery Actions", icon: Zap },
        { id: "route-optimization", label: "Route Optimization", icon: Compass },
        { id: "inventory-suggestions", label: "Inventory Suggestions", icon: Database }
      ]
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      children: [
        { id: "risk-trends", label: "Risk Trends", icon: TrendingUp },
        { id: "business-impact", label: "Business Impact", icon: BarChart3 },
        { id: "reports", label: "Reports", icon: ClipboardList }
      ]
    },
    {
      id: "ai-assistant",
      label: "AI Assistant",
      icon: Mic,
      children: [
        { id: "voice-assistant", label: "Voice Assistant", icon: Mic },
        { id: "ai-chat", label: "AI Chat", icon: Users }
      ]
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: BellRing
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      children: [
        { id: "profile", label: "Profile", icon: User },
        { id: "cognito-login", label: "Amazon Cognito Login", icon: Lock },
        { id: "team-roles", label: "Team & Roles", icon: Users }
      ]
    }
  ];

  // Auto-expand parent group of active section
  useEffect(() => {
    const parentGroup = navGroups.find(group => 
      group.children && group.children.some(child => child.id === activeSection)
    );
    if (parentGroup && !expandedGroups.includes(parentGroup.id)) {
      setExpandedGroups(prev => [...prev, parentGroup.id]);
    }
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    window.location.hash = id;
    setActiveSection(id);
  };

  const toggleGroup = (groupId: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      if (!expandedGroups.includes(groupId)) {
        setExpandedGroups(prev => [...prev, groupId]);
      }
    } else {
      setExpandedGroups(prev => 
        prev.includes(groupId) 
          ? prev.filter(id => id !== groupId) 
          : [...prev, groupId]
      );
    }
  };

  return (
    <motion.div
      id="left-glass-sidebar"
      className="fixed left-5 top-1/2 -translate-y-1/2 h-[92vh] z-40 flex flex-col justify-between bg-slate-950/80 border border-slate-800/80 backdrop-blur-2xl rounded-2xl py-6 select-none shadow-2xl"
      animate={{ width: isExpanded ? 260 : 68 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Top Brand Logo */}
      <div className="px-4 flex items-center space-x-3 overflow-hidden shrink-0 border-b border-slate-900/40 pb-4">
        <div className="min-w-[36px] h-9 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 cursor-pointer" onClick={() => scrollToSection("dashboard")}>
          <Globe className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col whitespace-nowrap text-left"
            >
              <span className="text-sm font-bold tracking-wider text-slate-100 uppercase">
                SentinelChain
              </span>
              <span className="text-[9px] text-sky-400 font-mono tracking-widest uppercase">
                Enterprise SaaS
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation List - Scrollable when expanded */}
      <div className="flex-1 overflow-y-auto mt-4 px-2.5 space-y-1.5 custom-scrollbar pr-1">
        {navGroups.map((group) => {
          const GroupIcon = group.icon;
          const hasChildren = !!group.children;
          const isGroupExpanded = expandedGroups.includes(group.id);
          
          // Check if group is active (either it is active, or one of its children is active)
          const isGroupActive = activeSection === group.id || (group.children && group.children.some(c => c.id === activeSection));

          return (
            <div key={group.id} className="flex flex-col space-y-0.5">
              {/* Group Trigger Button */}
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleGroup(group.id);
                  } else {
                    scrollToSection(group.id);
                  }
                }}
                className={`relative flex items-center w-full rounded-xl py-2 px-3 transition-all group text-left ${
                  isGroupActive && !hasChildren
                    ? "text-sky-400 bg-sky-950/20 border-l-2 border-sky-500 pl-2.5" 
                    : isGroupActive
                      ? "text-sky-400 bg-slate-900/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center justify-center min-w-[20px]">
                  <GroupIcon className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${isGroupActive ? "text-sky-400" : "text-slate-400 group-hover:text-sky-300"}`} />
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="ml-3.5 flex items-center justify-between flex-1 whitespace-nowrap"
                    >
                      <span className="text-xs font-medium tracking-wide">
                        {group.label}
                      </span>
                      {hasChildren && (
                        <div>
                          {isGroupExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip for unexpanded sidebar */}
                {!isExpanded && (
                  <div className="absolute left-16 bg-slate-950 border border-slate-800 text-slate-200 text-[10px] py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-sans font-medium shadow-xl">
                    {group.label}
                  </div>
                )}
              </button>

              {/* Collapsible Children List */}
              {hasChildren && group.children && (
                <AnimatePresence initial={false}>
                  {isExpanded && isGroupExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden flex flex-col pl-7 space-y-0.5"
                    >
                      {group.children.map((child) => {
                        const isChildActive = activeSection === child.id;
                        return (
                          <button
                            key={child.id}
                            onClick={() => scrollToSection(child.id)}
                            className={`flex items-center w-full rounded-lg py-1.5 px-2 text-[11px] font-medium tracking-wide transition-all ${
                              isChildActive
                                ? "text-sky-400 bg-sky-950/15 font-semibold"
                                : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/20"
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full mr-2 shrink-0 ${isChildActive ? "bg-sky-400" : "bg-slate-700"}`} />
                            <span className="truncate">{child.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Identity & Diagnostics Control */}
      <div className="px-2.5 flex flex-col space-y-2 shrink-0 border-t border-slate-900/40 pt-4">
        {/* Toggle Diagnostics Console */}
        <button
          onClick={onToggleMetrics}
          className={`relative flex items-center w-full rounded-xl py-2 px-3 transition-all ${
            showMetrics 
              ? "text-emerald-400 bg-emerald-950/15 border border-emerald-500/20" 
              : "text-slate-400 hover:bg-slate-900/30"
          }`}
        >
          <div className="flex items-center justify-center min-w-[20px]">
            <Terminal className="w-4 h-4" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className="ml-3.5 text-[10px] font-mono tracking-wider uppercase whitespace-nowrap"
              >
                Telemetry [CTRL+`]
              </motion.span>
            )}
          </AnimatePresence>
          {!isExpanded && (
            <div className="absolute left-16 bg-slate-950 border border-slate-800 text-slate-200 text-[10px] py-1 px-2.5 rounded-md opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-mono shadow-xl">
              Telemetry Diagnostics
            </div>
          )}
        </button>

        {/* AWS IAM Role Picker Profile */}
        <button
          onClick={onOpenAuth}
          className="relative flex items-center w-full rounded-xl p-1.5 transition-all bg-slate-900/40 border border-slate-800/40 hover:border-sky-500/30 hover:bg-slate-900/60"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-sky-400 shadow-sm shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className="ml-3 flex flex-col items-start overflow-hidden whitespace-nowrap text-left"
              >
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">
                  Active IAM Role
                </span>
                <span className="text-[11px] font-semibold text-slate-200 truncate max-w-[140px]">
                  {activeRole.title}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {!isExpanded && (
            <div className="absolute left-16 bg-slate-950 border border-slate-800 text-slate-200 text-[10px] py-1 px-2.5 rounded-md opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-sans shadow-xl">
              SSO: {activeRole.title}
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
}
