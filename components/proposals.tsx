"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { CreateProposalForm } from "@/components/create-proposal-form"
import { ProposalsList } from "@/components/proposals-list"
import { ProposalDetails } from "@/components/proposal-details"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

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

export function Proposals() {
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
  ])

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { toast } = useToast()

  const handleCreateProposal = (proposal: Omit<Proposal, "id" | "createdAt" | "status" | "votes" | "endDate">) => {
    const newProposal: Proposal = {
      ...proposal,
      id: `prop-${proposals.length + 1}`,
      createdAt: new Date(),
      status: "active",
      votes: {
        for: 0,
        against: 0,
        abstain: 0,
      },
      endDate: new Date(Date.now() + proposal.votingPeriodDays * 24 * 60 * 60 * 1000),
    }

    setProposals([newProposal, ...proposals])
    setShowCreateForm(false)
    toast({
      title: "Proposal Created",
      description: "Your proposal has been successfully created.",
    })
  }

  const handleVote = (vote: Vote) => {
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
    )

    toast({
      title: "Vote Recorded",
      description: `You voted "${vote.vote}" on proposal #${vote.proposalId}.`,
    })

    // If we're in the details view, update the selected proposal
    if (selectedProposal && selectedProposal.id === vote.proposalId) {
      const updated = proposals.find((p) => p.id === vote.proposalId)
      if (updated) {
        setSelectedProposal(updated)
      }
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DAO Governance</h1>
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
            <ProposalsList proposals={proposals} onSelectProposal={setSelectedProposal} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
