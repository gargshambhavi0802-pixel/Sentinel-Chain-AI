import { motion } from "motion/react";
import { Users, Github, ArrowUpRight, ShieldCheck, Mail } from "lucide-react";

export default function Team() {
  const teamMembers = [
    {
      name: "Apoorva Kumar Jha",
      role: "Lead Systems Architect & Creator",
      clearance: "L10 Administrator",
      org: "DTU Delhi / SentinelChain Core Team",
      badges: ["AWS Certified Architect", "AI Research", "MIT Supply Chain Cert"],
      bio: "Engineered SentinelChain's serverless pipeline triggers, integrating Amazon Bedrock reasoning structures and dual-route logistics estimators.",
      github: "https://github.com/mysterio-Apoorva",
      email: "apoorvakumarjha_cse_25a01051@dtu.ac.in"
    },
    {
      name: "Siddhi Garg",
      role: "Lead AI Scientist & ML Engineer",
      clearance: "L9 Developer",
      org: "DTU Delhi / SentinelChain Core Team",
      badges: ["NLP Specialist", "TensorFlow Fellow", "Bedrock Integrator"],
      bio: "Authored the core predictive intelligence models, implementing dual-layered transformer classification systems to cross-verify news signals and automate anomaly severity routing.",
      github: "https://github.com/siddhi-garg",
      email: "siddhigarg_cse_25a01052@dtu.ac.in"
    },
    {
      name: "Shambhavi Garg",
      role: "Operations Director & Risk Strategist",
      clearance: "L9 Developer",
      org: "DTU Delhi / SentinelChain Core Team",
      badges: ["Supply Chain Analytics", "Decision Systems", "Operations Research"],
      bio: "Created the dual-route simulation matrix and mitigation playbooks, defining automated cost-routing algorithms and alternative route-selection priority engines.",
      github: "https://github.com/shambhavi-garg",
      email: "shambhavigarg_cse_25a01053@dtu.ac.in"
    },
    {
      name: "Shreya Gupta",
      role: "Cloud Infrastructure Engineer & Security Auditor",
      clearance: "L9 Developer",
      org: "DTU Delhi / SentinelChain Core Team",
      badges: ["AWS SysOps Admin", "DevSecOps Specialist", "Secure IAM Arch"],
      bio: "Architected the Amazon DynamoDB schema and secure API gateways, optimizing WebSocket triggers and IAM permissions to ensure real-time telemetry syncing under 40ms.",
      github: "https://github.com/shreya-gupta",
      email: "shreyagupta_cse_25a01054@dtu.ac.in"
    }
  ];

  return (
    <section
      id="team"
      className="min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-slate-950/10 relative"
    >
      <div className="w-full max-w-5xl">
        {/* Title */}
        <div className="text-left mb-12">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-2">Stage X — Project Governance</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 uppercase">Core Systems Architects</h2>
          <p className="text-slate-400 text-sm mt-3 max-w-2xl">
            Meet the primary designers and software engineers behind SentinelChain AI&apos;s intelligent cloud frameworks.
          </p>
        </div>

        {/* Members Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="w-full bg-slate-900/35 border border-slate-800 rounded-3xl p-6 md:p-8 text-left hover:border-slate-700 hover:bg-slate-900/50 transition-all flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 relative"
            >
              {/* Profile Icon / Visual Avatar Placeholder */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-600/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 shadow-lg shadow-sky-500/5">
                <Users className="w-8 h-8" />
              </div>

              {/* Bio & Details Column */}
              <div className="space-y-4 flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-850 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{member.name}</h3>
                    <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block mt-0.5">
                      {member.role}
                    </span>
                  </div>
                  
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/15 border border-emerald-500/25 px-2 py-0.5 rounded uppercase self-start">
                    {member.clearance}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {member.bio}
                </p>

                {/* Badges Grid */}
                <div className="flex flex-wrap gap-1.5">
                  {member.badges.map((badge) => (
                    <span key={badge} className="text-[9px] font-mono bg-slate-950 border border-slate-850 text-slate-500 px-2 py-0.5 rounded">
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Social Connects */}
                <div className="flex items-center space-x-3.5 pt-2">
                  <a
                    href={member.github}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="text-[10px] font-mono font-bold text-slate-400 hover:text-sky-400 transition-colors flex items-center space-x-1"
                  >
                    <Github className="w-4 h-4" />
                    <span>GITHUB</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  
                  <a
                    href={`mailto:${member.email}`}
                    className="text-[10px] font-mono font-bold text-slate-400 hover:text-sky-400 transition-colors flex items-center space-x-1"
                  >
                    <Mail className="w-4 h-4" />
                    <span>EMAIL CHANNEL</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Open source badge and repositories links */}
        <div className="mt-8 text-center text-slate-500 font-mono text-[10px] flex justify-center items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>OFFICIAL SENTINELCHAIN REPOSITORY HANDLES SYNCED TO THE CLOUD WORKSPACE</span>
        </div>
      </div>
    </section>
  );
}
