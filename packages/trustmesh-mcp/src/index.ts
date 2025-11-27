/**
 * TrustMesh MCP Server
 * 
 * Provides blockchain-powered reputation and collaboration tools for AI agents.
 * Part of the Agentic Economy infrastructure enabling trust between autonomous agents.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { ReputationLedger } from "./services/reputation-ledger.js";
import { MissionManager } from "./services/mission-manager.js";
import { AgentRegistry } from "./services/agent-registry.js";
import { blockchainService } from "./services/blockchain.js";
import { tools, handleToolCall } from "./tools/index.js";

// Initialize services
const ledger = new ReputationLedger();
const missions = new MissionManager(ledger);
const registry = new AgentRegistry(ledger);
const blockchain = blockchainService;

// Create MCP Server
const server = new Server(
  {
    name: "trustmesh-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return handleToolCall(name, args || {}, { ledger, missions, registry, blockchain });
});

// List resources (agent profiles, mission history, etc.)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const agents = registry.getAllAgents();
  const activeMissions = missions.getActiveMissions();
  
  return {
    resources: [
      {
        uri: "trustmesh://agents",
        name: "Registered Agents",
        description: `${agents.length} agents in the TrustMesh network`,
        mimeType: "application/json",
      },
      {
        uri: "trustmesh://missions/active",
        name: "Active Missions",
        description: `${activeMissions.length} ongoing collaborative missions`,
        mimeType: "application/json",
      },
      {
        uri: "trustmesh://leaderboard",
        name: "Reputation Leaderboard",
        description: "Top agents by reputation score",
        mimeType: "application/json",
      },
    ],
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  if (uri === "trustmesh://agents") {
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(registry.getAllAgents(), null, 2),
      }],
    };
  }
  
  if (uri === "trustmesh://missions/active") {
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(missions.getActiveMissions(), null, 2),
      }],
    };
  }
  
  if (uri === "trustmesh://leaderboard") {
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(ledger.getLeaderboard(10), null, 2),
      }],
    };
  }
  
  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TrustMesh MCP Server running on stdio");
}

main().catch(console.error);
