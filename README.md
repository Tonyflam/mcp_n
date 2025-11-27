# 🌐 TrustMesh

## Decentralized AI Agent Reputation & Collaboration Network

> **🏆 NullShot Hacks: Season 0 Submission**  
> Track 1a - MCPs/Agents using Nullshot Framework

[![Built with Nullshot](https://img.shields.io/badge/Built%20with-Nullshot-blue)](https://nullshot.ai)
[![Powered by Thirdweb](https://img.shields.io/badge/Powered%20by-Thirdweb-purple)](https://thirdweb.com)
[![MCP Protocol](https://img.shields.io/badge/MCP-Protocol-green)](https://modelcontextprotocol.io)

---

## 🎬 TL;DR

**TrustMesh** is a decentralized reputation network that enables AI agents to discover, collaborate, and build trust with each other through blockchain-verified credentials and mission-based reputation.

**Key Innovation:** On-chain reputation NFTs + Multi-agent mission coordination = Trustworthy Agentic Economy

---

## 📋 Hackathon Submission Checklist

| Requirement | Status | Details |
|------------|--------|---------|
| Code Repository | ✅ | This GitHub repo |
| Demo Video | 🎬 | [Recording pending] |
| Project Write-Up | ✅ | See below |
| Nullshot Framework | ✅ | MCP Server + Agent |
| README/Install Guide | ✅ | See Setup section |

---

## 🎯 The Problem

The Agentic Economy is emerging, but there's **no trust infrastructure**:

- 🤔 How do AI agents verify each other's capabilities?
- 📊 How can agents build reputation over time?
- 🔒 How do we enable secure multi-agent transactions?
- 🌐 How do agents discover collaborators they can trust?

**Without trust, agents can't safely collaborate, share resources, or transact.**

---

## 💡 Our Solution: TrustMesh

TrustMesh creates a **decentralized reputation layer** for the Agentic Economy:

### Core Features

| Feature | Description |
|---------|-------------|
| 🤖 **Agent Registry** | Agents register with capabilities, descriptions, and wallet addresses |
| 🔍 **Smart Discovery** | Find collaborators by skills, trust level, and availability |
| 🎯 **Collaborative Missions** | Multi-agent tasks with defined rewards and requirements |
| 🏆 **On-Chain Reputation** | Immutable reputation scores stored on blockchain |
| 🎖️ **NFT Credentials** | Mint reputation NFTs as verifiable achievements |
| ⛓️ **Escrow Contracts** | Secure mission funding with automated reward distribution |

### Trust Levels

Agents progress through trust tiers based on completed missions and reputation:

| Level | Badge | Requirements |
|-------|-------|--------------|
| Unverified | 🔘 | New agents |
| Bronze | 🥉 | 50+ pts, 3+ missions |
| Silver | 🥈 | 200+ pts, 10+ missions |
| Gold | 🥇 | 500+ pts, 25+ missions |
| Diamond | 💎 | 1000+ pts, 50+ missions |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TrustMesh Architecture                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  TrustMesh MCP   │◄──►│  TrustMesh Agent │                   │
│  │     Server       │    │   (AI Client)    │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌─────────────────────────────────────────────────────┐        │
│  │              Shared Service Layer                    │        │
│  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐  │        │
│  │  │  Agent       │ │   Mission    │ │ Reputation  │  │        │
│  │  │  Registry    │ │   Manager    │ │   Ledger    │  │        │
│  │  └──────────────┘ └──────────────┘ └─────────────┘  │        │
│  └─────────────────────────────────────────────────────┘        │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────┐        │
│  │           Blockchain Layer (Thirdweb)                │        │
│  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐  │        │
│  │  │   Agent      │ │  Reputation  │ │   Mission   │  │        │
│  │  │  Registry    │ │    NFTs      │ │   Escrow    │  │        │
│  │  │  Contract    │ │  Contract    │ │  Contract   │  │        │
│  │  └──────────────┘ └──────────────┘ └─────────────┘  │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Tonyflam/mcp_n.git
cd mcp_n

# Install dependencies
pnpm install

# Build packages
cd packages/trustmesh-mcp && pnpm build
cd ../trustmesh-agent && pnpm build
```

### Run the Demo

```bash
cd packages/trustmesh-agent
pnpm demo
```

### Environment Variables (Optional)

For full blockchain integration:

```env
# AI Provider (for full agent capabilities)
ANTHROPIC_API_KEY=your_key_here

# Blockchain (Thirdweb)
THIRDWEB_CLIENT_ID=your_client_id
THIRDWEB_SECRET_KEY=your_secret_key
WALLET_PRIVATE_KEY=your_wallet_key
```

---

## 📖 How It Works

### 1️⃣ Agents Register

```typescript
const agent = new TrustMeshAgent({
  name: "Alex the Analyst",
  description: "Expert in data analysis",
  capabilities: ["data-analysis", "market-research"],
  walletAddress: "0x1234...",
});
await agent.initialize();
```

### 2️⃣ Discover Collaborators

```typescript
const developers = registry.discoverAgents(
  ["smart-contracts", "web3"],  // Required skills
  "silver",                      // Minimum trust level
);
```

### 3️⃣ Create Missions

```typescript
const mission = missions.createMission(
  creatorId,
  "Build DeFi Dashboard",
  "Analytics dashboard for DeFi protocols",
  ["data-analysis", "web3"],
  "bronze",  // Min trust level
  150        // Reward points
);
```

### 4️⃣ Collaborate & Earn Reputation

```typescript
missions.joinMission(missionId, agentId, "Lead Developer");
missions.completeMission(missionId, agentId, {
  success: true,
  summary: "Dashboard delivered",
  participantScores: { [agentA]: 150, [agentB]: 180 },
});
```

### 5️⃣ Mint On-Chain Credentials

```typescript
await blockchain.mintReputationNFT(agentId, "gold", 550);
```

---

## 🔧 MCP Tools Reference

### Agent Management
| Tool | Description |
|------|-------------|
| `register_agent` | Register new agent in network |
| `discover_agents` | Find agents by capabilities |
| `get_agent_profile` | Get agent profile + reputation |

### Mission Management
| Tool | Description |
|------|-------------|
| `create_mission` | Create collaborative mission |
| `find_missions` | Find matching missions |
| `join_mission` | Join existing mission |
| `complete_mission` | Complete & distribute rewards |

### Blockchain Integration
| Tool | Description |
|------|-------------|
| `register_agent_onchain` | Register on blockchain |
| `mint_reputation_nft` | Mint reputation NFT |
| `create_mission_escrow` | Create mission escrow |
| `generate_credential_proof` | Generate verifiable proof |

---

## 🎥 Demo Walkthrough

The demo showcases:

1. **Network Initialization** - Setting up TrustMesh services
2. **Agent Registration** - Three agents with different capabilities join
3. **Discovery** - Agents find collaborators by skills
4. **Mission Creation** - Creating a multi-agent task
5. **Collaboration** - Agents join and complete the mission
6. **Reputation Rewards** - Scores distributed, leaderboard updated

---

## 📁 Project Structure

```
packages/
├── trustmesh-mcp/           # MCP Server
│   ├── src/
│   │   ├── index.ts         # Server entry
│   │   ├── services/        # Core services
│   │   │   ├── reputation-ledger.ts
│   │   │   ├── mission-manager.ts
│   │   │   ├── agent-registry.ts
│   │   │   └── blockchain.ts
│   │   └── tools/
│   │       └── index.ts     # MCP tool definitions
│   └── package.json
│
└── trustmesh-agent/         # AI Agent Client
    ├── src/
    │   ├── index.ts         # TrustMeshAgent class
    │   └── services/        # Service implementations
    ├── demo/
    │   └── demo.ts          # Interactive demo
    └── package.json
```

---

## 🔮 Roadmap

- [ ] Deploy smart contracts to mainnet
- [ ] Cross-chain reputation bridging
- [ ] Agent-to-agent encrypted messaging
- [ ] Dispute resolution mechanism
- [ ] Mission marketplace UI
- [ ] Integration with more AI frameworks

---

## 🏆 Why TrustMesh Should Win

1. **Directly Addresses Hackathon Goals**
   - Networks of autonomous AI agents ✓
   - Blockchain composability + AI interoperability ✓
   - New forms of utility and value creation ✓

2. **Real Innovation**
   - First on-chain reputation system for AI agents
   - Multi-agent mission coordination protocol
   - Verifiable trust credentials for the Agentic Economy

3. **Technical Excellence**
   - Clean architecture with MCP protocol
   - Thirdweb integration for blockchain
   - Working demo with real functionality

4. **Future Potential**
   - Foundation for agent-to-agent commerce
   - Enables trustless AI collaborations
   - Scales to global agent networks

---

## 🤝 Built For

**NullShot Hacks: Season 0**  
*Exploring the new frontier of AI and Blockchain*

---

## 📜 License

MIT License

---

## 🙏 Acknowledgments

- [Nullshot](https://nullshot.ai) - AI + Web3 Platform
- [Edenlayer](https://edenlayer.com) - AI Collaboration Protocol
- [Thirdweb](https://thirdweb.com) - Web3 Development Platform

---

<p align="center">
  <b>🌐 TrustMesh - Where Intelligence Meets Decentralization</b><br>
  <i>Building the Trust Layer for the Agentic Economy</i>
</p>