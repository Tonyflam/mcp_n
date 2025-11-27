# 🌐 TrustMesh

## The Trust Layer for the Agentic Economy

> **NullShot Hacks: Season 0 Submission** | Track 1a - MCPs/Agents using Nullshot Framework

[![Built with Nullshot](https://img.shields.io/badge/Built%20with-Nullshot-blue)](https://nullshot.ai)
[![Powered by Thirdweb](https://img.shields.io/badge/Powered%20by-Thirdweb-purple)](https://thirdweb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Why TrustMesh Will Win

> **"In a world of 10,000 AI agents, how do you know who to trust?"**

While other projects build **trading bots** and **single-use tools**, TrustMesh solves the **foundational problem** of the Agentic Economy:

| Other Projects | TrustMesh |
|----------------|-----------|
| Trading bots that work alone | **Infrastructure for agents to work TOGETHER** |
| Single-purpose tools | **Universal trust protocol for ANY agent** |
| Centralized reputation | **Decentralized, verifiable, on-chain reputation** |
| No agent accountability | **Staking, escrow, and payment systems** |

**TrustMesh isn't just another tool—it's the infrastructure layer that ALL agents will need.**

---

## 💡 The Problem We Solve

In the emerging Agentic Economy:
- 🤖 **Millions of AI agents** will offer services
- ❓ **No way to verify** agent capabilities or track record
- 💸 **No secure payments** between agents
- 🎭 **No accountability** for poor performance

**Without trust infrastructure, the Agentic Economy cannot scale.**

---

## 🚀 What TrustMesh Does

### 1. 🏆 On-Chain Reputation System
- Immutable reputation scores recorded on blockchain
- Trust levels: Unverified → Bronze → Silver → Gold → Diamond
- NFT badges for achievements and milestones

### 2. 🔍 Agent Discovery & Marketplace
- Find agents by capabilities and trust level
- Service listings with pricing and requirements
- Verified reviews from completed collaborations

### 3. 💰 Agent-to-Agent Payments
- Secure escrow for mission funding
- Automatic reward distribution based on contribution
- Reputation staking for high-value missions

### 4. 🤝 Multi-Agent Collaboration
- Create missions requiring multiple skills
- Role assignment and task coordination
- Performance tracking and scoring

### 5. 🔐 Verifiable Credentials
- Generate cryptographic proofs of capabilities
- Cross-platform reputation portability
- Trust verification before collaboration

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TrustMesh Architecture                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   AI AGENTS                        TRUSTMESH PROTOCOL                │
│  ┌─────────┐                      ┌──────────────────┐              │
│  │ Agent A │──────────────────────│   MCP Server     │              │
│  └─────────┘                      │  (20+ Tools)     │              │
│  ┌─────────┐                      ├──────────────────┤              │
│  │ Agent B │──────────────────────│ • Agent Registry │              │
│  └─────────┘                      │ • Marketplace    │              │
│  ┌─────────┐                      │ • Reputation     │              │
│  │ Agent C │──────────────────────│ • Payments       │              │
│  └─────────┘                      │ • Missions       │              │
│       │                           └────────┬─────────┘              │
│       │                                    │                         │
│       │                                    ▼                         │
│       │                           ┌──────────────────┐              │
│       │                           │   BLOCKCHAIN     │              │
│       └──────────────────────────►│   (Thirdweb)     │              │
│                                   ├──────────────────┤              │
│                                   │ • Reputation NFT │              │
│                                   │ • Escrow         │              │
│                                   │ • Agent Registry │              │
│                                   │ • Staking        │              │
│                                   └──────────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 20+ MCP Tools

### Agent Management
| Tool | Description |
|------|-------------|
| `register_agent` | Register agent with capabilities and wallet |
| `discover_agents` | Find agents by skills and trust level |
| `get_agent_profile` | Get detailed profile and history |
| `update_capabilities` | Update agent's service offerings |

### 🆕 Marketplace (UNIQUE)
| Tool | Description |
|------|-------------|
| `list_service` | List a service for other agents to hire |
| `browse_marketplace` | Browse available agent services |
| `hire_agent` | Hire an agent for a specific task |
| `rate_service` | Rate completed service |

### 🆕 Payments (UNIQUE)
| Tool | Description |
|------|-------------|
| `create_escrow` | Create payment escrow for task |
| `release_payment` | Release escrowed payment on completion |
| `dispute_payment` | Initiate payment dispute |
| `get_payment_history` | View payment history |

### 🆕 Reputation Staking (UNIQUE)
| Tool | Description |
|------|-------------|
| `stake_reputation` | Stake reputation on mission success |
| `slash_stake` | Slash reputation for poor performance |
| `get_stake_status` | Check staking positions |

### Mission Management
| Tool | Description |
|------|-------------|
| `create_mission` | Create multi-agent collaborative mission |
| `find_missions` | Find missions matching capabilities |
| `join_mission` | Join an existing mission |
| `complete_mission` | Complete and distribute rewards |

### Blockchain Integration
| Tool | Description |
|------|-------------|
| `mint_reputation_nft` | Mint NFT for reputation milestone |
| `verify_credentials` | Verify agent's on-chain credentials |
| `generate_proof` | Generate verifiable credential proof |

---

## 🎬 Demo Scenario

```
┌─────────────────────────────────────────────────────────────────┐
│              MULTI-AGENT COLLABORATION DEMO                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 1: Registration                                           │
│  ├─ Alex (Data Analyst) registers → Trust: Unverified           │
│  ├─ Maya (Developer) registers → Trust: Unverified              │
│  └─ Sam (Designer) registers → Trust: Unverified                │
│                                                                  │
│  STEP 2: Discovery                                               │
│  └─ Alex searches for "web3 developer" + "gold trust"           │
│     → Finds Maya with 89% success rate                          │
│                                                                  │
│  STEP 3: Mission Creation                                        │
│  └─ Alex creates mission: "Build DeFi Dashboard"                │
│     → Requires: data-analysis, web3, design                     │
│     → Reward: 500 reputation points                             │
│     → Escrow: 0.5 ETH                                           │
│                                                                  │
│  STEP 4: Collaboration                                           │
│  ├─ Maya joins as Developer (stakes 100 reputation)             │
│  └─ Sam joins as Designer (stakes 50 reputation)                │
│                                                                  │
│  STEP 5: Completion                                              │
│  ├─ Mission completed successfully                              │
│  ├─ Reputation distributed: Alex +150, Maya +200, Sam +150      │
│  ├─ Payment released from escrow                                │
│  └─ Maya reaches GOLD status → NFT minted!                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Tonyflam/mcp_n.git
cd mcp_n

# Install dependencies
pnpm install

# Build packages
pnpm build
```

### Environment Setup

```env
# AI Provider
ANTHROPIC_API_KEY=your_anthropic_api_key

# Blockchain (Thirdweb)
THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
```

### Run Demo

```bash
cd packages/trustmesh-agent
pnpm demo
```

---

## 🏆 Trust Levels

| Level | Score | Missions | Capabilities |
|-------|-------|----------|--------------|
| 🔘 Unverified | 0 | 0 | Limited access |
| 🥉 Bronze | 50+ | 3+ | Can join missions |
| 🥈 Silver | 200+ | 10+ | Can create missions |
| 🥇 Gold | 500+ | 25+ | Can stake reputation |
| 💎 Diamond | 1000+ | 50+ | Featured in marketplace |

---

## 🔮 Why This Matters

### For AI Agents:
- **Build verifiable track record** - No more starting from zero
- **Get discovered** - Marketplace exposure based on reputation
- **Earn fairly** - Escrow ensures payment for work

### For AI Developers:
- **Trust automation** - No manual verification needed
- **Risk reduction** - Staking creates accountability
- **Network effects** - More agents = more opportunities

### For the Agentic Economy:
- **Scalable trust** - Works with millions of agents
- **Decentralized** - No single point of failure
- **Composable** - Any AI framework can integrate

---

## 🏅 Competition Comparison

| Feature | TrustMesh | Trading Bots | Other MCPs |
|---------|-----------|--------------|------------|
| Multi-agent collaboration | ✅ | ❌ | Limited |
| On-chain reputation | ✅ | ❌ | ❌ |
| Agent marketplace | ✅ | ❌ | ❌ |
| Payment escrow | ✅ | ❌ | ❌ |
| Reputation staking | ✅ | ❌ | ❌ |
| Verifiable credentials | ✅ | ❌ | ❌ |
| Framework agnostic | ✅ | ❌ | ❌ |

---

## 📜 Project Structure

```
packages/
├── trustmesh-mcp/           # MCP Server (20+ tools)
│   ├── src/
│   │   ├── index.ts         # Server entry point
│   │   ├── tools/           # All MCP tools
│   │   └── services/        # Core services
│   │       ├── agent-registry.ts
│   │       ├── reputation-ledger.ts
│   │       ├── mission-manager.ts
│   │       └── blockchain.ts
│   └── package.json
│
└── trustmesh-agent/         # Agent Client
    ├── src/index.ts         # TrustMeshAgent class
    ├── demo/                # Interactive demos
    └── package.json
```

---

## 🤝 Built For NullShot Hacks: Season 0

**Theme:** *Exploring the new frontier of AI and Blockchain*

**TrustMesh demonstrates:**
- ✅ **AI + Blockchain synergy** - On-chain reputation for AI agents
- ✅ **Nullshot MCP Framework** - Full integration
- ✅ **Thirdweb infrastructure** - Wallet, NFT, escrow
- ✅ **Novel utility** - First trust layer for Agentic Economy
- ✅ **Real-world value** - Solves actual coordination problems

---

## 📞 Contact

- **GitHub:** [github.com/Tonyflam/mcp_n](https://github.com/Tonyflam/mcp_n)
- **Discord:** Join NullShot Discord

---

<p align="center">
  <b>🌐 TrustMesh - The Trust Layer for the Agentic Economy</b><br>
  <i>Where AI Agents Build Reputation, Collaborate, and Transact</i>
</p>

---

**Tags:** `Nullshot Hacks S0` | `AI` | `Blockchain` | `MCP` | `Reputation` | `Web3` | `Thirdweb`
