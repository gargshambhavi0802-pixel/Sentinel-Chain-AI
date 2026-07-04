import { useState, useEffect } from "react";
import AnimatedBackground from "./components/AnimatedBackground";
import Sidebar from "./components/Sidebar";
import AuthModal, { IAM_ROLES } from "./components/AuthModal";
import MetricsOverlay from "./components/MetricsOverlay";
import GlobalIntelligence from "./components/GlobalIntelligence";
import GlobalMonitoring from "./components/GlobalMonitoring";
import IncomingDisruptions from "./components/IncomingDisruptions";
import AwsPipeline from "./components/AwsPipeline";
import AiReasoning from "./components/AiReasoning";
import BusinessImpact from "./components/BusinessImpact";
import Recommendations from "./components/Recommendations";
import Notifications from "./components/Notifications";
import BusinessValue from "./components/BusinessValue";
import Team from "./components/Team";
import { IAMRole, Disruption } from "./types";
import CognitoAuthPage, { CognitoUser } from "./components/CognitoAuthPage";
import { LogOut, User } from "lucide-react";
import { authService } from "./services/authService";

// Import our rich Enterprise Pages & Dashboards
import { 
  DashboardOverview, 
  LiveShipmentTracking, 
  DelayedShipments, 
  SupplierHealth, 
  AlternativeSuppliers, 
  RouteOptimization, 
  InventorySuggestions, 
  RiskTrends, 
  Reports, 
  VoiceAssistant, 
  AiChat, 
  Profile, 
  CognitoLogin 
} from "./components/EnterprisePages";

const VALID_SECTIONS = [
  "dashboard",
  "live-risk-map",
  "global-threat-feed",
  "active-disruptions",
  "incident-details",
  "live-shipment-tracking",
  "delayed-shipments",
  "supplier-health",
  "alternative-suppliers",
  "recovery-actions",
  "route-optimization",
  "inventory-suggestions",
  "risk-trends",
  "business-impact",
  "reports",
  "voice-assistant",
  "ai-chat",
  "notifications",
  "profile",
  "cognito-login",
  "team-roles"
];

const mapCognitoRoleToIam = (cognitoRole: string): IAMRole => {
  switch (cognitoRole) {
    case "Admin":
      return IAM_ROLES.find(r => r.type === "SystemAdministrator") || IAM_ROLES[3];
    case "Supply Chain Manager":
      return IAM_ROLES.find(r => r.type === "LogisticsOfficer") || IAM_ROLES[1];
    case "Logistics Executive":
      return IAM_ROLES.find(r => r.type === "LogisticsOfficer") || IAM_ROLES[1];
    case "Analyst":
      return IAM_ROLES.find(r => r.type === "SecurityAuditor") || IAM_ROLES[2];
    default:
      return IAM_ROLES[0];
  }
};

export default function App() {
  // Amazon Cognito user session (persisted via localStorage)
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);
const [loadingAuth, setLoadingAuth] = useState(true);
const [activeRole, setActiveRole] = useState<IAMRole>(IAM_ROLES[0]);

  const [showAuth, setShowAuth] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [activeDisruption, setActiveDisruption] = useState<Disruption | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Progress states: idle -> ingest -> processing -> reasoning -> storage -> notification -> done
  const [pipelineStep, setPipelineStep] = useState<"idle" | "ingest" | "processing" | "reasoning" | "storage" | "notification" | "done">("idle");

  // Hash routing active section state
  const [activeSection, setActiveSection] = useState<string>(() => {
    const hash = window.location.hash.slice(1);
    return VALID_SECTIONS.includes(hash) ? hash : "dashboard";
  });


  // Listen to hash changes for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (VALID_SECTIONS.includes(hash)) {
        setActiveSection(hash);
      } else if (!hash) {
        setActiveSection("dashboard");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Ensure scroll position is reset to the top whenever active section changes
  useEffect(() => {
  authService.getCurrentUser().then((user) => {
    if (user) {
      setCognitoUser(user);
      setActiveRole(mapCognitoRoleToIam(user.role));
    }

    setLoadingAuth(false);
  });
}, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  // Keyboard shortcut listener to toggle diagnostics console (Ctrl+` or ` key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle metrics using Ctrl + ` (backtick) or single ` key press
      if (e.key === "`" || (e.key === "t" && e.ctrlKey)) {
        setShowMetrics(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sequential data-pipeline animation when a threat scenario is initiated
  // Fixed: No page automatically redirects to AI Reasoning. The user navigates independently.
  const handleAnalyzeDisruption = (disruption: Disruption) => {
    setIsAnalyzing(true);
    setPipelineStep("ingest");

    // Step-by-step progress simulation
    setTimeout(() => {
      setPipelineStep("processing"); // S3 -> Lambda
      setTimeout(() => {
        setPipelineStep("reasoning"); // Lambda -> Bedrock LLM
        setTimeout(() => {
          setPipelineStep("storage"); // Bedrock -> DynamoDB
          setTimeout(() => {
            setPipelineStep("notification"); // DynamoDB -> SNS
            setTimeout(() => {
              setPipelineStep("done"); // SNS -> complete
              setActiveDisruption(disruption);
              setIsAnalyzing(false);
              // Simply alert completion within the current console without redirecting
            }, 900);
          }, 900);
        }, 900);
      }, 900);
    }, 900);
  };

  const handleDeploySuccess = (reductionValue: number) => {
    console.log(`Mitigation playbook deployed. Risk reduced by ${reductionValue}%`);
    // Route directly to notifications to see the SNS transmission dispatch!
    setTimeout(() => {
      window.location.hash = "notifications";
    }, 1200);
  };

  const handleExplore = () => {
    window.location.hash = "active-disruptions";
  };

  const handleNavigate = (section: string) => {
    window.location.hash = section;
    setActiveSection(section);
  };

  const handleLoginSuccess = (user: CognitoUser) => {

    setCognitoUser(user);
    setActiveRole(mapCognitoRoleToIam(user.role));
    window.location.hash = "dashboard";
    setActiveSection("dashboard");
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setCognitoUser(null);
  };

  // Protected Routes Check: Require authenticated Cognito User pool session
  if (loadingAuth) {
  return null;
}
  if (!cognitoUser) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden antialiased flex items-center justify-center">
        <AnimatedBackground />
        <CognitoAuthPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100 overflow-x-hidden antialiased">
      {/* 1. Canvas Background */}
      <AnimatedBackground />

      {/* Top-Right Authenticated User & Cognito Role Banner */}
      <div id="cognito-top-profile" className="fixed top-5 right-5 z-40 flex items-center space-x-3 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md py-1.5 pl-3 pr-2.5 rounded-xl shadow-xl hover:border-sky-500/30 transition-all select-none">
        <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
          <User className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-slate-200 leading-tight">{cognitoUser.name}</span>
          <span className="text-[9px] text-sky-400 font-mono font-semibold tracking-wider uppercase">{cognitoUser.role}</span>
        </div>
        <div className="h-6 w-[1px] bg-slate-800" />
        <button
          onClick={handleSignOut}
          className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 hover:text-red-400 text-slate-400 border border-slate-850 hover:border-red-500/20 transition-all cursor-pointer flex items-center justify-center shrink-0"
          title="Sign Out of Amazon Cognito session"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Glass Left Sidebar */}
      <Sidebar
        activeRole={activeRole}
        onOpenAuth={() => setShowAuth(true)}
        onToggleMetrics={() => setShowMetrics(prev => !prev)}
        showMetrics={showMetrics}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* 3. Main Scroll Container for the Homepage Cinematic Journey */}
      <main className="pl-[84px] sm:pl-24 pr-4 md:pr-10 w-full flex flex-col relative z-10 py-8 min-h-[calc(100vh-48px)]">
        
        {/* Section 1: Dashboard Overview */}
        {activeSection === "dashboard" && (
          <DashboardOverview
            activeRole={activeRole}
            onNavigate={handleNavigate}
            isAnalyzing={isAnalyzing}
            activeDisruption={activeDisruption}
            pipelineStep={pipelineStep}
          />
        )}

        {/* Section 2: Global Intelligence — Live Risk Map */}
        {activeSection === "live-risk-map" && (
          <GlobalIntelligence
            activeRole={activeRole}
            onOpenAuth={() => setShowAuth(true)}
            onExplore={handleExplore}
            mode="map"
          />
        )}

        {/* Section 3: Global Intelligence — Global Threat Feed */}
        {activeSection === "global-threat-feed" && (
          <GlobalIntelligence
            activeRole={activeRole}
            onOpenAuth={() => setShowAuth(true)}
            onExplore={handleExplore}
            mode="feed"
          />
        )}

        {/* Section 4: Incidents — Active Disruptions */}
        {activeSection === "active-disruptions" && (
          <IncomingDisruptions
            onAnalyzeDisruption={handleAnalyzeDisruption}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Section 5: Incidents — Incident Details */}
        {activeSection === "incident-details" && (
          <AiReasoning activeDisruption={activeDisruption} isAnalyzing={isAnalyzing} />
        )}

        {/* Section 6: Shipments — Live Shipment Tracking */}
        {activeSection === "live-shipment-tracking" && (
          <LiveShipmentTracking />
        )}

        {/* Section 7: Shipments — Delayed Shipments */}
        {activeSection === "delayed-shipments" && (
          <DelayedShipments onNavigate={handleNavigate} />
        )}

        {/* Section 8: Suppliers — Supplier Health */}
        {activeSection === "supplier-health" && (
          <SupplierHealth />
        )}

        {/* Section 9: Suppliers — Alternative Suppliers */}
        {activeSection === "alternative-suppliers" && (
          <AlternativeSuppliers />
        )}

        {/* Section 10: AI Recommendations — Recovery Actions */}
        {activeSection === "recovery-actions" && (
          <Recommendations
            activeDisruption={activeDisruption}
            onDeploySuccess={handleDeploySuccess}
          />
        )}

        {/* Section 11: AI Recommendations — Route Optimization */}
        {activeSection === "route-optimization" && (
          <RouteOptimization />
        )}

        {/* Section 12: AI Recommendations — Inventory Suggestions */}
        {activeSection === "inventory-suggestions" && (
          <InventorySuggestions />
        )}

        {/* Section 13: Analytics — Risk Trends */}
        {activeSection === "risk-trends" && (
          <RiskTrends />
        )}

        {/* Section 14: Analytics — Business Impact */}
        {activeSection === "business-impact" && (
          <BusinessImpact activeDisruption={activeDisruption} />
        )}

        {/* Section 15: Analytics — Reports */}
        {activeSection === "reports" && (
          <Reports />
        )}

        {/* Section 16: AI Assistant — Voice Assistant */}
        {activeSection === "voice-assistant" && (
          <VoiceAssistant />
        )}

        {/* Section 17: AI Assistant — AI Chat */}
        {activeSection === "ai-chat" && (
          <AiChat />
        )}

        {/* Section 18: Notifications */}
        {activeSection === "notifications" && (
          <Notifications />
        )}

        {/* Section 19: Settings — Profile */}
        {activeSection === "profile" && (
          <Profile activeRole={activeRole} onOpenAuth={() => setShowAuth(true)} />
        )}

        {/* Section 20: Settings — Amazon Cognito Login */}
        {activeSection === "cognito-login" && (
          <CognitoLogin activeRole={activeRole} onOpenAuth={() => setShowAuth(true)} />
        )}

        {/* Section 21: Settings — Team & Roles */}
        {activeSection === "team-roles" && (
          <Team />
        )}
      </main>

      {/* 4. Federated IAM / SSO Authorization Portal Modal Overlay */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
      />

      {/* 5. Operations Diagnostics Floating Console Telemetry */}
      <MetricsOverlay
        isOpen={showMetrics}
        onClose={() => setShowMetrics(false)}
      />
    </div>
  );
}
