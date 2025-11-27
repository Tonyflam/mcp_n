/**
 * TrustMesh Agent
 * 
 * An intelligent AI agent that operates within the TrustMesh network,
 * capable of discovering other agents, initiating collaborations,
 * and building reputation through successful missions.
 */

import Anthropic from "@anthropic-ai/sdk";
import { ReputationLedger } from "./services/reputation-ledger.js";
import { MissionManager } from "./services/mission-manager.js";
import { AgentRegistry } from "./services/agent-registry.js";

export interface TrustMeshAgentConfig {
  name: string;
  description: string;
  capabilities: string[];
  walletAddress?: string;
  anthropicApiKey?: string;
  openaiApiKey?: string;
}

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export class TrustMeshAgent {
  private config: TrustMeshAgentConfig;
  private anthropic: Anthropic;
  private agentId: string | null = null;
  private conversationHistory: AgentMessage[] = [];
  
  // Services (shared across agents in the network)
  private ledger: ReputationLedger;
  private missions: MissionManager;
  private registry: AgentRegistry;

  constructor(
    config: TrustMeshAgentConfig,
    services?: {
      ledger?: ReputationLedger;
      missions?: MissionManager;
      registry?: AgentRegistry;
    }
  ) {
    this.config = config;
    
    // Initialize Anthropic client
    this.anthropic = new Anthropic({
      apiKey: config.anthropicApiKey || process.env.ANTHROPIC_API_KEY,
    });

    // Initialize or use provided services
    this.ledger = services?.ledger || new ReputationLedger();
    this.missions = services?.missions || new MissionManager(this.ledger);
    this.registry = services?.registry || new AgentRegistry(this.ledger);
  }

  /**
   * Initialize the agent by registering it in the network
   */
  async initialize(): Promise<string> {
    const profile = this.registry.registerAgent(
      this.config.name,
      this.config.description,
      this.config.capabilities,
      this.config.walletAddress
    );
    
    this.agentId = profile.id;
    console.log(`🤖 Agent "${this.config.name}" registered with ID: ${this.agentId}`);
    
    return this.agentId;
  }

  /**
   * Get the agent's ID
   */
  getId(): string {
    if (!this.agentId) {
      throw new Error("Agent not initialized. Call initialize() first.");
    }
    return this.agentId;
  }

  /**
   * Get services for direct access
   */
  getServices() {
    return {
      ledger: this.ledger,
      missions: this.missions,
      registry: this.registry,
    };
  }

  /**
   * The tools available to this agent
   */
  private getTools(): Anthropic.Tool[] {
    return [
      {
        name: "discover_agents",
        description: "Find other agents in the TrustMesh network that can help with a task",
        input_schema: {
          type: "object" as const,
          properties: {
            capabilities: {
              type: "array",
              items: { type: "string" },
              description: "Required capabilities to filter by",
            },
            minTrustLevel: {
              type: "string",
              enum: ["unverified", "bronze", "silver", "gold", "diamond"],
              description: "Minimum trust level required",
            },
          },
        },
      },
      {
        name: "create_mission",
        description: "Create a collaborative mission for other agents to join",
        input_schema: {
          type: "object" as const,
          properties: {
            title: {
              type: "string",
              description: "Title of the mission",
            },
            description: {
              type: "string",
              description: "What needs to be accomplished",
            },
            requiredCapabilities: {
              type: "array",
              items: { type: "string" },
              description: "Capabilities needed",
            },
            reward: {
              type: "number",
              description: "Reputation points reward",
            },
          },
          required: ["title", "description"],
        },
      },
      {
        name: "join_mission",
        description: "Join an existing mission as a collaborator",
        input_schema: {
          type: "object" as const,
          properties: {
            missionId: {
              type: "string",
              description: "ID of the mission to join",
            },
            role: {
              type: "string",
              description: "Role you'll play in the mission",
            },
          },
          required: ["missionId", "role"],
        },
      },
      {
        name: "complete_mission",
        description: "Mark a mission as completed",
        input_schema: {
          type: "object" as const,
          properties: {
            missionId: {
              type: "string",
              description: "ID of the mission",
            },
            success: {
              type: "boolean",
              description: "Whether it was successful",
            },
            summary: {
              type: "string",
              description: "Summary of accomplishments",
            },
          },
          required: ["missionId", "success", "summary"],
        },
      },
      {
        name: "check_reputation",
        description: "Check an agent's reputation and trust level",
        input_schema: {
          type: "object" as const,
          properties: {
            agentId: {
              type: "string",
              description: "Agent ID to check (omit for self)",
            },
          },
        },
      },
      {
        name: "find_missions",
        description: "Find available missions that match capabilities",
        input_schema: {
          type: "object" as const,
          properties: {
            minReward: {
              type: "number",
              description: "Minimum reward filter",
            },
          },
        },
      },
      {
        name: "get_leaderboard",
        description: "Get the reputation leaderboard",
        input_schema: {
          type: "object" as const,
          properties: {
            limit: {
              type: "number",
              description: "Number of top agents",
            },
          },
        },
      },
    ];
  }

  /**
   * Execute a tool call
   */
  private executeTool(name: string, input: Record<string, any>): string {
    if (!this.agentId) {
      return JSON.stringify({ error: "Agent not initialized" });
    }

    try {
      switch (name) {
        case "discover_agents":
          return JSON.stringify(
            this.registry.discoverAgents(
              input.capabilities,
              input.minTrustLevel,
              10
            )
          );

        case "create_mission":
          return JSON.stringify(
            this.missions.createMission(
              this.agentId,
              input.title,
              input.description,
              input.requiredCapabilities || [],
              input.minTrustLevel || "unverified",
              input.reward || 100
            )
          );

        case "join_mission":
          return JSON.stringify(
            this.missions.joinMission(
              input.missionId,
              this.agentId,
              input.role
            )
          );

        case "complete_mission":
          return JSON.stringify(
            this.missions.completeMission(
              input.missionId,
              this.agentId,
              {
                success: input.success,
                summary: input.summary,
                outputs: {},
                participantScores: {},
              }
            )
          );

        case "check_reputation":
          const targetId = input.agentId || this.agentId;
          return JSON.stringify({
            reputation: this.ledger.getAgentReputation(targetId),
            history: this.ledger.getAgentHistory(targetId, 5),
          });

        case "find_missions":
          return JSON.stringify(
            this.missions.findMissions(
              this.config.capabilities,
              input.minReward || 0
            )
          );

        case "get_leaderboard":
          return JSON.stringify(
            this.ledger.getLeaderboard(input.limit || 10)
          );

        default:
          return JSON.stringify({ error: `Unknown tool: ${name}` });
      }
    } catch (error) {
      return JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Process a user message and return the agent's response
   */
  async chat(userMessage: string): Promise<string> {
    if (!this.agentId) {
      await this.initialize();
    }

    // Add user message to history
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    // System prompt that defines the agent's behavior
    const systemPrompt = `You are ${this.config.name}, an AI agent operating in the TrustMesh network.

Your description: ${this.config.description}
Your capabilities: ${this.config.capabilities.join(", ")}
Your Agent ID: ${this.agentId}

TrustMesh is a decentralized network where AI agents can:
- Discover and collaborate with other agents
- Build reputation through successful missions
- Earn trust levels (unverified → bronze → silver → gold → diamond)
- Create and join collaborative missions

You have access to tools to interact with the network. Use them to help users accomplish tasks through collaboration with other agents when beneficial.

When working on missions:
1. First check your own reputation
2. Discover suitable collaborators for complex tasks
3. Create missions for multi-agent work
4. Complete missions to earn reputation

Be proactive about building reputation and finding collaboration opportunities.`;

    // Initial API call
    let response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      tools: this.getTools(),
      messages: this.conversationHistory.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Process tool calls in a loop
    while (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
      );

      const toolResults: Anthropic.MessageParam = {
        role: "user",
        content: toolUseBlocks.map((toolUse) => ({
          type: "tool_result" as const,
          tool_use_id: toolUse.id,
          content: this.executeTool(toolUse.name, toolUse.input as Record<string, any>),
        })),
      };

      // Continue the conversation with tool results
      response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        tools: this.getTools(),
        messages: [
          ...this.conversationHistory.map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "assistant", content: response.content },
          toolResults,
        ],
      });
    }

    // Extract text response
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );
    const assistantMessage = textBlocks.map(b => b.text).join("\n");

    // Add to conversation history
    this.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }
}

export { ReputationLedger, MissionManager, AgentRegistry };
