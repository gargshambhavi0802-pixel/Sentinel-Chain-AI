import { useEffect, useRef } from "react";

interface NodePoint {
  id: string;
  x: number; // normalized coordinate (0 to 1)
  y: number; // virtual coordinate (0 to 3200)
  label: string;
  status: "active" | "warn" | "critical";
  layer: "global" | "cloud" | "local";
}

interface Connection {
  fromId: string;
  toId: string;
  progress: number;
  speed: number;
  type: "shipping" | "neural" | "pipeline";
}

interface Satellite {
  id: string;
  x: number; // calculated in orbit
  y: number; // virtual height
  orbitRadius: number;
  angle: number;
  speed: number;
  label: string;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize scroll position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Global logistics junctions coordinates mapped to a virtual space spanning 0 to 3200px
    const nodes: NodePoint[] = [
      // 1. Global Logistics Junctions (Virtual Y: 150 to 800)
      { id: "Shanghai", x: 0.75, y: 380, label: "Shanghai Port Complex", status: "active", layer: "global" },
      { id: "Singapore", x: 0.71, y: 520, label: "Singapore Transit Hub", status: "active", layer: "global" },
      { id: "Suez", x: 0.51, y: 350, label: "Suez Canal Corridor", status: "warn", layer: "global" },
      { id: "Rotterdam", x: 0.45, y: 220, label: "Rotterdam Entry Port", status: "active", layer: "global" },
      { id: "LosAngeles", x: 0.16, y: 340, label: "Los Angeles Terminal", status: "critical", layer: "global" },
      { id: "NewYork", x: 0.28, y: 260, label: "New York Port", status: "active", layer: "global" },
      { id: "CapeTown", x: 0.53, y: 740, label: "Cape of Good Hope", status: "active", layer: "global" },
      { id: "Sydney", x: 0.84, y: 720, label: "Sydney Terminal", status: "active", layer: "global" },

      // 2. AWS & AI Neural Nodes (Virtual Y: 1100 to 1900)
      { id: "BedrockInference", x: 0.22, y: 1180, label: "BEDROCK-INFERENCE-GATEWAY", status: "active", layer: "cloud" },
      { id: "SageMaker", x: 0.42, y: 1350, label: "SAGEMAKER-OPTIMIZER-NODE", status: "active", layer: "cloud" },
      { id: "Route53", x: 0.78, y: 1220, label: "ROUTE53-LOGISTICS-ROUTER", status: "active", layer: "cloud" },
      { id: "LambdaTransit", x: 0.31, y: 1580, label: "LAMBDA-TRANSIT-SIMULATOR", status: "active", layer: "cloud" },
      { id: "DynamoDbHub", x: 0.68, y: 1480, label: "DYNAMODB-TELEMETRY-HUB", status: "active", layer: "cloud" },
      { id: "SnsDispatch", x: 0.85, y: 1720, label: "SNS-ALARM-DISPATCH", status: "warn", layer: "cloud" },
      { id: "CloudWatchIntel", x: 0.15, y: 1820, label: "CLOUDWATCH-INTELLIGENCE", status: "active", layer: "cloud" },

      // 3. Local Tactical Risk Nodes (Virtual Y: 2200 to 3000)
      { id: "SuezBypass", x: 0.33, y: 2250, label: "SUEZ-BYPASS-GATEWAY", status: "active", layer: "local" },
      { id: "PanPacific", x: 0.68, y: 2380, label: "PAN-PACIFIC-TRANSIT", status: "active", layer: "local" },
      { id: "RotterdamBerthA", x: 0.18, y: 2750, label: "ROTTERDAM-BERTH-A", status: "active", layer: "local" },
      { id: "ApacCoherence", x: 0.82, y: 2850, label: "APAC-SUPPLY-COHERENCE", status: "active", layer: "local" },
      { id: "SentinelPrimary", x: 0.50, y: 2550, label: "SENTINEL-CORE-PRIMARY", status: "active", layer: "local" }
    ];

    const connections: Connection[] = [
      // Global layer links (Shipping lines)
      { fromId: "Shanghai", toId: "Singapore", progress: 0.0, speed: 0.0015, type: "shipping" },
      { fromId: "Singapore", toId: "Suez", progress: 0.25, speed: 0.0009, type: "shipping" },
      { fromId: "Suez", toId: "Rotterdam", progress: 0.5, speed: 0.0008, type: "shipping" },
      { fromId: "Shanghai", toId: "LosAngeles", progress: 0.1, speed: 0.0007, type: "shipping" },
      { fromId: "LosAngeles", toId: "NewYork", progress: 0.6, speed: 0.0012, type: "shipping" },
      { fromId: "Rotterdam", toId: "NewYork", progress: 0.3, speed: 0.001, type: "shipping" },
      { fromId: "Singapore", toId: "CapeTown", progress: 0.15, speed: 0.0006, type: "shipping" },
      { fromId: "CapeTown", toId: "Rotterdam", progress: 0.45, speed: 0.0007, type: "shipping" },
      { fromId: "Singapore", toId: "Sydney", progress: 0.7, speed: 0.0016, type: "shipping" },

      // Cloud layer links (Neural circuitry)
      { fromId: "BedrockInference", toId: "SageMaker", progress: 0.0, speed: 0.002, type: "neural" },
      { fromId: "Route53", toId: "DynamoDbHub", progress: 0.3, speed: 0.0018, type: "neural" },
      { fromId: "SageMaker", toId: "LambdaTransit", progress: 0.6, speed: 0.0022, type: "neural" },
      { fromId: "DynamoDbHub", toId: "SnsDispatch", progress: 0.1, speed: 0.0015, type: "neural" },
      { fromId: "LambdaTransit", toId: "CloudWatchIntel", progress: 0.4, speed: 0.0025, type: "neural" },
      { fromId: "DynamoDbHub", toId: "LambdaTransit", progress: 0.7, speed: 0.0017, type: "neural" },
      { fromId: "BedrockInference", toId: "Route53", progress: 0.5, speed: 0.0014, type: "neural" },

      // Local tactical layer links (Encrypted pipelines)
      { fromId: "SuezBypass", toId: "SentinelPrimary", progress: 0.0, speed: 0.0016, type: "pipeline" },
      { fromId: "PanPacific", toId: "SentinelPrimary", progress: 0.35, speed: 0.0018, type: "pipeline" },
      { fromId: "SentinelPrimary", toId: "RotterdamBerthA", progress: 0.7, speed: 0.002, type: "pipeline" },
      { fromId: "SentinelPrimary", toId: "ApacCoherence", progress: 0.15, speed: 0.0015, type: "pipeline" },
      { fromId: "SuezBypass", toId: "RotterdamBerthA", progress: 0.5, speed: 0.0012, type: "pipeline" }
    ];

    // Satellites orbiting in the top layers
    const satellites: Satellite[] = [
      { id: "sat-1", x: 0, y: 80, orbitRadius: 220, angle: 0, speed: 0.0008, label: "SAT-SENTINEL-ALPHA" },
      { id: "sat-2", x: 0, y: 120, orbitRadius: 340, angle: Math.PI * 0.6, speed: 0.0006, label: "SAT-SENTINEL-BETA" },
      { id: "sat-3", x: 0, y: 95, orbitRadius: 280, angle: Math.PI * 1.3, speed: 0.0007, label: "SAT-SENTINEL-GAMMA" }
    ];

    // Stylized vector continents coordinates (normalized x, absolute virtual y)
    const continents = [
      // North America
      [
        { x: 0.10, y: 180 }, { x: 0.28, y: 150 }, { x: 0.34, y: 210 },
        { x: 0.31, y: 340 }, { x: 0.24, y: 390 }, { x: 0.18, y: 460 },
        { x: 0.11, y: 340 }, { x: 0.07, y: 240 }
      ],
      // South America
      [
        { x: 0.24, y: 470 }, { x: 0.31, y: 530 }, { x: 0.34, y: 690 },
        { x: 0.27, y: 860 }, { x: 0.21, y: 630 }, { x: 0.19, y: 530 }
      ],
      // Eurasia / Europe / Asia
      [
        { x: 0.43, y: 140 }, { x: 0.65, y: 110 }, { x: 0.88, y: 130 },
        { x: 0.86, y: 390 }, { x: 0.71, y: 460 }, { x: 0.58, y: 430 },
        { x: 0.44, y: 330 }, { x: 0.39, y: 210 }
      ],
      // Africa
      [
        { x: 0.44, y: 350 }, { x: 0.57, y: 350 }, { x: 0.61, y: 490 },
        { x: 0.54, y: 730 }, { x: 0.47, y: 590 }, { x: 0.41, y: 470 }
      ],
      // Australia
      [
        { x: 0.75, y: 590 }, { x: 0.87, y: 570 }, { x: 0.85, y: 710 },
        { x: 0.73, y: 690 }
      ]
    ];

    // Background particles representing logistics telemetry nodes / stars
    const particles: { x: number; y: number; size: number; alpha: number; speed: number; depth: number }[] = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * 3200, // covers full virtual height
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.2 + 0.05,
        depth: Math.random() * 0.6 + 0.4 // parallax depth multiplier
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Quadratic Bezier interpolation for curved shipping route paths
    const drawCurve = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      dash = false
    ) => {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2 - Math.abs(x1 - x2) * 0.06; // sphere curvature
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(midX, midY, x2, y2);
      if (dash) {
        ctx.setLineDash([3, 5]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
    };

    const getCurvePoint = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      t: number
    ) => {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2 - Math.abs(x1 - x2) * 0.06;
      const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
      const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;
      return { x, y };
    };

    const draw = () => {
      // 1. Base Deep Midnight background (#050B14)
      ctx.fillStyle = "rgba(5, 11, 20, 1)";
      ctx.fillRect(0, 0, width, height);

      const scrollY = scrollYRef.current;
      const time = Date.now();

      // Parallax multiplier for the main layers
      // This maps the virtual space slowly, giving the feeling of scrolling into depth
      const scrollOffset = scrollY * 0.45;

      // 2. Atmospheric lighting layer (Dynamic Radial spots - Aurora Green / Emerald Glows)
      const glow1X = width * 0.25 + Math.sin(time * 0.0005) * 50;
      const glow1Y = height * 0.4 + Math.cos(time * 0.0004) * 80 - scrollOffset * 0.2;
      const radialGlow1 = ctx.createRadialGradient(glow1X, glow1Y, 50, glow1X, glow1Y, 550);
      radialGlow1.addColorStop(0, "rgba(29, 233, 182, 0.05)"); // Aurora Mint (#1DE9B6)
      radialGlow1.addColorStop(0.5, "rgba(124, 255, 203, 0.015)"); // Highlight Glow (#7CFFCB)
      radialGlow1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radialGlow1;
      ctx.beginPath();
      ctx.arc(glow1X, glow1Y, 550, 0, Math.PI * 2);
      ctx.fill();

      const glow2X = width * 0.75 + Math.cos(time * 0.0006) * 60;
      const glow2Y = height * 0.65 + Math.sin(time * 0.0005) * 60 - scrollOffset * 0.3;
      const radialGlow2 = ctx.createRadialGradient(glow2X, glow2Y, 50, glow2X, glow2Y, 650);
      radialGlow2.addColorStop(0, "rgba(0, 194, 168, 0.04)"); // Deep Emerald (#00C2A8)
      radialGlow2.addColorStop(0.6, "rgba(29, 233, 182, 0.012)"); // Aurora Mint
      radialGlow2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radialGlow2;
      ctx.beginPath();
      ctx.arc(glow2X, glow2Y, 650, 0, Math.PI * 2);
      ctx.fill();

      // 3. Subtle background grid coordinates
      ctx.strokeStyle = "rgba(29, 233, 182, 0.012)";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      const gridSize = 100;
      // Scroll-dependent grid offset
      const gridYOffset = -(scrollOffset % gridSize);
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = gridYOffset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 4. Draw particle stars with relative scroll depth parallax
      particles.forEach((p) => {
        // Compute visual coordinate
        const px = p.x;
        // Parallax scroll calculation: deeper particles scroll slower
        const py = (p.y - scrollOffset * p.depth + 3200) % 3200;

        ctx.fillStyle = `rgba(124, 255, 203, ${p.alpha * (0.35 + 0.25 * Math.sin(time * 0.001 + p.y))})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Draw Faint Vectorized World Map continents in Global Logistics layer (upper screen)
      const mapAlpha = Math.max(0, 1 - scrollY / 1000); // Fades out as we scroll deep into cloud/local layers
      if (mapAlpha > 0.01) {
        ctx.strokeStyle = `rgba(29, 233, 182, ${0.035 * mapAlpha})`;
        ctx.fillStyle = `rgba(0, 194, 168, ${0.008 * mapAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);

        continents.forEach((polygon) => {
          ctx.beginPath();
          polygon.forEach((pt, index) => {
            const px = pt.x * width;
            const py = pt.y - scrollOffset;
            if (index === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          });
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
      }

      // Helper to compute node position in viewport space
      const getNodePos = (n: NodePoint) => {
        const px = n.x * width;
        const py = n.y - scrollOffset;
        return { x: px, y: py };
      };

      // 6. Draw connection lines (Shipping lines, neural lines, pipelines)
      connections.forEach((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.fromId);
        const toNode = nodes.find((n) => n.id === conn.toId);
        if (!fromNode || !toNode) return;

        const p1 = getNodePos(fromNode);
        const p2 = getNodePos(toNode);

        // Check if connection is in visible viewport vertical window
        if (
          (p1.y < -150 && p2.y < -150) ||
          (p1.y > height + 150 && p2.y > height + 150)
        ) {
          return; // Skip drawing offscreen connections
        }

        // Establish styled styles based on connection layer (Aurora Green palette)
        let lineColor = "rgba(29, 233, 182, 0.08)"; // Aurora Mint
        let pulseColor = "rgba(124, 255, 203, 0.85)"; // Highlight Glow
        let isDashed = true;

        if (conn.type === "neural") {
          lineColor = "rgba(0, 194, 168, 0.1)"; // Deep Emerald
          pulseColor = "rgba(29, 233, 182, 0.9)"; // Aurora Mint
          isDashed = false;
        } else if (conn.type === "pipeline") {
          lineColor = "rgba(124, 255, 203, 0.09)"; // Highlight Glow
          pulseColor = "rgba(29, 233, 182, 0.95)"; // Aurora Mint
          isDashed = true;
        }

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = conn.type === "shipping" ? 1.5 : 1.0;
        
        // Draw path
        if (conn.type === "shipping") {
          drawCurve(p1.x, p1.y, p2.x, p2.y, isDashed);
        } else {
          // Circuit lines (with orthogonal look sometimes, or clean straight lines)
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          if (isDashed) {
            ctx.setLineDash([4, 5]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.stroke();
        }

        // 7. Update packet progress & render packet carrier
        conn.progress += conn.speed;
        if (conn.progress > 1.0) conn.progress = 0;

        let carrierPos;
        if (conn.type === "shipping") {
          carrierPos = getCurvePoint(p1.x, p1.y, p2.x, p2.y, conn.progress);
        } else {
          carrierPos = {
            x: p1.x + (p2.x - p1.x) * conn.progress,
            y: p1.y + (p2.y - p1.y) * conn.progress
          };
        }

        // Render traveling data carrier
        ctx.shadowBlur = 8;
        ctx.shadowColor = pulseColor;
        ctx.fillStyle = pulseColor;
        ctx.beginPath();
        ctx.arc(carrierPos.x, carrierPos.y, conn.type === "shipping" ? 2.5 : 2.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // 8. Draw orbiting space satellites and direct communication laser telemetry beams
      satellites.forEach((sat) => {
        // Orbit around a virtual top point
        sat.angle += sat.speed;
        sat.x = 0.5 + Math.cos(sat.angle) * (sat.orbitRadius / width);
        
        const px = sat.x * width;
        const py = sat.y - scrollOffset * 0.25; // Satellites parallax is slower (extreme altitude look)

        // Draw satellite crosshair if visible
        if (py >= -50 && py <= height + 50) {
          ctx.strokeStyle = "rgba(29, 233, 182, 0.25)";
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          
          // Outer target circle
          ctx.beginPath();
          ctx.arc(px, py, 10 + 2 * Math.sin(time * 0.003), 0, Math.PI * 2);
          ctx.stroke();

          // Core cross point
          ctx.fillStyle = "rgba(124, 255, 203, 0.9)";
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();

          // Satellite radar sweep arc
          ctx.strokeStyle = "rgba(29, 233, 182, 0.1)";
          ctx.beginPath();
          ctx.arc(px, py, 45, sat.angle, sat.angle + Math.PI * 0.4);
          ctx.stroke();

          // Draw floating label
          ctx.font = "8px ui-monospace, SFMono-Regular, Consolas, monospace";
          ctx.fillStyle = "rgba(148, 163, 184, 0.55)";
          ctx.fillText(sat.label, px + 15, py + 3);

          // Projected telemetry tracking laser down to nearest active global node
          const targetNode = nodes[sat.id === "sat-1" ? 4 : sat.id === "sat-2" ? 3 : 0]; // target LA, Rotterdam, or Shanghai
          if (targetNode) {
            const tp = getNodePos(targetNode);
            
            ctx.strokeStyle = `rgba(29, 233, 182, ${0.15 * (0.6 + 0.4 * Math.sin(time * 0.004))})`;
            ctx.lineWidth = 0.8;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(tp.x, tp.y);
            ctx.stroke();
          }
        }
      });

      // 9. Draw the junction points/nodes across the layer
      nodes.forEach((n) => {
        const p = getNodePos(n);

        // Skip rendering if offscreen
        if (p.y < -80 || p.y > height + 80) return;

        // Determine node system colors based on role status
        let baseColor = "rgba(29, 233, 182, 0.8)"; // Primary Aurora Mint (#1DE9B6)
        let glowColor = "rgba(29, 233, 182, 0.15)";
        let pulseRate = 0.002;

        if (n.status === "warn") {
          baseColor = "rgba(244, 185, 66, 0.85)"; // Warning (#F4B942)
          glowColor = "rgba(244, 185, 66, 0.2)";
          pulseRate = 0.0035;
        } else if (n.status === "critical") {
          baseColor = "rgba(255, 93, 115, 0.95)"; // Critical (#FF5D73)
          glowColor = "rgba(255, 93, 115, 0.25)";
          pulseRate = 0.005;
        } else if (n.layer === "cloud") {
          baseColor = "rgba(0, 194, 168, 0.85)"; // Secondary Deep Emerald (#00C2A8)
          glowColor = "rgba(0, 194, 168, 0.15)";
        } else if (n.layer === "local") {
          baseColor = "rgba(124, 255, 203, 0.85)"; // Highlight Glow (#7CFFCB)
          glowColor = "rgba(124, 255, 203, 0.15)";
        }

        // Draw pulsing outer glow circle
        const scale = 1 + 0.18 * Math.sin(time * pulseRate);
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (n.layer === "global" ? 14 : 10) * scale, 0, Math.PI * 2);
        ctx.fill();

        // Draw subtle node coordinate ticks or technical border bracket
        if (n.layer === "cloud") {
          ctx.strokeStyle = "rgba(0, 194, 168, 0.25)";
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          // Little crosshair or box surrounding the node
          const boxSize = 8;
          ctx.beginPath();
          ctx.moveTo(p.x - boxSize, p.y - boxSize);
          ctx.lineTo(p.x - boxSize + 4, p.y - boxSize);
          ctx.moveTo(p.x - boxSize, p.y - boxSize);
          ctx.lineTo(p.x - boxSize, p.y - boxSize + 4);

          ctx.moveTo(p.x + boxSize, p.y + boxSize);
          ctx.lineTo(p.x + boxSize - 4, p.y + boxSize);
          ctx.moveTo(p.x + boxSize, p.y + boxSize);
          ctx.lineTo(p.x + boxSize, p.y + boxSize - 4);
          ctx.stroke();
        }

        // Node center core
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.layer === "global" ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Subtle node label typography (monospaced)
        ctx.font = n.layer === "global"
          ? "9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          : "8px ui-monospace, SFMono-Regular, Consolas, monospace";
        
        ctx.fillStyle = n.status === "critical"
          ? "rgba(255, 93, 115, 0.7)"
          : n.status === "warn"
            ? "rgba(244, 185, 66, 0.7)"
            : n.layer === "cloud"
              ? "rgba(124, 255, 203, 0.6)"
              : "rgba(148, 163, 184, 0.55)";
        
        ctx.setLineDash([]);
        ctx.fillText(n.label, p.x + (n.layer === "global" ? 10 : 8), p.y + 3);
      });

      // 10. Draw soft continuous global connection line network overlays (AI Neural Mesh patterns)
      // Connect nearby nodes together faintly to create a "neural fabric" look in the center section
      if (scrollY >= 600 && scrollY <= 2400) {
        ctx.strokeStyle = "rgba(29, 233, 182, 0.02)";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        const cloudNodes = nodes.filter((n) => n.layer === "cloud");
        for (let i = 0; i < cloudNodes.length; i++) {
          const p1 = getNodePos(cloudNodes[i]);
          for (let j = i + 1; j < cloudNodes.length; j++) {
            const p2 = getNodePos(cloudNodes[j]);
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 320) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none"
      id="sentinel-background-canvas"
    />
  );
}
