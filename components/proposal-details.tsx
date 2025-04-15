"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon, CheckIcon, ClockIcon, CodeIcon, XIcon } from "lucide-react"
import type { Proposal, Vote } from "@/components/proposals"

interface ProposalDetailsProps {
  proposal: Proposal
  onBack: () => void
  onVote: (vote: Vote) => void
}

export function ProposalDetails({ proposal, onBack, onVote }: ProposalDetailsProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [selectedVote, setSelectedVote] = useState<"for" | "against" | "abstain" | null>(null)

  const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain
  const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (proposal.votes.against / totalVotes) * 100 : 0
  const abstainPercentage = totalVotes > 0 ? (proposal.votes.abstain / totalVotes) * 100 : 0

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getTimeLeft = (endDate: Date) => {
    const now = new Date()
    if (now > endDate) return "Voting period ended"

    const diffMs = endDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffDays}d ${diffHours}h ${diffMinutes}m remaining`
  }

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

  const handleVote = () => {
    if (!selectedVote) return

    onVote({
      proposalId: proposal.id,
      vote: selectedVote,
    })

    setIsVoting(false)
    setSelectedVote(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-primary/10">
        <div className={`h-1 w-full ${getStatusColor(proposal.status)}`} />
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 h-8 w-8">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{proposal.title}</CardTitle>
                  <CardDescription>Proposal ID: {proposal.id}</CardDescription>
                </div>
                <Badge variant={proposal.status === "active" ? "default" : "outline"}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span>{getTimeLeft(proposal.endDate)}</span>
            </div>
            <div>End date: {formatDate(proposal.endDate)}</div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="votes">Votes</TabsTrigger>
              <TabsTrigger value="execution">Execution</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div>
                <h3 className="mb-2 font-medium">Description</h3>
                <p className="text-muted-foreground">{proposal.description}</p>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Created</h3>
                <p className="text-muted-foreground">{formatDate(proposal.createdAt)}</p>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Voting Period</h3>
                <p className="text-muted-foreground">{proposal.votingPeriodDays} days</p>
              </div>
            </TabsContent>

            <TabsContent value="votes" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">For</span>
                    <span>
                      {proposal.votes.for} votes ({forPercentage.toFixed(2)}%)
                    </span>
                  </div>
                  <Progress value={forPercentage} className="h-2 bg-muted" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Against</span>
                    <span>
                      {proposal.votes.against} votes ({againstPercentage.toFixed(2)}%)
                    </span>
                  </div>
                  <Progress value={againstPercentage} className="h-2 bg-muted" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Abstain</span>
                    <span>
                      {proposal.votes.abstain} votes ({abstainPercentage.toFixed(2)}%)
                    </span>
                  </div>
                  <Progress value={abstainPercentage} className="h-2 bg-muted" />
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Total Votes</h3>
                <p className="text-2xl font-bold">{totalVotes}</p>
              </div>
            </TabsContent>

            <TabsContent value="execution" className="space-y-4 pt-4">
              <div>
                <h3 className="mb-2 font-medium">Target Contract</h3>
                <div className="flex items-center gap-2 overflow-hidden rounded-md bg-muted p-2 font-mono text-xs">
                  <CodeIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{proposal.targetContract}</span>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Calldata</h3>
                <div className="flex items-center gap-2 overflow-hidden rounded-md bg-muted p-2 font-mono text-xs">
                  <CodeIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{proposal.callData}</span>
                </div>
              </div>


              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Execution Status</h3>
                <Badge variant={proposal.status === "passed" ? "default" : "outline"}>
                  {proposal.status === "passed" ? "Ready for execution" : "Pending vote results"}
                </Badge>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {isVoting ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full space-y-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant={selectedVote === "for" ? "default" : "outline"}
                  className="flex-1 justify-start gap-2"
                  onClick={() => setSelectedVote("for")}
                >
                  <CheckIcon className="h-4 w-4" />
                  For
                </Button>
                <Button
                  variant={selectedVote === "against" ? "default" : "outline"}
                  className="flex-1 justify-start gap-2"
                  onClick={() => setSelectedVote("against")}
                >
                  <XIcon className="h-4 w-4" />
                  Against
                </Button>
                <Button
                  variant={selectedVote === "abstain" ? "default" : "outline"}
                  className="flex-1 justify-start gap-2"
                  onClick={() => setSelectedVote("abstain")}
                >
                  Abstain
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsVoting(false)
                    setSelectedVote(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleVote} disabled={!selectedVote}>
                  Submit Vote
                </Button>
              </div>
            </motion.div>
          ) : (
            <Button onClick={() => setIsVoting(true)} disabled={proposal.status !== "active"} className="w-full">
              {proposal.status === "active" ? "Vote on Proposal" : "Voting Closed"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
