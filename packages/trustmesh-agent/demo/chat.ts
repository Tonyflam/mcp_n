#!/usr/bin/env tsx
/**
 * TrustMesh AI Chat Demo
 * 
 * Interactive chat with an AI agent that uses TrustMesh capabilities.
 * Requires ANTHROPIC_API_KEY environment variable.
 */

import * as readline from "readline";
import { TrustMeshAgent } from "../src/index.js";
import { ReputationLedger } from "../src/services/reputation-ledger.js";
import { MissionManager } from "../src/services/mission-manager.js";
import { AgentRegistry } from "../src/services/agent-registry.js";

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  dim: "\x1b[2m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    log("\n⚠️  ANTHROPIC_API_KEY not set. Running in demo mode.\n", "yellow");
    log("Set the environment variable to enable full AI chat capabilities:", "dim");
    log("  export ANTHROPIC_API_KEY=your_key_here\n", "dim");
    log("Starting offline demo instead...\n", "cyan");
    
    // Import and run the basic demo
    const demo = await import("./demo.js");
    return;
  }

  // Initialize shared services
  const ledger = new ReputationLedger();
  const missions = new MissionManager(ledger);
  const registry = new AgentRegistry(ledger);
  const services = { ledger, missions, registry };

  // Pre-populate with some agents
  const helperAgents = [
    registry.registerAgent("DataBot", "Expert in data analysis and visualization", ["data-analysis", "visualization", "statistics"]),
    registry.registerAgent("CodeMaster", "Full-stack developer specializing in Web3", ["smart-contracts", "solidity", "web3", "frontend"]),
    registry.registerAgent("CreativeAI", "Content creation and marketing specialist", ["content-writing", "marketing", "design"]),
  ];

  // Add some reputation to existing agents
  for (const agent of helperAgents) {
    ledger.recordReputation(agent.id, "init-mission", 100, "completion", "system");
  }

  // Create main agent
  const agent = new TrustMeshAgent({
    name: "TrustMesh Assistant",
    description: "Your guide to the TrustMesh network - helping you discover agents, create missions, and build reputation",
    capabilities: ["agent-discovery", "mission-management", "reputation-tracking", "collaboration"],
  }, services);

  await agent.initialize();

  // Banner
  console.log(`
${colors.cyan}╔══════════════════════════════════════════════════════════════════╗
║                                                                    ║
║   🌐  TrustMesh AI Chat                                            ║
║                                                                    ║
║   Your intelligent guide to the Agentic Economy                    ║
║                                                                    ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}
`);

  log("I'm the TrustMesh Assistant, powered by Claude AI.", "bright");
  log("I can help you navigate the TrustMesh network:\n", "reset");
  log("  • Discover agents with specific capabilities", "green");
  log("  • Create collaborative missions", "green");
  log("  • Check reputation and trust levels", "green");
  log("  • Find available missions to join", "green");
  log("  • View the reputation leaderboard\n", "green");
  
  log("Try asking things like:", "dim");
  log('  "Find me agents who know Web3 development"', "cyan");
  log('  "Create a mission to build a DeFi dashboard"', "cyan");
  log('  "Show me the reputation leaderboard"', "cyan");
  log('  "What\'s my current reputation?"\n', "cyan");
  
  log("Type 'exit' to quit.\n", "dim");

  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = () => {
    rl.question(`${colors.yellow}You: ${colors.reset}`, async (input) => {
      const trimmed = input.trim();
      
      if (!trimmed) {
        prompt();
        return;
      }
      
      if (trimmed.toLowerCase() === "exit" || trimmed.toLowerCase() === "quit") {
        log("\n👋 Thanks for exploring TrustMesh! See you in the Agentic Economy.\n", "cyan");
        rl.close();
        process.exit(0);
      }

      try {
        log("\n🤔 Thinking...", "dim");
        const response = await agent.chat(trimmed);
        log(`\n${colors.cyan}TrustMesh Assistant:${colors.reset} ${response}\n`, "reset");
      } catch (error) {
        log(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}\n`, "yellow");
      }
      
      prompt();
    });
  };

  prompt();
}

main().catch(console.error);
