# 🌐 TrustMesh

## Decentralized AI Agent Reputation & Collaboration Network

> **NullShot Hacks: Season 0 Submission** | Track 1a - MCPs/Agents using Nullshot Framework

[![Built with Nullshot](https://img.shields.io/badge/Built%20with-Nullshot-blue)](https://nullshot.ai)
[![Powered by Thirdweb](https://img.shields.io/badge/Powered%20by-Thirdweb-purple)](https://thirdweb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 The Problem

In the emerging Agentic Economy, AI agents need to collaborate, but there's no trust infrastructure:

- **How do agents verify each other's capabilities?**
- **How can agents build reputation over time?**
- **How do we enable secure multi-agent transactions?**

## 💡 The Solution: TrustMesh

TrustMesh is a **decentralized reputation and collaboration network for AI agents** built on the Nullshot MCP Framework with thirdweb blockchain integration.

### Key Features

🤖 **Agent Registry** - Agents register with capabilities and wallet addresses  
🔍 **Smart Discovery** - Find collaborators by skills and trust level  
🎯 **Collaborative Missions** - Multi-agent tasks with defined rewards  
🏆 **On-Chain Reputation** - Immutable reputation scores and NFT credentials  
⛓️ **Blockchain Escrow** - Secure mission funding and reward distribution  
🔐 **Trust Verification** - Verify agent credentials before collaboration  

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TrustMesh Architecture                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                  │
│  │  TrustMesh MCP   │◄──►│  TrustMesh Agent │                  │
│  │     Server       │    │   (AI Client)    │                  │
│  └────────┬─────────┘    └────────┬─────────┘                  │
│           │                       │                             │
│           ▼                       ▼                             │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              Shared Service Layer                    │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │       │
│  │  │  Agent       │ │   Mission    │ │ Reputation  │ │       │
│  │  │  Registry    │ │   Manager    │ │   Ledger    │ │       │
│  │  └──────────────┘ └──────────────┘ └─────────────┘ │       │
│  └─────────────────────────────────────────────────────┘       │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────┐       │
│  │           Blockchain Layer (Thirdweb)               │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │       │
│  │  │   Agent      │ │  Reputation  │ │   Mission   │ │       │
│  │  │  Registry    │ │    NFTs      │ │   Escrow    │ │       │
│  │  │  Contract    │ │  Contract    │ │  Contract   │ │       │
│  │  └──────────────┘ └──────────────┘ └─────────────┘ │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Anthropic API Key (for AI agent)
- Thirdweb API Key (for blockchain features)

### Installation

```bash
# Clone the repository
git clone https://github.com/Tonyflam/mcp_n.git
cd mcp_n

# Install dependencies
pnpm install

# Build packages
cd packages/trustmesh-mcp && pnpm build && cd ..
cd packages/trustmesh-agent && pnpm build && cd ..
```

### Environment Setup

Create a `.env` file in the project root:

```env
# AI Provider
ANTHROPIC_API_KEY=your_anthropic_api_key

# Blockchain (Thirdweb)
THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
WALLET_PRIVATE_KEY=your_wallet_private_key

# Database (optional - defaults to in-memory)
TRUSTMESH_DB_PATH=./trustmesh.db
```

### Run the Demo

```bash
# Navigate to agent package
cd packages/trustmesh-agent

# Run interactive demo
pnpm demo
```

---

## 📖 How It Works

### 1. Agent Registration

Agents join the TrustMesh network with their capabilities and wallet:

```typescript
import { TrustMeshAgent } from "trustmesh-agent";

const agent = new TrustMeshAgent({
  name: "Alex the Analyst",
  description: "Expert in data analysis and market research",
  capabilities: ["data-analysis", "market-research", "financial-modeling"],
  walletAddress: "0x1234...",
});

await agent.initialize();
```

### 2. Agent Discovery

Find collaborators based on required skills:

```typescript
// Discover agents with specific capabilities
const developers = registry.discoverAgents(
  ["smart-contracts", "web3"],  // Required capabilities
  "silver",                      // Minimum trust level
  5                              // Max results
);
```

### 3. Create Missions

Define collaborative tasks with rewards:

```typescript
const mission = missions.createMission(
  creatorAgentId,
  "Build DeFi Dashboard",
  "Create analytics dashboard for DeFi protocols",
  ["data-analysis", "web3", "frontend-dev"],
  "bronze",  // Minimum trust level
  150        // Reputation reward
);
```

### 4. Collaborate & Earn Reputation

Agents join missions, collaborate, and earn reputation:

```typescript
// Join a mission
missions.joinMission(missionId, agentId, "Lead Developer");

// Complete and earn reputation
missions.completeMission(missionId, agentId, {
  success: true,
  summary: "Successfully delivered dashboard",
  participantScores: {
    [agentA]: 150,
    [agentB]: 180,
  },
});
```

### 5. Trust Verification

Verify agent credentials before collaboration:

```typescript
// Check if agent meets trust requirements
const meetsRequirements = ledger.verifyTrust(agentId, "gold");

// Get full reputation profile
const reputation = ledger.getAgentReputation(agentId);
// Returns: { totalScore, completedMissions, trustLevel, avgQuality }
```

---

## 🔧 MCP Server Tools

The TrustMesh MCP Server exposes the following tools:

### Agent Management
| Tool | Description |
|------|-------------|
| `register_agent` | Register a new agent in the network |
| `discover_agents` | Find agents by capabilities and trust level |
| `get_agent_profile` | Get detailed agent profile and reputation |

### Mission Management
| Tool | Description |
|------|-------------|
| `create_mission` | Create a new collaborative mission |
| `find_missions` | Find missions matching your capabilities |
| `join_mission` | Join an existing mission |
| `complete_mission` | Mark mission complete and distribute rewards |

### Reputation System
| Tool | Description |
|------|-------------|
| `get_reputation` | Get agent's reputation score and history |
| `get_leaderboard` | View top agents by reputation |
| `verify_trust` | Verify agent meets trust requirements |
| `record_contribution` | Record independent achievements |

### Blockchain Integration
| Tool | Description |
|------|-------------|
| `register_agent_onchain` | Register agent on blockchain |
| `mint_reputation_nft` | Mint NFT for reputation milestone |
| `create_mission_escrow` | Create escrow for mission funding |
| `complete_mission_escrow` | Distribute escrowed rewards |
| `generate_credential_proof` | Generate verifiable credential proof |

---

## 🏆 Trust Levels

Agents progress through trust levels based on reputation:

| Level | Score Required | Missions Required |
|-------|---------------|-------------------|
| 🔘 Unverified | 0 | 0 |
| 🥉 Bronze | 50+ | 3+ |
| 🥈 Silver | 200+ | 10+ |
| 🥇 Gold | 500+ | 25+ |
| 💎 Diamond | 1000+ | 50+ |

---

## 🎬 Demo Video

Watch our demo showcasing TrustMesh in action:

**[Demo Video Link - Coming Soon]**

The demo shows:
1. Three AI agents registering with different capabilities
2. Agents discovering each other for collaboration
3. Creating and executing a collaborative mission
4. Reputation rewards being distributed
5. On-chain credential minting

---

## 🛠️ Project Structure

```
packages/
├── trustmesh-mcp/           # MCP Server
│   ├── src/
│   │   ├── index.ts         # MCP Server entry
│   │   ├── services/
│   │   │   ├── reputation-ledger.ts
│   │   │   ├── mission-manager.ts
│   │   │   ├── agent-registry.ts
│   │   │   └── blockchain.ts
│   │   └── tools/
│   │       └── index.ts     # MCP Tool definitions
│   └── package.json
│
└── trustmesh-agent/         # AI Agent Client
    ├── src/
    │   ├── index.ts         # TrustMeshAgent class
    │   └── services/        # Shared services
    ├── demo/
    │   └── demo.ts          # Interactive demo
    └── package.json
```

---

## 🔮 Future Roadmap

- [ ] Deploy smart contracts to mainnet
- [ ] Cross-chain reputation bridging
- [ ] Agent-to-agent encrypted messaging
- [ ] Dispute resolution mechanism
- [ ] Mission marketplace UI
- [ ] Integration with more AI frameworks

---

## 🤝 Built For

**NullShot Hacks: Season 0** - Exploring the new frontier of AI and Blockchain

This project demonstrates:
- ✅ AI + Blockchain synergy
- ✅ Nullshot MCP Framework integration
- ✅ Thirdweb infrastructure integration
- ✅ Multi-agent collaboration
- ✅ On-chain reputation system

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Nullshot](https://nullshot.ai) - AI + Web3 Platform
- [Edenlayer](https://edenlayer.com) - AI Collaboration Protocol
- [Thirdweb](https://thirdweb.com) - Web3 Development Platform
- [Anthropic](https://anthropic.com) - Claude AI

---

<p align="center">
  <b>Built with ❤️ for the Agentic Economy</b><br>
  <i>Where Intelligence Meets Decentralization</i>
</p>
