#!/usr/bin/env tsx
/**
 * TrustMesh Interactive Demo
 * 
 * Demonstrates multi-agent collaboration in the TrustMesh network:
 * 1. Multiple AI agents with different capabilities register
 * 2. Agents discover each other based on skills
 * 3. Missions are created and agents collaborate
 * 4. Reputation is earned and tracked on-chain
 */

import { TrustMeshAgent } from "../src/index.js";
import { ReputationLedger } from "../src/services/reputation-ledger.js";
import { MissionManager } from "../src/services/mission-manager.js";
import { AgentRegistry } from "../src/services/agent-registry.js";

// ANSI colors for pretty output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function banner(text: string) {
  const line = "═".repeat(60);
  console.log(`\n${colors.cyan}${line}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  ${text}${colors.reset}`);
  console.log(`${colors.cyan}${line}${colors.reset}\n`);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDemo() {
  banner("🌐 TrustMesh - Decentralized AI Agent Collaboration Network");
  
  log("TrustMesh enables AI agents to:", "bright");
  log("  • Discover and collaborate with other agents", "green");
  log("  • Build on-chain reputation through missions", "green");
  log("  • Verify trust levels before collaboration", "green");
  log("  • Earn NFT credentials for achievements", "green");
  
  await sleep(2000);
  
  // ============================================================
  // PHASE 1: Initialize Shared Services
  // ============================================================
  banner("📦 Phase 1: Initializing TrustMesh Network");
  
  const ledger = new ReputationLedger();
  const missions = new MissionManager(ledger);
  const registry = new AgentRegistry(ledger);
  const sharedServices = { ledger, missions, registry };
  
  log("✓ Reputation Ledger initialized (SQLite)", "green");
  log("✓ Mission Manager ready", "green");
  log("✓ Agent Registry online", "green");
  
  await sleep(1500);
  
  // ============================================================
  // PHASE 2: Register AI Agents
  // ============================================================
  banner("🤖 Phase 2: Registering AI Agents");
  
  // Create diverse agents with different capabilities
  const alexAgent = new TrustMeshAgent({
    name: "Alex the Analyst",
    description: "Expert in data analysis, market research, and financial modeling",
    capabilities: ["data-analysis", "market-research", "financial-modeling", "report-generation"],
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
  }, sharedServices);
  
  const sageAgent = new TrustMeshAgent({
    name: "Sage the Developer",
    description: "Full-stack developer specializing in Web3 and smart contracts",
    capabilities: ["smart-contracts", "solidity", "web3", "frontend-dev", "code-review"],
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
  }, sharedServices);
  
  const novaAgent = new TrustMeshAgent({
    name: "Nova the Creative",
    description: "Creative AI specializing in content, design concepts, and marketing",
    capabilities: ["content-writing", "marketing", "design-concepts", "social-media"],
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
  }, sharedServices);
  
  // Initialize all agents
  await alexAgent.initialize();
  log(`✓ ${alexAgent.getId().slice(0, 8)}... "Alex the Analyst" joined the network`, "cyan");
  
  await sageAgent.initialize();
  log(`✓ ${sageAgent.getId().slice(0, 8)}... "Sage the Developer" joined the network`, "magenta");
  
  await novaAgent.initialize();
  log(`✓ ${novaAgent.getId().slice(0, 8)}... "Nova the Creative" joined the network`, "yellow");
  
  await sleep(1500);
  
  // ============================================================
  // PHASE 3: Agent Discovery
  // ============================================================
  banner("🔍 Phase 3: Agent Discovery");
  
  log("Alex needs help building a DeFi analytics dashboard...", "bright");
  log("Searching for agents with Web3 and frontend capabilities...\n", "reset");
  
  const { registry: reg } = alexAgent.getServices();
  const developers = reg.discoverAgents(["web3", "frontend-dev"], undefined, 5);
  
  for (const result of developers) {
    log(`Found: ${result.agent.name}`, "green");
    log(`  Capabilities: ${result.agent.capabilities.join(", ")}`, "reset");
    log(`  Trust Level: ${result.reputation.trustLevel}`, "reset");
    log(`  Match Score: ${(result.matchScore * 100).toFixed(0)}%\n`, "reset");
  }
  
  await sleep(2000);
  
  // ============================================================
  // PHASE 4: Create Collaborative Mission
  // ============================================================
  banner("🎯 Phase 4: Creating Collaborative Mission");
  
  log("Alex creates a mission for the DeFi Dashboard project...\n", "bright");
  
  const { missions: missionMgr } = alexAgent.getServices();
  const mission = missionMgr.createMission(
    alexAgent.getId(),
    "Build DeFi Analytics Dashboard",
    "Create a comprehensive dashboard for tracking DeFi protocol metrics including TVL, yield rates, and risk analysis. Requires data analysis, smart contract integration, and frontend development.",
    ["data-analysis", "web3", "frontend-dev"],
    "unverified",
    150
  );
  
  log(`📋 Mission Created: ${mission.title}`, "cyan");
  log(`   ID: ${mission.id.slice(0, 8)}...`, "reset");
  log(`   Reward: ${mission.reward} reputation points`, "reset");
  log(`   Required Skills: ${mission.requiredCapabilities.join(", ")}`, "reset");
  log(`   Status: ${mission.status}\n`, "reset");
  
  await sleep(1500);
  
  // ============================================================
  // PHASE 5: Agents Join Mission
  // ============================================================
  banner("🤝 Phase 5: Agents Join the Mission");
  
  // Sage joins as developer
  log("Sage the Developer reviews the mission...", "magenta");
  await sleep(1000);
  
  missionMgr.joinMission(mission.id, sageAgent.getId(), "Lead Developer");
  log("✓ Sage joined as Lead Developer\n", "green");
  
  // Nova joins for marketing dashboard content
  log("Nova the Creative sees an opportunity...", "yellow");
  await sleep(1000);
  
  missionMgr.joinMission(mission.id, novaAgent.getId(), "UX Consultant");
  log("✓ Nova joined as UX Consultant\n", "green");
  
  // Start the mission
  missionMgr.startMission(mission.id, alexAgent.getId());
  log("🚀 Mission is now IN PROGRESS!", "bright");
  
  await sleep(2000);
  
  // ============================================================
  // PHASE 6: Mission Completion & Reputation
  // ============================================================
  banner("🏆 Phase 6: Mission Completion & Reputation Rewards");
  
  log("After successful collaboration, Alex marks the mission complete...\n", "bright");
  
  // Rate participants
  missionMgr.rateParticipant(mission.id, alexAgent.getId(), sageAgent.getId(), 5);
  missionMgr.rateParticipant(mission.id, alexAgent.getId(), novaAgent.getId(), 4);
  missionMgr.rateParticipant(mission.id, sageAgent.getId(), alexAgent.getId(), 5);
  missionMgr.rateParticipant(mission.id, novaAgent.getId(), alexAgent.getId(), 5);
  
  // Complete mission
  const completed = missionMgr.completeMission(
    mission.id,
    alexAgent.getId(),
    {
      success: true,
      summary: "Successfully delivered DeFi Analytics Dashboard with real-time TVL tracking, yield optimization suggestions, and risk scoring.",
      outputs: {
        dashboardUrl: "https://defi-dashboard.trustmesh.io",
        features: ["TVL Tracking", "Yield Analysis", "Risk Scoring", "Portfolio View"],
      },
      participantScores: {
        [alexAgent.getId()]: 150,
        [sageAgent.getId()]: 180,
        [novaAgent.getId()]: 120,
      },
    }
  );
  
  log("✓ Mission COMPLETED successfully!\n", "green");
  
  // Show updated reputations
  log("📊 Updated Reputation Scores:\n", "bright");
  
  const alexRep = ledger.getAgentReputation(alexAgent.getId());
  const sageRep = ledger.getAgentReputation(sageAgent.getId());
  const novaRep = ledger.getAgentReputation(novaAgent.getId());
  
  log(`  Alex the Analyst:`, "cyan");
  log(`    Score: ${alexRep.totalScore} | Missions: ${alexRep.completedMissions} | Trust: ${alexRep.trustLevel}`, "reset");
  
  log(`  Sage the Developer:`, "magenta");
  log(`    Score: ${sageRep.totalScore} | Missions: ${sageRep.completedMissions} | Trust: ${sageRep.trustLevel}`, "reset");
  
  log(`  Nova the Creative:`, "yellow");
  log(`    Score: ${novaRep.totalScore} | Missions: ${novaRep.completedMissions} | Trust: ${novaRep.trustLevel}`, "reset");
  
  await sleep(2000);
  
  // ============================================================
  // PHASE 7: Leaderboard
  // ============================================================
  banner("🏅 Phase 7: TrustMesh Leaderboard");
  
  const leaderboard = ledger.getLeaderboard(10);
  
  log("Top Agents by Reputation:\n", "bright");
  leaderboard.forEach((rep, index) => {
    const agent = reg.getAgent(rep.agentId);
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  ";
    log(`${medal} #${index + 1} ${agent?.name || "Unknown"}`, "green");
    log(`      Score: ${rep.totalScore} | Trust: ${rep.trustLevel}`, "reset");
  });
  
  await sleep(1500);
  
  // ============================================================
  // PHASE 8: Summary
  // ============================================================
  banner("✨ Demo Complete - TrustMesh Highlights");
  
  log("What we demonstrated:", "bright");
  log("  ✓ Multi-agent registration with capabilities", "green");
  log("  ✓ Agent discovery by skill matching", "green");
  log("  ✓ Collaborative mission creation and management", "green");
  log("  ✓ Trust level verification before collaboration", "green");
  log("  ✓ Peer ratings and reputation distribution", "green");
  log("  ✓ On-chain reputation tracking", "green");
  
  log("\nReady for the Agentic Economy! 🚀", "cyan");
  log("\nBuilt for NullShot Hacks: Season 0\n", "magenta");
}

// Run the demo
runDemo().catch(console.error);
