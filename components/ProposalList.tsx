"use client"

declare global {
    interface Window {
        ethereum?: any;
    }
}
import { useEffect, useState } from "react"
import { useProposalContext } from "./context/proposalContext"
import { BrowserProvider, Contract } from "ethers"

type Proposal = {
    id: string
    description: string
    votesFor: number
    votesAgainst: number
    votesAbstain: number
    startTime: string
    endTime: string
}

export function ProposalList() {
    const { proposalIds } = useProposalContext()
    const [proposals, setProposals] = useState<Proposal[]>([])

    useEffect(() => {
        const fetchProposalDetails = async () => {
            try {
                const provider = new BrowserProvider(window.ethereum)
                const contractAddress = "YOUR_CONTRACT_ADDRESS"
                const abi = ["function getProposal(uint256 proposalId) public view returns (address, string, uint256, uint256, uint256, uint256, uint256, bool)"]
                const contract = new Contract(contractAddress, abi, provider)

                const fetchedProposals = await Promise.all(
                    proposalIds.map(async (id) => {
                        const proposal = await contract.getProposal(id)
                        return {
                            id,
                            description: proposal[1],
                            votesFor: proposal[2],
                            votesAgainst: proposal[3],
                            votesAbstain: proposal[4],
                            startTime: new Date(proposal[5] * 1000).toISOString(),
                            endTime: new Date(proposal[6] * 1000).toISOString(),
                        }
                    })
                )

                setProposals(fetchedProposals)
            } catch (error) {
                console.error("Error fetching proposals:", error)
            }
        }

        if (proposalIds.length > 0) {
            fetchProposalDetails()
        }
    }, [proposalIds])

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Active Proposals</h2>
            {proposals.map((proposal) => (
                <div key={proposal.id} className="border p-4 rounded-lg">
                    <h3 className="text-xl font-semibold">Proposal {proposal.id}</h3>
                    <p>{proposal.description}</p>
                    <div className="mt-2">
                        <p>Votes For: {proposal.votesFor}</p>
                        <p>Votes Against: {proposal.votesAgainst}</p>
                        <p>Votes Abstain: {proposal.votesAbstain}</p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        <p>Start: {new Date(proposal.startTime).toLocaleString()}</p>
                        <p>End: {new Date(proposal.endTime).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}