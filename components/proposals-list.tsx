"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRightIcon, ClockIcon } from "lucide-react"
import type { Proposal } from "@/components/proposals"

interface ProposalsListProps {
  proposals: Proposal[]
  onSelectProposal: (proposal: Proposal) => void
}

export function ProposalsList({ proposals, onSelectProposal }: ProposalsListProps) {
  const getStatusColor = (status: Proposal["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-500"
      case "passed":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getTimeLeft = (endDate: Date) => {
    const now = new Date()
    if (now > endDate) return "Ended"

    const diffMs = endDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h left`
    }
    return `${diffHours}h left`
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {proposals.map((proposal) => {
        const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain
        const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0

        return (
          <motion.div key={proposal.id} variants={item}>
            <Card className="overflow-hidden transition-all hover:shadow-md" onClick={() => onSelectProposal(proposal)}>
              <div className={`h-1 w-full ${getStatusColor(proposal.status)}`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-1">{proposal.title}</CardTitle>
                    <CardDescription>Created on {formatDate(proposal.createdAt)}</CardDescription>
                  </div>
                  <Badge variant={proposal.status === "active" ? "default" : "outline"}>
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="line-clamp-2 text-sm text-muted-foreground">{proposal.description}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Votes: {totalVotes}</span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {getTimeLeft(proposal.endDate)}
                    </span>
                  </div>
                  <Progress value={forPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>For: {proposal.votes.for}</span>
                    <span>Against: {proposal.votes.against}</span>
                    <span>Abstain: {proposal.votes.abstain}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="ml-auto flex items-center gap-1 text-sm"
                  onClick={() => onSelectProposal(proposal)}
                >
                  View Details
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )
      })}

      {proposals.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-center text-muted-foreground">No proposals found</p>
            <Button variant="outline" className="mt-4" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Create your first proposal
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
