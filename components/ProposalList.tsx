"use client"

import { useEffect, useState } from "react"
import { useProposalContext } from "./context/proposalContext"
import { getProposal, voteOnProposal } from "../integrate"

type Proposal = {
    id: string
    description: string
    votesFor: number
    votesAgainst: number
    votesAbstain: number
    startTime: string
    endTime: string
}

// Vote types as constants
const VOTE_FOR = 1;
const VOTE_AGAINST = 2;
const VOTE_ABSTAIN = 3;

export default function ProposalList() {
    const { proposalIds } = useProposalContext()
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [votingStatus, setVotingStatus] = useState<Record<string, {loading: boolean, error?: string}>>({})
    
    // Global connection state to prevent multiple requests
    const [connectionAttempted, setConnectionAttempted] = useState(false)

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

    useEffect(() => {
        const fetchProposalDetails = async () => {
            if (!isConnected || !proposalIds || proposalIds.length === 0) return

            setIsLoading(true)
            try {
                // Make sure all IDs are fully resolved first
                const resolvedIds = await Promise.all(
                    proposalIds.map(async id => {
                        if (id && typeof id === 'object' && 'then' in id) {
                            return await id;
                        }
                        return id;
                    })
                );
                
                // Now fetch the proposal details with definitely-resolved IDs
                const fetchedProposals = await Promise.all(
                    resolvedIds.map(async (id) => {
                        try {
                            if (id === null || id === undefined) {
                                return null;
                            }
                            
                            // Convert to string to ensure it's a simple value
                            const stringId = id.toString();
                            const proposal = await getProposal(stringId);
                            
                            if (!proposal) {
                                console.log(`Proposal ${stringId} does not exist or returned null`);
                                return null;
                            }
                            return {
                                id: stringId,
                                description: proposal[1],
                                votesFor: Number(proposal[2]),
                                votesAgainst: Number(proposal[3]),
                                votesAbstain: Number(proposal[4]),
                                startTime: new Date(Number(proposal[5]) * 1000).toISOString(),
                                endTime: new Date(Number(proposal[6]) * 1000).toISOString(),
                            };
                        } catch (error) {
                            console.error(`Failed to load proposal ${id}:`, error);
                            return null;
                        }
                    })
                );

                setProposals(fetchedProposals.filter(Boolean) as Proposal[]);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProposalDetails();
    }, [proposalIds, isConnected]);

    const handleVote = async (proposalId: string, voteType: number) => {
        if (!isConnected) {
            alert("Please connect your wallet to vote");
            return;
        }

        setVotingStatus(prev => ({
            ...prev,
            [proposalId]: { loading: true }
        }));

        try {
            await voteOnProposal(proposalId, voteType);
            
            // Update the proposal in the UI
            setProposals(currentProposals => 
                currentProposals.map(proposal => {
                    if (proposal.id !== proposalId) return proposal;
                    
                    // Update vote counts based on vote type
                    const updatedProposal = {...proposal};
                    if (voteType === VOTE_FOR) updatedProposal.votesFor++;
                    else if (voteType === VOTE_AGAINST) updatedProposal.votesAgainst++;
                    else if (voteType === VOTE_ABSTAIN) updatedProposal.votesAbstain++;
                    
                    return updatedProposal;
                })
            );

            setVotingStatus(prev => ({
                ...prev,
                [proposalId]: { loading: false }
            }));
        } catch (error) {
            console.error(`Failed to vote on proposal ${proposalId}:`, error);
            setVotingStatus(prev => ({
                ...prev,
                [proposalId]: { loading: false, error: "Failed to record vote" }
            }));
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Active Proposals</h2>
            {!isConnected ? (
                <div className="text-center text-gray-500">
                    Please connect your wallet to view proposals
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-500">Loading proposals...</p>
                </div>
            ) : proposals.length > 0 ? (
                proposals.map((proposal) => (
                    <div key={proposal.id} className="border p-4 rounded-lg">
                        <h3 className="text-xl font-semibold">Proposal {proposal.id}</h3>
                        <p className="my-2">{proposal.description}</p>
                        <div className="mt-2">
                            <p>Votes For: {proposal.votesFor}</p>
                            <p>Votes Against: {proposal.votesAgainst}</p>
                            <p>Votes Abstain: {proposal.votesAbstain}</p>
                        </div>
                        <div className="mt-3 flex space-x-3">
                            <button 
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                                onClick={() => handleVote(proposal.id, VOTE_FOR)}
                                disabled={votingStatus[proposal.id]?.loading}
                            >
                                Vote For
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                                onClick={() => handleVote(proposal.id, VOTE_AGAINST)}
                                disabled={votingStatus[proposal.id]?.loading}
                            >
                                Vote Against
                            </button>
                            <button 
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
                                onClick={() => handleVote(proposal.id, VOTE_ABSTAIN)}
                                disabled={votingStatus[proposal.id]?.loading}
                            >
                                Abstain
                            </button>
                        </div>
                        {votingStatus[proposal.id]?.loading && (
                            <p className="mt-2 text-blue-500">Submitting your vote...</p>
                        )}
                        {votingStatus[proposal.id]?.error && (
                            <p className="mt-2 text-red-500">{votingStatus[proposal.id].error}</p>
                        )}
                        <div className="mt-2 text-sm text-gray-500">
                            <p>Start: {new Date(proposal.startTime).toLocaleString()}</p>
                            <p>End: {new Date(proposal.endTime).toLocaleString()}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">No active proposals found</div>
            )}
        </div>
    );
}