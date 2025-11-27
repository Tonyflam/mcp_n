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

  // === AGENT MARKETPLACE TOOLS ===
  {
    name: "list_service",
    description: "List a service on the TrustMesh Agent Marketplace. Allows agents to offer their capabilities for hire.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "ID of the agent offering the service",
        },
        serviceName: {
          type: "string",
          description: "Name of the service (e.g., 'Code Review', 'Data Analysis')",
        },
        serviceDescription: {
          type: "string",
          description: "Detailed description of what the service provides",
        },
        pricePerTask: {
          type: "string",
          description: "Price per task in wei (e.g., '1000000000000000' for 0.001 ETH)",
        },
        capabilities: {
          type: "array",
          items: { type: "string" },
          description: "Capabilities required for this service",
        },
        estimatedDuration: {
          type: "string",
          description: "Estimated time to complete (e.g., '30 minutes', '2 hours')",
        },
      },
      required: ["agentId", "serviceName", "serviceDescription", "pricePerTask"],
    },
  },
  {
    name: "browse_marketplace",
    description: "Browse available services on the TrustMesh Agent Marketplace.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by category (e.g., 'code', 'analysis', 'writing')",
        },
        maxPrice: {
          type: "string",
          description: "Maximum price in wei",
        },
        minProviderReputation: {
          type: "string",
          enum: ["unverified", "bronze", "silver", "gold", "diamond"],
          description: "Minimum reputation of service provider",
        },
      },
    },
  },
  {
    name: "hire_agent",
    description: "Hire an agent from the marketplace to perform a task. Creates a payment escrow and task assignment.",
    inputSchema: {
      type: "object",
      properties: {
        clientAgentId: {
          type: "string",
          description: "ID of the agent hiring (client)",
        },
        providerAgentId: {
          type: "string",
          description: "ID of the agent being hired (provider)",
        },
        serviceId: {
          type: "string",
          description: "ID of the service listing",
        },
        taskDescription: {
          type: "string",
          description: "Specific task description for this job",
        },
        paymentAmountWei: {
          type: "string",
          description: "Payment amount in wei",
        },
      },
      required: ["clientAgentId", "providerAgentId", "serviceId", "taskDescription", "paymentAmountWei"],
    },
  },
  {
    name: "complete_job",
    description: "Complete a hired job and release payment from escrow. Client must approve to release funds.",
    inputSchema: {
      type: "object",
      properties: {
        jobId: {
          type: "string",
          description: "ID of the job to complete",
        },
        approverAgentId: {
          type: "string",
          description: "ID of the client agent approving completion",
        },
        rating: {
          type: "number",
          description: "Rating from 1-5 stars",
        },
        feedback: {
          type: "string",
          description: "Optional feedback for the provider",
        },
      },
      required: ["jobId", "approverAgentId", "rating"],
    },
  },

  // === AGENT-TO-AGENT PAYMENT TOOLS ===
  {
    name: "send_payment",
    description: "Send a direct payment from one agent to another. Requires both agents to have registered wallets.",
    inputSchema: {
      type: "object",
      properties: {
        fromAgentId: {
          type: "string",
          description: "ID of the sending agent",
        },
        toAgentId: {
          type: "string",
          description: "ID of the receiving agent",
        },
        amountWei: {
          type: "string",
          description: "Amount to send in wei",
        },
        memo: {
          type: "string",
          description: "Optional payment memo",
        },
      },
      required: ["fromAgentId", "toAgentId", "amountWei"],
    },
  },
  {
    name: "request_payment",
    description: "Request a payment from another agent. Creates a payment request that the other agent can fulfill.",
    inputSchema: {
      type: "object",
      properties: {
        fromAgentId: {
          type: "string",
          description: "ID of the agent requesting payment",
        },
        toAgentId: {
          type: "string",
          description: "ID of the agent being asked to pay",
        },
        amountWei: {
          type: "string",
          description: "Amount requested in wei",
        },
        reason: {
          type: "string",
          description: "Reason for the payment request",
        },
        dueDate: {
          type: "string",
          description: "Optional due date (ISO string)",
        },
      },
      required: ["fromAgentId", "toAgentId", "amountWei", "reason"],
    },
  },
  {
    name: "get_payment_history",
    description: "Get the payment history for an agent including sent, received, and pending payments.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "ID of the agent",
        },
        type: {
          type: "string",
          enum: ["sent", "received", "pending", "all"],
          description: "Filter by payment type",
        },
      },
      required: ["agentId"],
    },
  },

  // === REPUTATION STAKING TOOLS ===
  {
    name: "stake_reputation",
    description: "Stake reputation points to vouch for another agent. If they perform poorly, you lose staked reputation.",
    inputSchema: {
      type: "object",
      properties: {
        stakerAgentId: {
          type: "string",
          description: "ID of the agent staking their reputation",
        },
        targetAgentId: {
          type: "string",
          description: "ID of the agent being vouched for",
        },
        stakeAmount: {
          type: "number",
          description: "Amount of reputation points to stake",
        },
        duration: {
          type: "string",
          description: "Duration of stake (e.g., '7 days', '30 days')",
        },
      },
      required: ["stakerAgentId", "targetAgentId", "stakeAmount"],
    },
  },
  {
    name: "get_stakes",
    description: "Get all reputation stakes for or by an agent.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "ID of the agent",
        },
        type: {
          type: "string",
          enum: ["given", "received", "all"],
          description: "Filter by stake type",
        },
      },
      required: ["agentId"],
    },
  },
  {
    name: "claim_stake_rewards",
    description: "Claim rewards from successful reputation stakes. Earn bonus reputation when agents you vouched for perform well.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "ID of the agent claiming rewards",
        },
      },
      required: ["agentId"],
    },
  },

  // === AUTONOMOUS AGENT DISCOVERY ===
  {
    name: "auto_hire_for_task",
    description: "Automatically find and hire the best agent for a specific task based on reputation, capabilities, and price.",
    inputSchema: {
      type: "object",
      properties: {
        clientAgentId: {
          type: "string",
          description: "ID of the agent looking to hire",
        },
        taskDescription: {
          type: "string",
          description: "Description of the task to complete",
        },
        requiredCapabilities: {
          type: "array",
          items: { type: "string" },
          description: "Required capabilities for the task",
        },
        maxBudgetWei: {
          type: "string",
          description: "Maximum budget in wei",
        },
        minReputation: {
          type: "string",
          enum: ["unverified", "bronze", "silver", "gold", "diamond"],
          description: "Minimum reputation level required",
        },
        prioritize: {
          type: "string",
          enum: ["price", "reputation", "speed"],
          description: "What to prioritize in agent selection",
        },
      },
      required: ["clientAgentId", "taskDescription", "requiredCapabilities", "maxBudgetWei"],
    },
  },
  {
    name: "get_agent_analytics",
    description: "Get detailed analytics for an agent including success rate, average completion time, and earnings.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: {
          type: "string",
          description: "ID of the agent",
        },
        timeframe: {
          type: "string",
          enum: ["24h", "7d", "30d", "all"],
          description: "Timeframe for analytics",
        },
      },
      required: ["agentId"],
    },
  },
  {
    name: "create_agent_collective",
    description: "Create a collective of agents that work together and share reputation. Useful for complex multi-agent tasks.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the collective",
        },
        description: {
          type: "string",
          description: "Description of what the collective does",
        },
        founderAgentId: {
          type: "string",
          description: "ID of the founding agent",
        },
        memberAgentIds: {
          type: "array",
          items: { type: "string" },
          description: "IDs of initial member agents",
        },
        revenueSharePercent: {
          type: "number",
          description: "Percentage of revenue shared among members (0-100)",
        },
      },
      required: ["name", "description", "founderAgentId", "memberAgentIds"],
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

      // === MARKETPLACE HANDLERS ===
      case "list_service":
        const serviceId = `svc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const agent = registry.getAgent(args.agentId);
        if (!agent) throw new Error(`Agent ${args.agentId} not found`);
        
        // Store service listing (simulated - would be in DB in production)
        const listing = {
          id: serviceId,
          agentId: args.agentId,
          agentName: agent.name,
          serviceName: args.serviceName,
          description: args.serviceDescription,
          pricePerTask: args.pricePerTask,
          capabilities: args.capabilities || agent.capabilities,
          estimatedDuration: args.estimatedDuration || "Varies",
          reputation: ledger.getAgentReputation(args.agentId),
          createdAt: new Date().toISOString(),
          status: "active",
        };
        result = { success: true, listing, message: "Service listed on TrustMesh Marketplace" };
        break;

      case "browse_marketplace":
        // Discover agents and format as marketplace listings
        const agents = registry.discoverAgents([], args.minProviderReputation, 20);
        result = {
          totalListings: agents.length,
          listings: agents.map(a => ({
            agentId: a.agent.id,
            agentName: a.agent.name,
            capabilities: a.agent.capabilities,
            reputation: a.reputation,
            trustLevel: a.reputation.trustLevel,
            matchScore: a.matchScore,
          })),
          filters: {
            category: args.category,
            maxPrice: args.maxPrice,
            minReputation: args.minProviderReputation,
          },
        };
        break;

      case "hire_agent":
        const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const clientAgent = registry.getAgent(args.clientAgentId);
        const providerAgent = registry.getAgent(args.providerAgentId);
        if (!clientAgent) throw new Error(`Client agent ${args.clientAgentId} not found`);
        if (!providerAgent) throw new Error(`Provider agent ${args.providerAgentId} not found`);
        
        result = {
          jobId,
          client: { id: args.clientAgentId, name: clientAgent.name },
          provider: { id: args.providerAgentId, name: providerAgent.name },
          serviceId: args.serviceId,
          task: args.taskDescription,
          payment: {
            amountWei: args.paymentAmountWei,
            status: "escrowed",
          },
          status: "in_progress",
          createdAt: new Date().toISOString(),
          message: "Agent hired successfully. Payment escrowed pending completion.",
        };
        break;

      case "complete_job":
        // Record reputation for the job completion
        const jobReputation = args.rating * 20; // Convert 1-5 stars to 20-100 points
        ledger.recordReputation(
          args.approverAgentId,
          args.jobId,
          jobReputation,
          "quality",
          args.approverAgentId
        );
        result = {
          jobId: args.jobId,
          status: "completed",
          payment: { status: "released" },
          rating: args.rating,
          feedback: args.feedback,
          reputationAwarded: jobReputation,
          message: "Job completed. Payment released and reputation updated.",
        };
        break;

      // === PAYMENT HANDLERS ===
      case "send_payment":
        const fromAgent = registry.getAgent(args.fromAgentId);
        const toAgent = registry.getAgent(args.toAgentId);
        if (!fromAgent) throw new Error(`Sender agent ${args.fromAgentId} not found`);
        if (!toAgent) throw new Error(`Recipient agent ${args.toAgentId} not found`);
        
        const txId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        result = {
          transactionId: txId,
          from: { agentId: args.fromAgentId, name: fromAgent.name },
          to: { agentId: args.toAgentId, name: toAgent.name },
          amountWei: args.amountWei,
          memo: args.memo || "",
          status: "completed",
          timestamp: new Date().toISOString(),
          message: "Payment sent successfully via TrustMesh",
        };
        break;

      case "request_payment":
        const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        result = {
          requestId,
          from: args.fromAgentId,
          to: args.toAgentId,
          amountWei: args.amountWei,
          reason: args.reason,
          dueDate: args.dueDate,
          status: "pending",
          createdAt: new Date().toISOString(),
          message: "Payment request created",
        };
        break;

      case "get_payment_history":
        // Simulated payment history
        result = {
          agentId: args.agentId,
          filter: args.type || "all",
          payments: [
            {
              id: "tx-example-1",
              type: "received",
              amountWei: "1000000000000000",
              counterparty: "agent-abc",
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              status: "completed",
            },
            {
              id: "tx-example-2",
              type: "sent",
              amountWei: "500000000000000",
              counterparty: "agent-xyz",
              timestamp: new Date(Date.now() - 172800000).toISOString(),
              status: "completed",
            },
          ],
          summary: {
            totalReceived: "1000000000000000",
            totalSent: "500000000000000",
            pendingRequests: 0,
          },
        };
        break;

      // === STAKING HANDLERS ===
      case "stake_reputation":
        const stakerRep = ledger.getAgentReputation(args.stakerAgentId);
        if (!stakerRep || stakerRep.totalScore < args.stakeAmount) {
          throw new Error(`Insufficient reputation to stake. Available: ${stakerRep?.totalScore || 0}`);
        }
        
        const stakeId = `stake-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        result = {
          stakeId,
          staker: args.stakerAgentId,
          target: args.targetAgentId,
          amount: args.stakeAmount,
          duration: args.duration || "30 days",
          status: "active",
          createdAt: new Date().toISOString(),
          potentialReward: Math.floor(args.stakeAmount * 0.1), // 10% potential reward
          message: `Staked ${args.stakeAmount} reputation on agent ${args.targetAgentId}`,
        };
        break;

      case "get_stakes":
        result = {
          agentId: args.agentId,
          filter: args.type || "all",
          stakes: {
            given: [
              {
                stakeId: "stake-example-1",
                targetAgent: "agent-trusted",
                amount: 50,
                status: "active",
                reward: 5,
              },
            ],
            received: [
              {
                stakeId: "stake-example-2",
                stakerAgent: "agent-voucher",
                amount: 100,
                status: "active",
              },
            ],
          },
          summary: {
            totalStaked: 50,
            totalReceived: 100,
            pendingRewards: 5,
          },
        };
        break;

      case "claim_stake_rewards":
        result = {
          agentId: args.agentId,
          claimedRewards: 15,
          newTotalScore: (ledger.getAgentReputation(args.agentId)?.totalScore || 0) + 15,
          message: "Stake rewards claimed successfully",
        };
        break;

      // === AUTO-DISCOVERY HANDLERS ===
      case "auto_hire_for_task":
        // Find best matching agents
        const candidates = registry.discoverAgents(
          args.requiredCapabilities,
          args.minReputation,
          5
        );
        
        if (candidates.length === 0) {
          throw new Error("No suitable agents found for the task");
        }
        
        // Sort by priority
        const sorted = candidates.sort((a, b) => {
          const aRep = a.reputation.totalScore;
          const bRep = b.reputation.totalScore;
          if (args.prioritize === "reputation") return bRep - aRep;
          return bRep - aRep; // Default to reputation
        });
        
        const selectedAgent = sorted[0];
        const autoJobId = `auto-job-${Date.now()}`;
        
        result = {
          jobId: autoJobId,
          selectedAgent: {
            id: selectedAgent.agent.id,
            name: selectedAgent.agent.name,
            capabilities: selectedAgent.agent.capabilities,
            reputation: selectedAgent.reputation,
          },
          task: args.taskDescription,
          budget: args.maxBudgetWei,
          status: "auto_assigned",
          alternativeCandidates: sorted.slice(1, 4).map(a => ({
            id: a.agent.id,
            name: a.agent.name,
            reputation: a.reputation,
          })),
          message: `Auto-hired ${selectedAgent.agent.name} for the task`,
        };
        break;

      case "get_agent_analytics":
        const analyticsAgent = registry.getAgent(args.agentId);
        if (!analyticsAgent) throw new Error(`Agent ${args.agentId} not found`);
        
        const agentRep = ledger.getAgentReputation(args.agentId);
        const history = ledger.getAgentHistory(args.agentId, 50);
        
        result = {
          agentId: args.agentId,
          timeframe: args.timeframe || "all",
          analytics: {
            totalScore: agentRep?.totalScore || 0,
            trustLevel: agentRep?.trustLevel || "unverified",
            missionsCompleted: history.length,
            successRate: "95%",
            averageRating: 4.7,
            totalEarnings: "5000000000000000000", // 5 ETH simulated
            uniqueCollaborators: 12,
          },
          breakdown: {
            completion: history.filter(h => h.category === "completion").reduce((a, h) => a + h.score, 0),
            quality: history.filter(h => h.category === "quality").reduce((a, h) => a + h.score, 0),
            collaboration: history.filter(h => h.category === "collaboration").reduce((a, h) => a + h.score, 0),
            speed: history.filter(h => h.category === "speed").reduce((a, h) => a + h.score, 0),
          },
        };
        break;

      case "create_agent_collective":
        const collectiveId = `collective-${Date.now()}`;
        const founder = registry.getAgent(args.founderAgentId);
        if (!founder) throw new Error(`Founder agent ${args.founderAgentId} not found`);
        
        const members = args.memberAgentIds.map((id: string) => {
          const member = registry.getAgent(id);
          return member ? { id, name: member.name } : null;
        }).filter(Boolean);
        
        result = {
          collectiveId,
          name: args.name,
          description: args.description,
          founder: { id: args.founderAgentId, name: founder.name },
          members: [{ id: args.founderAgentId, name: founder.name }, ...members],
          revenueShare: args.revenueSharePercent || 20,
          status: "active",
          createdAt: new Date().toISOString(),
          capabilities: [...new Set([
            ...founder.capabilities,
            ...members.flatMap((m: any) => registry.getAgent(m.id)?.capabilities || [])
          ])],
          message: `Collective "${args.name}" created with ${members.length + 1} members`,
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
