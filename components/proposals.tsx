"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { CreateProposalForm } from "@/components/create-proposal-form"
import { ProposalsList } from "@/components/proposals-list"
import { ProposalDetails } from "@/components/proposal-details"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useProposalContext } from "./context/proposalContext"
import { getProposal, createProposal, voteOnProposal } from "@/integrate"

export type Proposal = {
  id: string
  title: string
  description: string
  votingPeriodDays: number
  targetContract: string
  calldata: string
  createdAt: Date
  status: "active" | "passed" | "rejected" | "pending"
  votes: {
    for: number
    against: number
    abstain: number
  }
  endDate: Date
}

export type Vote = {
  proposalId: string
  vote: "for" | "against" | "abstain"
}

// Vote types as constants (matching the contract)
const VOTE_FOR = 0;
const VOTE_AGAINST = 1;
const VOTE_ABSTAIN = 2;

export function Proposals() {
  // State definitions moved inside component
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "prop-1",
      title: "Treasury Allocation for Development",
      description: "Allocate 500 ETH from the treasury for the development of the new protocol version.",
      votingPeriodDays: 7,
      targetContract: "0x1234567890abcdef1234567890abcdef12345678",
      calldata: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "active",
      votes: {
        for: 120,
        against: 45,
        abstain: 15,
      },
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: "prop-2",
      title: "Protocol Parameter Update",
      description: "Update the fee structure to improve protocol sustainability.",
      votingPeriodDays: 5,
      targetContract: "0xabcdef1234567890abcdef1234567890abcdef12",
      calldata: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      status: "passed",
      votes: {
        for: 230,
        against: 20,
        abstain: 5,
      },
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const { proposalIds, addProposalId } = useProposalContext();
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  // Wallet connection effect
  useEffect(() => {
    // Only attempt to connect once
    if (connectionAttempted) return;
    
    const connectWallet = async () => {
      if (typeof window.ethereum === 'undefined') {
          console.error('MetaMask not detected');
          return false;
      }
      
      try {
          setConnectionAttempted(true);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setIsConnected(true);
          return true;
      } catch (error) {
          console.error('Failed to connect to wallet:', error);
          return false;
      }
    }
    
    connectWallet();
  }, [connectionAttempted]);

  // Combined proposal loading function
  useEffect(() => {
    if (!isConnected || !proposalIds || proposalIds.length === 0) return;

    const loadProposals = async () => {
      setIsLoadingProposals(true);
      
      try {
        // Resolve all IDs first
        const resolvedIds = await Promise.all(
          proposalIds.map(async id => {
            if (id && typeof id === 'object' && 'then' in id) {
              return await id;
            }
            return id;
          })
        );
        
        // Filter out IDs already in our local state
        const newIds = resolvedIds.filter(id => 
          id !== null && 
          id !== undefined && 
          !proposals.some(p => p.id === id.toString()) && 
          id !== "prop-1" && 
          id !== "prop-2"
        );
        
        if (newIds.length === 0) {
          return;
        }
        
        // Fetch all proposal details
        const loadedProposals: Proposal[] = [];
        
        for (const id of newIds) {
          try {
            // Convert to string to ensure it's a simple value
            const stringId = id.toString();
            const details = await getProposal(stringId);
            
            // Check if proposal exists
            if (details === null) {
              console.log(`Proposal ${stringId} does not exist, skipping...`);
              continue;
            }
            
            const startTimeMs = Number(details[5]) * 1000;
            const endTimeMs = Number(details[6]) * 1000;
            const votingPeriodDays = Math.ceil((endTimeMs - startTimeMs) / (1000 * 60 * 60 * 24));
            
            loadedProposals.push({
              id: stringId,
              title: `Proposal #${stringId}`, // Use ID as title or parse from description
              description: details[1], // Description is the second return value
              votingPeriodDays: votingPeriodDays,
              targetContract: "0x0000000000000000000000000000000000000000", // Placeholder
              calldata: "0x", // Placeholder
              createdAt: new Date(startTimeMs),
              status: new Date() > new Date(endTimeMs) ? 
                (Number(details[2]) > Number(details[3]) ? "passed" : "rejected") : "active",
              votes: {
                for: Number(details[2]),
                against: Number(details[3]),
                abstain: Number(details[4]),
              },
              endDate: new Date(endTimeMs),
            });
          } catch (error) {
            console.error(`Failed to load proposal ${id}:`, error);
          }
        }
        
        if (loadedProposals.length > 0) {
          // Merge with existing proposals
          setProposals(prev => [...loadedProposals, ...prev]);
        }
      } catch (error) {
        console.error("Failed to load proposals:", error);
      } finally {
        setIsLoadingProposals(false);
      }
    };
    
    loadProposals();
  }, [proposalIds, isConnected, proposals]);

  const handleCreateProposal = async (proposal: Omit<Proposal, "id" | "createdAt" | "status" | "votes" | "endDate">) => {
    try {
      // First create the proposal on blockchain
      const proposalId = await createProposal(
        proposal.description,
        proposal.votingPeriodDays * 86400, // Convert days to seconds for blockchain
        proposal.targetContract,
        proposal.calldata
      );
      
      if (proposalId) {
        // Add to context for persistence
        addProposalId(proposalId.toString());
        
        // Create local representation
        const newProposal: Proposal = {
          ...proposal,
          id: proposalId.toString(), // Use blockchain ID
          createdAt: new Date(),
          status: "active",
          votes: {
            for: 0,
            against: 0,
            abstain: 0,
          },
          endDate: new Date(Date.now() + proposal.votingPeriodDays * 24 * 60 * 60 * 1000),
        };
  
        // Update UI
        setProposals(prev => [newProposal, ...prev]);
        toast({
          title: "Proposal Created",
          description: `Your proposal has been successfully created with ID: ${proposalId}`,
        });
      }
    } catch (error) {
      console.error("Failed to create proposal:", error);
      toast({
        title: "Error",
        description: "Failed to create proposal. Check console for details.",
        variant: "destructive"
      });
    }
    
    setShowCreateForm(false);
  };

  const handleVote = async (vote: Vote) => {
    // Optimistically update the UI
    setProposals(
      proposals.map((proposal) => {
        if (proposal.id === vote.proposalId) {
          const updatedProposal = {
            ...proposal,
            votes: {
              ...proposal.votes,
              [vote.vote]: proposal.votes[vote.vote] + 1,
            },
          }

          // Update status if voting period has ended
          if (new Date() > proposal.endDate) {
            if (updatedProposal.votes.for > updatedProposal.votes.against) {
              updatedProposal.status = "passed"
            } else {
              updatedProposal.status = "rejected"
            }
          }

          return updatedProposal
        }
        return proposal
      }),
    );

    try {
      // Call blockchain vote function with corrected vote types (0=for, 1=against, 2=abstain)
      const voteType = vote.vote === "for" ? VOTE_FOR : vote.vote === "against" ? VOTE_AGAINST : VOTE_ABSTAIN;
      await voteOnProposal(vote.proposalId, voteType);
      
      toast({
        title: "Vote Recorded",
        description: `You voted "${vote.vote}" on proposal #${vote.proposalId}.`,
      });
      
      // If we're in the details view, update the selected proposal
      if (selectedProposal && selectedProposal.id === vote.proposalId) {
        const updated = proposals.find((p) => p.id === vote.proposalId);
        if (updated) {
          setSelectedProposal(updated);
        }
      }
    } catch (error) {
      console.error("Failed to record vote:", error);
      toast({
        title: "Error",
        description: "Failed to record vote on blockchain",
        variant: "destructive"
      });
      
      // Revert optimistic update if the blockchain call failed
      // (For a production app you might want to implement this)
    }
  };

  return (
    <div className="space-y-8">
      {!isConnected ? (
        <div className="text-center p-8 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection Required</h2>
          <p className="mb-4">Please connect your wallet to view and interact with proposals.</p>
          <Button 
            onClick={() => setConnectionAttempted(false)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent transition-all duration-500 ease-in-out">
                 Nebula DAO
            </h1>
              <p className="text-muted-foreground">Create, vote, and track proposals for the DAO</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="group" size="lg">
              <PlusIcon className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
              Create Proposal
            </Button>
          </motion.div>

          <AnimatePresence mode="wait">
            {showCreateForm ? (
              <motion.div
                key="create-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CreateProposalForm onSubmit={handleCreateProposal} onCancel={() => setShowCreateForm(false)} />
              </motion.div>
            ) : selectedProposal ? (
              <motion.div
                key="proposal-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProposalDetails proposal={selectedProposal} onBack={() => setSelectedProposal(null)} onVote={handleVote} />
              </motion.div>
            ) : (
              <motion.div
                key="proposals-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isLoadingProposals ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-500">Loading proposals...</p>
                  </div>
                ) : (
                  <ProposalsList proposals={proposals} onSelectProposal={setSelectedProposal} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}