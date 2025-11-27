/**
 * Mission Manager Service
 * 
 * Handles collaborative missions between AI agents.
 * Missions are tasks that require multiple agents to complete.
 */

import { randomUUID } from "crypto";
import { ReputationLedger } from "./reputation-ledger.js";

export interface Mission {
  id: string;
  title: string;
  description: string;
  creatorAgentId: string;
  requiredCapabilities: string[];
  minTrustLevel: "unverified" | "bronze" | "silver" | "gold" | "diamond";
  reward: number; // Reputation points awarded on completion
  status: "open" | "in_progress" | "completed" | "failed" | "cancelled";
  participants: MissionParticipant[];
  createdAt: number;
  deadline?: number;
  completedAt?: number;
  result?: MissionResult;
}

export interface MissionParticipant {
  agentId: string;
  role: string;
  joinedAt: number;
  contribution?: string;
  rating?: number; // 1-5 peer rating
}

export interface MissionResult {
  success: boolean;
  summary: string;
  outputs: Record<string, any>;
  participantScores: Record<string, number>;
}

export class MissionManager {
  private missions: Map<string, Mission> = new Map();
  private ledger: ReputationLedger;

  constructor(ledger: ReputationLedger) {
    this.ledger = ledger;
  }

  /**
   * Create a new collaborative mission
   */
  createMission(
    creatorAgentId: string,
    title: string,
    description: string,
    requiredCapabilities: string[],
    minTrustLevel: Mission["minTrustLevel"] = "unverified",
    reward: number = 100,
    deadline?: number
  ): Mission {
    const mission: Mission = {
      id: randomUUID(),
      title,
      description,
      creatorAgentId,
      requiredCapabilities,
      minTrustLevel,
      reward,
      status: "open",
      participants: [{
        agentId: creatorAgentId,
        role: "creator",
        joinedAt: Date.now(),
      }],
      createdAt: Date.now(),
      deadline,
    };

    this.missions.set(mission.id, mission);
    return mission;
  }

  /**
   * Join an existing mission
   */
  joinMission(missionId: string, agentId: string, role: string): Mission {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    if (mission.status !== "open") throw new Error("Mission is not accepting participants");
    
    // Verify agent trust level
    if (!this.ledger.verifyTrust(agentId, mission.minTrustLevel)) {
      throw new Error(`Agent does not meet minimum trust level: ${mission.minTrustLevel}`);
    }

    // Check if already a participant
    if (mission.participants.some(p => p.agentId === agentId)) {
      throw new Error("Agent is already a participant");
    }

    mission.participants.push({
      agentId,
      role,
      joinedAt: Date.now(),
    });

    return mission;
  }

  /**
   * Start a mission (move from open to in_progress)
   */
  startMission(missionId: string, agentId: string): Mission {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    if (mission.creatorAgentId !== agentId) throw new Error("Only creator can start mission");
    if (mission.status !== "open") throw new Error("Mission cannot be started");

    mission.status = "in_progress";
    return mission;
  }

  /**
   * Complete a mission and distribute reputation rewards
   */
  completeMission(
    missionId: string,
    agentId: string,
    result: MissionResult
  ): Mission {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    if (mission.status !== "in_progress") throw new Error("Mission is not in progress");
    
    // Verify caller is a participant
    if (!mission.participants.some(p => p.agentId === agentId)) {
      throw new Error("Only participants can complete a mission");
    }

    mission.status = result.success ? "completed" : "failed";
    mission.completedAt = Date.now();
    mission.result = result;

    // Distribute reputation rewards
    if (result.success) {
      for (const participant of mission.participants) {
        const score = result.participantScores[participant.agentId] || mission.reward;
        
        this.ledger.recordReputation(
          participant.agentId,
          missionId,
          score,
          "completion",
          agentId
        );

        // Record quality score if peer rating exists
        if (participant.rating) {
          this.ledger.recordReputation(
            participant.agentId,
            missionId,
            participant.rating * 20, // Convert 1-5 to 20-100
            "quality",
            agentId
          );
        }
      }
    }

    return mission;
  }

  /**
   * Rate a participant's contribution
   */
  rateParticipant(
    missionId: string,
    raterAgentId: string,
    targetAgentId: string,
    rating: number
  ): void {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    
    // Verify rater is a participant
    if (!mission.participants.some(p => p.agentId === raterAgentId)) {
      throw new Error("Only participants can rate");
    }

    const target = mission.participants.find(p => p.agentId === targetAgentId);
    if (!target) throw new Error("Target agent is not a participant");

    target.rating = Math.max(1, Math.min(5, rating)); // Clamp to 1-5
  }

  /**
   * Get mission by ID
   */
  getMission(missionId: string): Mission | undefined {
    return this.missions.get(missionId);
  }

  /**
   * Get all active missions
   */
  getActiveMissions(): Mission[] {
    return Array.from(this.missions.values())
      .filter(m => m.status === "open" || m.status === "in_progress");
  }

  /**
   * Get missions for a specific agent
   */
  getAgentMissions(agentId: string): Mission[] {
    return Array.from(this.missions.values())
      .filter(m => m.participants.some(p => p.agentId === agentId));
  }

  /**
   * Find missions matching capabilities
   */
  findMissions(capabilities: string[], minReward: number = 0): Mission[] {
    return Array.from(this.missions.values())
      .filter(m => {
        if (m.status !== "open") return false;
        if (m.reward < minReward) return false;
        
        // Check if agent has required capabilities
        const hasCapabilities = m.requiredCapabilities.every(
          req => capabilities.includes(req)
        );
        
        return hasCapabilities;
      });
  }
}
