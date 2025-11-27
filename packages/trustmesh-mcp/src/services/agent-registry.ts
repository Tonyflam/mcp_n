/**
 * Agent Registry Service
 * 
 * Manages agent discovery and capability matching.
 * Enables agents to find and collaborate with other agents.
 */

import { randomUUID } from "crypto";
import { ReputationLedger, AgentReputation } from "./reputation-ledger.js";

export interface AgentProfile {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  walletAddress?: string;
  mcpEndpoint?: string; // For agent-to-agent communication
  metadata: Record<string, any>;
  createdAt: number;
  lastSeen: number;
}

export interface AgentDiscoveryResult {
  agent: AgentProfile;
  reputation: AgentReputation;
  matchScore: number; // How well the agent matches the query
}

export class AgentRegistry {
  private agents: Map<string, AgentProfile> = new Map();
  private ledger: ReputationLedger;

  constructor(ledger: ReputationLedger) {
    this.ledger = ledger;
  }

  /**
   * Register a new agent in the network
   */
  registerAgent(
    name: string,
    description: string,
    capabilities: string[],
    walletAddress?: string,
    mcpEndpoint?: string,
    metadata: Record<string, any> = {}
  ): AgentProfile {
    const agent: AgentProfile = {
      id: randomUUID(),
      name,
      description,
      capabilities,
      walletAddress,
      mcpEndpoint,
      metadata,
      createdAt: Date.now(),
      lastSeen: Date.now(),
    };

    this.agents.set(agent.id, agent);
    return agent;
  }

  /**
   * Update agent's last seen timestamp
   */
  heartbeat(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.lastSeen = Date.now();
    }
  }

  /**
   * Update agent profile
   */
  updateAgent(
    agentId: string,
    updates: Partial<Pick<AgentProfile, "name" | "description" | "capabilities" | "mcpEndpoint" | "metadata">>
  ): AgentProfile {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found`);

    Object.assign(agent, updates, { lastSeen: Date.now() });
    return agent;
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): AgentProfile | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): AgentProfile[] {
    return Array.from(this.agents.values());
  }

  /**
   * Discover agents matching criteria
   */
  discoverAgents(
    requiredCapabilities?: string[],
    minTrustLevel?: AgentReputation["trustLevel"],
    maxResults: number = 10
  ): AgentDiscoveryResult[] {
    const results: AgentDiscoveryResult[] = [];

    for (const agent of this.agents.values()) {
      const reputation = this.ledger.getAgentReputation(agent.id);
      
      // Filter by trust level
      if (minTrustLevel) {
        const levels: AgentReputation["trustLevel"][] = ["unverified", "bronze", "silver", "gold", "diamond"];
        if (levels.indexOf(reputation.trustLevel) < levels.indexOf(minTrustLevel)) {
          continue;
        }
      }

      // Calculate match score based on capabilities
      let matchScore = 1.0;
      if (requiredCapabilities && requiredCapabilities.length > 0) {
        const matchedCaps = requiredCapabilities.filter(cap => 
          agent.capabilities.includes(cap)
        );
        matchScore = matchedCaps.length / requiredCapabilities.length;
        
        // Skip agents with no capability match
        if (matchScore === 0) continue;
      }

      // Boost score by reputation
      const repBonus = Math.min(reputation.totalScore / 1000, 0.5);
      matchScore = Math.min(1.0, matchScore + repBonus);

      results.push({
        agent,
        reputation,
        matchScore,
      });
    }

    return results
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxResults);
  }

  /**
   * Find agents by capability
   */
  findByCapability(capability: string): AgentDiscoveryResult[] {
    return this.discoverAgents([capability]);
  }

  /**
   * Get agent with full reputation data
   */
  getAgentWithReputation(agentId: string): AgentDiscoveryResult | undefined {
    const agent = this.agents.get(agentId);
    if (!agent) return undefined;

    return {
      agent,
      reputation: this.ledger.getAgentReputation(agentId),
      matchScore: 1.0,
    };
  }

  /**
   * Check if an agent is online (seen in last 5 minutes)
   */
  isOnline(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;
    return Date.now() - agent.lastSeen < 5 * 60 * 1000;
  }

  /**
   * Get online agents
   */
  getOnlineAgents(): AgentProfile[] {
    return Array.from(this.agents.values())
      .filter(agent => this.isOnline(agent.id));
  }
}
