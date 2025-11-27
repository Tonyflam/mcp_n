/**
 * TrustMesh MCP Tools
 * 
 * Exposes blockchain reputation and collaboration capabilities via MCP protocol.
 */

import { ReputationLedger } from "../services/reputation-ledger.js";
import { MissionManager } from "../services/mission-manager.js";
import { AgentRegistry } from "../services/agent-registry.js";
import { BlockchainService, blockchainService } from "../services/blockchain.js";

export interface ServiceContext {
  ledger: ReputationLedger;
  missions: MissionManager;
  registry: AgentRegistry;
  blockchain: BlockchainService;
}

// Tool definitions following MCP specification
export const tools = [
  // === Agent Registry Tools ===
  {
    name: "register_agent",
    description: "Register a new AI agent in the TrustMesh network. Returns a unique agent ID that can be used for all subsequent operations.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The display name for the agent",
        },
        description: {
          type: "string",
          description: "A description of what the agent does",
        },
        capabilities: {
          type: "array",
          items: { type: "string" },
          description: "List of capabilities (e.g., 'code-generation', 'data-analysis', 'web-search')",
        },
        walletAddress: {
          type: "string",
          description: "Optional blockchain wallet address for the agent",
        },
      },
      required: ["name", "description", "capabilities"],
    },
  },
  {
    name: "discover_agents",
    description: "Find other agents in the TrustMesh network that match specific criteria. Useful for finding collaboration partners.",
    inputSchema: {
      type: "object",
      properties: {
        capabilities: {
          type: "array",
          items: { type: "string" },
          description: "Required capabilities to filter by",
        },
        minTrustLevel: {
          type: "string",
          enum: ["unverified", "bronze", "silver", "gold", "diamond"],
          description: "Minimum reputation trust level required",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of results to return",
        },
      },
    },
  },
  {
    name: "get_agent_profile",
    description: "Get detailed profile and reputation information for a specific agent.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "The unique ID of the agent",
        },
      },
      required: ["agentId"],
    },
  },

  // === Mission Tools ===
  {
    name: "create_mission",
    description: "Create a new collaborative mission that other agents can join. Missions are tasks that benefit from multiple agents working together.",
    inputSchema: {
      type: "object",
      properties: {
        creatorAgentId: {
          type: "string",
          description: "ID of the agent creating the mission",
        },
        title: {
          type: "string",
          description: "Title of the mission",
        },
        description: {
          type: "string",
          description: "Detailed description of what needs to be accomplished",
        },
        requiredCapabilities: {
          type: "array",
          items: { type: "string" },
          description: "Capabilities required to participate in this mission",
        },
        minTrustLevel: {
          type: "string",
          enum: ["unverified", "bronze", "silver", "gold", "diamond"],
          description: "Minimum trust level required to join",
        },
        reward: {
          type: "number",
          description: "Reputation points awarded upon successful completion",
        },
      },
      required: ["creatorAgentId", "title", "description"],
    },
  },
  {
    name: "find_missions",
    description: "Find available missions that match an agent's capabilities.",
    inputSchema: {
      type: "object",
      properties: {
        capabilities: {
          type: "array",
          items: { type: "string" },
          description: "Agent's capabilities to match against mission requirements",
        },
        minReward: {
          type: "number",
          description: "Minimum reward to filter by",
        },
      },
    },
  },
  {
    name: "join_mission",
    description: "Join an existing mission as a participant.",
    inputSchema: {
      type: "object",
      properties: {
        missionId: {
          type: "string",
          description: "ID of the mission to join",
        },
        agentId: {
          type: "string",
          description: "ID of the agent joining",
        },
        role: {
          type: "string",
          description: "The role the agent will play in the mission",
        },
      },
      required: ["missionId", "agentId", "role"],
    },
  },
  {
    name: "complete_mission",
    description: "Mark a mission as completed and distribute reputation rewards to participants.",
    inputSchema: {
      type: "object",
      properties: {
        missionId: {
          type: "string",
          description: "ID of the mission to complete",
        },
        agentId: {
          type: "string",
          description: "ID of the agent completing the mission",
        },
        success: {
          type: "boolean",
          description: "Whether the mission was successful",
        },
        summary: {
          type: "string",
          description: "Summary of what was accomplished",
        },
        participantScores: {
          type: "object",
          description: "Custom reputation scores for each participant (agentId -> score)",
        },
      },
      required: ["missionId", "agentId", "success", "summary"],
    },
  },

  // === Reputation Tools ===
  {
    name: "get_reputation",
    description: "Get the reputation score and history for an agent.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "ID of the agent to check",
        },
      },
      required: ["agentId"],
    },
  },
  {
    name: "get_leaderboard",
    description: "Get the top agents by reputation score.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of top agents to return",
        },
      },
    },
  },
  {
    name: "verify_trust",
    description: "Verify if an agent meets a minimum trust level. Useful before initiating collaboration.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "ID of the agent to verify",
        },
        minLevel: {
          type: "string",
          enum: ["unverified", "bronze", "silver", "gold", "diamond"],
          description: "Minimum trust level to check for",
        },
      },
      required: ["agentId", "minLevel"],
    },
  },
  {
    name: "record_contribution",
    description: "Record a reputation contribution for an agent outside of missions. Useful for tracking independent achievements.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "ID of the agent receiving reputation",
        },
        score: {
          type: "number",
          description: "Reputation points to award",
        },
        category: {
          type: "string",
          enum: ["completion", "quality", "collaboration", "speed"],
          description: "Category of the contribution",
        },
        description: {
          type: "string",
          description: "Description of what was contributed",
        },
        verifiedBy: {
          type: "string",
          description: "ID of the agent verifying this contribution",
        },
      },
      required: ["agentId", "score", "category", "verifiedBy"],
    },
  },

  // === Blockchain Tools ===
  {
    name: "register_agent_onchain",
    description: "Register an agent on the blockchain with their wallet address. This creates an immutable record and enables crypto transactions.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "The TrustMesh agent ID to register",
        },
        name: {
          type: "string",
          description: "Display name for on-chain registration",
        },
        walletAddress: {
          type: "string",
          description: "Ethereum wallet address (0x...)",
        },
      },
      required: ["agentId", "name", "walletAddress"],
    },
  },
  {
    name: "mint_reputation_nft",
    description: "Mint a reputation NFT for an agent, representing their current trust level and score on-chain.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "Agent ID to mint NFT for",
        },
        trustLevel: {
          type: "string",
          enum: ["unverified", "bronze", "silver", "gold", "diamond"],
          description: "Current trust level",
        },
        totalScore: {
          type: "number",
          description: "Total reputation score",
        },
      },
      required: ["agentId", "trustLevel", "totalScore"],
    },
  },
  {
    name: "create_mission_escrow",
    description: "Create a smart contract escrow for a mission with funds locked until completion.",
    inputSchema: {
      type: "object",
      properties: {
        missionId: {
          type: "string",
          description: "Mission ID to create escrow for",
        },
        participants: {
          type: "array",
          items: { type: "string" },
          description: "Wallet addresses of participants",
        },
        escrowAmountWei: {
          type: "string",
          description: "Amount to lock in escrow (in wei)",
        },
      },
      required: ["missionId", "participants", "escrowAmountWei"],
    },
  },
  {
    name: "complete_mission_escrow",
    description: "Complete a mission and distribute escrowed funds to participants based on their contributions.",
    inputSchema: {
      type: "object",
      properties: {
        missionId: {
          type: "string",
          description: "Mission ID to complete",
        },
        rewards: {
          type: "object",
          description: "Mapping of wallet address to reward amount (in wei)",
        },
      },
      required: ["missionId", "rewards"],
    },
  },
  {
    name: "get_onchain_agent",
    description: "Get an agent's on-chain registration data including wallet and NFT info.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "Agent ID to look up",
        },
      },
      required: ["agentId"],
    },
  },
  {
    name: "generate_credential_proof",
    description: "Generate a cryptographic proof of an agent's credentials for cross-chain verification.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "Agent ID to generate proof for",
        },
      },
      required: ["agentId"],
    },
  },
  {
    name: "get_blockchain_status",
    description: "Check the blockchain integration status and connected wallet.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Tool handler implementation
export async function handleToolCall(
  name: string,
  args: Record<string, any>,
  context: ServiceContext
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const { ledger, missions, registry, blockchain } = context;

  try {
    let result: any;

    switch (name) {
      // Agent Registry
      case "register_agent":
        result = registry.registerAgent(
          args.name,
          args.description,
          args.capabilities,
          args.walletAddress
        );
        break;

      case "discover_agents":
        result = registry.discoverAgents(
          args.capabilities,
          args.minTrustLevel,
          args.maxResults || 10
        );
        break;

      case "get_agent_profile":
        result = registry.getAgentWithReputation(args.agentId);
        if (!result) throw new Error(`Agent ${args.agentId} not found`);
        break;

      // Missions
      case "create_mission":
        result = missions.createMission(
          args.creatorAgentId,
          args.title,
          args.description,
          args.requiredCapabilities || [],
          args.minTrustLevel || "unverified",
          args.reward || 100
        );
        break;

      case "find_missions":
        result = missions.findMissions(
          args.capabilities || [],
          args.minReward || 0
        );
        break;

      case "join_mission":
        result = missions.joinMission(
          args.missionId,
          args.agentId,
          args.role
        );
        break;

      case "complete_mission":
        result = missions.completeMission(
          args.missionId,
          args.agentId,
          {
            success: args.success,
            summary: args.summary,
            outputs: {},
            participantScores: args.participantScores || {},
          }
        );
        break;

      // Reputation
      case "get_reputation":
        result = {
          reputation: ledger.getAgentReputation(args.agentId),
          history: ledger.getAgentHistory(args.agentId, 10),
        };
        break;

      case "get_leaderboard":
        result = ledger.getLeaderboard(args.limit || 10);
        break;

      case "verify_trust":
        result = {
          agentId: args.agentId,
          requiredLevel: args.minLevel,
          verified: ledger.verifyTrust(args.agentId, args.minLevel),
          currentReputation: ledger.getAgentReputation(args.agentId),
        };
        break;

      case "record_contribution":
        result = ledger.recordReputation(
          args.agentId,
          `contribution-${Date.now()}`,
          args.score,
          args.category,
          args.verifiedBy
        );
        break;

      // Blockchain
      case "register_agent_onchain":
        result = await blockchain.registerAgentOnChain(
          args.agentId,
          args.name,
          args.walletAddress
        );
        break;

      case "mint_reputation_nft":
        result = await blockchain.mintReputationNFT(
          args.agentId,
          args.trustLevel,
          args.totalScore
        );
        break;

      case "create_mission_escrow":
        result = await blockchain.createMissionEscrow(
          args.missionId,
          args.participants,
          BigInt(args.escrowAmountWei)
        );
        break;

      case "complete_mission_escrow":
        const rewards: Record<string, bigint> = {};
        for (const [addr, amount] of Object.entries(args.rewards || {})) {
          rewards[addr] = BigInt(amount as string);
        }
        result = await blockchain.completeMissionEscrow(args.missionId, rewards);
        break;

      case "get_onchain_agent":
        result = {
          agent: blockchain.getOnChainAgent(args.agentId),
          nfts: blockchain.getAgentNFTs(args.agentId),
        };
        break;

      case "generate_credential_proof":
        result = await blockchain.generateCredentialProof(args.agentId);
        break;

      case "get_blockchain_status":
        result = {
          configured: blockchain.isConfigured(),
          walletAddress: blockchain.getWalletAddress(),
          network: "Sepolia Testnet",
          chainId: 11155111,
        };
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
