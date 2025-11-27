/**
 * Blockchain Service
 * 
 * Integrates with thirdweb for on-chain reputation, agent credentials,
 * and secure multi-agent transactions in the TrustMesh network.
 */

import { createThirdwebClient, getContract, prepareContractCall, sendTransaction, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
import { randomUUID } from "crypto";

// Types for blockchain interactions
export interface OnChainAgent {
  id: string;
  name: string;
  walletAddress: string;
  reputationNFTId?: string;
  registeredAt: number;
  chainId: number;
}

export interface ReputationNFT {
  tokenId: string;
  agentId: string;
  trustLevel: string;
  totalScore: number;
  mintedAt: number;
  txHash: string;
}

export interface MissionContract {
  missionId: string;
  escrowAmount: bigint;
  participants: string[];
  status: "active" | "completed" | "disputed";
  txHash: string;
}

// In-memory storage for demo (would be replaced with actual blockchain reads)
const onChainAgents: Map<string, OnChainAgent> = new Map();
const reputationNFTs: Map<string, ReputationNFT> = new Map();
const missionContracts: Map<string, MissionContract> = new Map();

export class BlockchainService {
  private client: ReturnType<typeof createThirdwebClient> | null = null;
  private account: ReturnType<typeof privateKeyToAccount> | null = null;
  private chainId: number = 11155111; // Sepolia

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const clientId = process.env.THIRDWEB_CLIENT_ID;
    const secretKey = process.env.THIRDWEB_SECRET_KEY;
    const privateKey = process.env.WALLET_PRIVATE_KEY;

    if (clientId) {
      this.client = createThirdwebClient({
        clientId,
        secretKey,
      });

      if (privateKey) {
        this.account = privateKeyToAccount({
          client: this.client,
          privateKey: privateKey as `0x${string}`,
        });
      }
    }
  }

  /**
   * Check if blockchain is configured
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Get current wallet address
   */
  getWalletAddress(): string | null {
    return this.account?.address || null;
  }

  /**
   * Register an agent on-chain (stores credentials)
   */
  async registerAgentOnChain(
    agentId: string,
    name: string,
    walletAddress: string
  ): Promise<OnChainAgent> {
    const agent: OnChainAgent = {
      id: agentId,
      name,
      walletAddress,
      registeredAt: Date.now(),
      chainId: this.chainId,
    };

    onChainAgents.set(agentId, agent);

    // In production: Call smart contract to register agent
    // const contract = getContract({
    //   client: this.client!,
    //   chain: sepolia,
    //   address: TRUSTMESH_REGISTRY_ADDRESS,
    // });
    // const tx = await prepareContractCall({
    //   contract,
    //   method: "registerAgent",
    //   params: [agentId, name, walletAddress],
    // });
    // await sendTransaction({ transaction: tx, account: this.account! });

    console.log(`🔗 Agent ${name} registered on chain ${this.chainId}`);
    return agent;
  }

  /**
   * Mint a reputation NFT for an agent
   */
  async mintReputationNFT(
    agentId: string,
    trustLevel: string,
    totalScore: number
  ): Promise<ReputationNFT> {
    const tokenId = `rep-${randomUUID().slice(0, 8)}`;
    const txHash = `0x${randomUUID().replace(/-/g, "")}`;

    const nft: ReputationNFT = {
      tokenId,
      agentId,
      trustLevel,
      totalScore,
      mintedAt: Date.now(),
      txHash,
    };

    reputationNFTs.set(tokenId, nft);

    // Update agent's NFT reference
    const agent = onChainAgents.get(agentId);
    if (agent) {
      agent.reputationNFTId = tokenId;
    }

    // In production: Call NFT contract to mint
    // const nftContract = getContract({
    //   client: this.client!,
    //   chain: sepolia,
    //   address: REPUTATION_NFT_ADDRESS,
    // });
    // const tx = await prepareContractCall({
    //   contract: nftContract,
    //   method: "mintReputation",
    //   params: [agentId, trustLevel, totalScore],
    // });
    // const result = await sendTransaction({ transaction: tx, account: this.account! });

    console.log(`🎖️ Reputation NFT ${tokenId} minted for agent ${agentId}`);
    return nft;
  }

  /**
   * Update an existing reputation NFT
   */
  async updateReputationNFT(
    tokenId: string,
    newTrustLevel: string,
    newScore: number
  ): Promise<ReputationNFT | null> {
    const nft = reputationNFTs.get(tokenId);
    if (!nft) return null;

    nft.trustLevel = newTrustLevel;
    nft.totalScore = newScore;
    nft.txHash = `0x${randomUUID().replace(/-/g, "")}`;

    console.log(`📈 Reputation NFT ${tokenId} updated: ${newTrustLevel} (${newScore} pts)`);
    return nft;
  }

  /**
   * Create a mission escrow contract
   */
  async createMissionEscrow(
    missionId: string,
    participants: string[],
    escrowAmount: bigint
  ): Promise<MissionContract> {
    const txHash = `0x${randomUUID().replace(/-/g, "")}`;

    const contract: MissionContract = {
      missionId,
      escrowAmount,
      participants,
      status: "active",
      txHash,
    };

    missionContracts.set(missionId, contract);

    // In production: Deploy or call mission escrow contract
    console.log(`💰 Mission escrow created: ${missionId} with ${escrowAmount} wei`);
    return contract;
  }

  /**
   * Complete mission and distribute rewards
   */
  async completeMissionEscrow(
    missionId: string,
    participantRewards: Record<string, bigint>
  ): Promise<MissionContract | null> {
    const contract = missionContracts.get(missionId);
    if (!contract) return null;

    contract.status = "completed";
    contract.txHash = `0x${randomUUID().replace(/-/g, "")}`;

    // In production: Call escrow contract to distribute funds
    console.log(`✅ Mission ${missionId} completed, rewards distributed`);
    return contract;
  }

  /**
   * Verify agent ownership via wallet signature
   */
  async verifyAgentOwnership(
    agentId: string,
    signature: string,
    message: string
  ): Promise<boolean> {
    const agent = onChainAgents.get(agentId);
    if (!agent) return false;

    // In production: Verify signature using thirdweb
    // const isValid = await verifySignature({
    //   client: this.client!,
    //   address: agent.walletAddress,
    //   message,
    //   signature,
    // });
    
    // For demo, return true if signature is provided
    return signature.length > 0;
  }

  /**
   * Get agent's on-chain data
   */
  getOnChainAgent(agentId: string): OnChainAgent | null {
    return onChainAgents.get(agentId) || null;
  }

  /**
   * Get reputation NFT by token ID
   */
  getReputationNFT(tokenId: string): ReputationNFT | null {
    return reputationNFTs.get(tokenId) || null;
  }

  /**
   * Get all reputation NFTs for an agent
   */
  getAgentNFTs(agentId: string): ReputationNFT[] {
    return Array.from(reputationNFTs.values())
      .filter(nft => nft.agentId === agentId);
  }

  /**
   * Get mission contract
   */
  getMissionContract(missionId: string): MissionContract | null {
    return missionContracts.get(missionId) || null;
  }

  /**
   * Generate a credential proof for cross-chain verification
   */
  async generateCredentialProof(agentId: string): Promise<{
    agentId: string;
    walletAddress: string;
    trustLevel: string;
    timestamp: number;
    signature: string;
  } | null> {
    const agent = onChainAgents.get(agentId);
    if (!agent) return null;

    const nfts = this.getAgentNFTs(agentId);
    const latestNFT = nfts.sort((a, b) => b.mintedAt - a.mintedAt)[0];

    return {
      agentId,
      walletAddress: agent.walletAddress,
      trustLevel: latestNFT?.trustLevel || "unverified",
      timestamp: Date.now(),
      signature: `0x${randomUUID().replace(/-/g, "")}`, // Would be actual signature
    };
  }
}

// Singleton instance
export const blockchainService = new BlockchainService();
