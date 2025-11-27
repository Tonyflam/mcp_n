/**
 * Reputation Ledger Service
 * 
 * Manages on-chain and off-chain reputation scores for AI agents.
 * In production, this would integrate with a blockchain for immutable records.
 */

import Database from "better-sqlite3";
import { randomUUID } from "crypto";

export interface ReputationRecord {
  id: string;
  agentId: string;
  missionId: string;
  score: number;
  category: "completion" | "quality" | "collaboration" | "speed";
  timestamp: number;
  verifiedBy: string;
  txHash?: string; // Blockchain transaction hash for on-chain records
}

export interface AgentReputation {
  agentId: string;
  totalScore: number;
  completedMissions: number;
  avgQuality: number;
  trustLevel: "unverified" | "bronze" | "silver" | "gold" | "diamond";
  lastActive: number;
}

export class ReputationLedger {
  private db: Database.Database;

  constructor(dbPath: string = process.env.TRUSTMESH_DB_PATH || ":memory:") {
    this.db = new Database(dbPath);
    this.initSchema();
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS reputation_records (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        mission_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        category TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        verified_by TEXT NOT NULL,
        tx_hash TEXT
      );

      CREATE TABLE IF NOT EXISTS agent_profiles (
        agent_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        capabilities TEXT,
        wallet_address TEXT,
        created_at INTEGER NOT NULL,
        last_active INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_reputation_agent ON reputation_records(agent_id);
      CREATE INDEX IF NOT EXISTS idx_reputation_mission ON reputation_records(mission_id);
    `);
  }

  /**
   * Record a reputation event for an agent
   */
  recordReputation(
    agentId: string,
    missionId: string,
    score: number,
    category: ReputationRecord["category"],
    verifiedBy: string,
    txHash?: string
  ): ReputationRecord {
    const record: ReputationRecord = {
      id: randomUUID(),
      agentId,
      missionId,
      score,
      category,
      timestamp: Date.now(),
      verifiedBy,
      txHash,
    };

    const stmt = this.db.prepare(`
      INSERT INTO reputation_records (id, agent_id, mission_id, score, category, timestamp, verified_by, tx_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      record.id,
      record.agentId,
      record.missionId,
      record.score,
      record.category,
      record.timestamp,
      record.verifiedBy,
      record.txHash || null
    );

    return record;
  }

  /**
   * Get aggregated reputation for an agent
   */
  getAgentReputation(agentId: string): AgentReputation {
    const records = this.db.prepare(`
      SELECT * FROM reputation_records WHERE agent_id = ?
    `).all(agentId) as any[];

    if (records.length === 0) {
      return {
        agentId,
        totalScore: 0,
        completedMissions: 0,
        avgQuality: 0,
        trustLevel: "unverified",
        lastActive: 0,
      };
    }

    const totalScore = records.reduce((sum, r) => sum + r.score, 0);
    const qualityRecords = records.filter(r => r.category === "quality");
    const avgQuality = qualityRecords.length > 0 
      ? qualityRecords.reduce((sum, r) => sum + r.score, 0) / qualityRecords.length 
      : 0;
    const uniqueMissions = new Set(records.map(r => r.mission_id)).size;
    const lastActive = Math.max(...records.map(r => r.timestamp));

    return {
      agentId,
      totalScore,
      completedMissions: uniqueMissions,
      avgQuality,
      trustLevel: this.calculateTrustLevel(totalScore, uniqueMissions),
      lastActive,
    };
  }

  /**
   * Calculate trust level based on score and activity
   */
  private calculateTrustLevel(score: number, missions: number): AgentReputation["trustLevel"] {
    if (missions < 1) return "unverified";
    if (score >= 1000 && missions >= 50) return "diamond";
    if (score >= 500 && missions >= 25) return "gold";
    if (score >= 200 && missions >= 10) return "silver";
    if (score >= 50 && missions >= 3) return "bronze";
    return "unverified";
  }

  /**
   * Get reputation leaderboard
   */
  getLeaderboard(limit: number = 10): AgentReputation[] {
    const agentIds = this.db.prepare(`
      SELECT DISTINCT agent_id FROM reputation_records
    `).all() as { agent_id: string }[];

    const reputations = agentIds.map(({ agent_id }) => 
      this.getAgentReputation(agent_id)
    );

    return reputations
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
  }

  /**
   * Verify an agent meets minimum trust requirements
   */
  verifyTrust(agentId: string, minLevel: AgentReputation["trustLevel"]): boolean {
    const rep = this.getAgentReputation(agentId);
    const levels: AgentReputation["trustLevel"][] = ["unverified", "bronze", "silver", "gold", "diamond"];
    return levels.indexOf(rep.trustLevel) >= levels.indexOf(minLevel);
  }

  /**
   * Get history for an agent
   */
  getAgentHistory(agentId: string, limit: number = 50): ReputationRecord[] {
    return this.db.prepare(`
      SELECT * FROM reputation_records 
      WHERE agent_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(agentId, limit) as any[];
  }
}
