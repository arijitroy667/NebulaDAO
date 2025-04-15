// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ArrowLeftIcon, CheckIcon, ClockIcon, CodeIcon, XIcon } from "lucide-react"
// import type { Proposal, Vote } from "@/components/proposals"

// interface ProposalDetailsProps {
//   proposal: Proposal
//   onBack: () => void
//   onVote: (vote: Vote) => void
// }

// export function ProposalDetails({ proposal, onBack, onVote }: ProposalDetailsProps) {
//   const [isVoting, setIsVoting] = useState(false)
//   const [selectedVote, setSelectedVote] = useState<"for" | "against" | "abstain" | null>(null)

//   const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain
//   const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0
//   const againstPercentage = totalVotes > 0 ? (proposal.votes.against / totalVotes) * 100 : 0
//   const abstainPercentage = totalVotes > 0 ? (proposal.votes.abstain / totalVotes) * 100 : 0

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//     }).format(date)
//   }

//   const getTimeLeft = (endDate: Date) => {
//     const now = new Date()
//     if (now > endDate) return "Voting period ended"

//     const diffMs = endDate.getTime() - now.getTime()
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
//     const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
//     const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

//     return `${diffDays}d ${diffHours}h ${diffMinutes}m remaining`
//   }

//   const getStatusColor = (status: Proposal["status"]) => {
//     switch (status) {
//       case "active":
//         return "bg-blue-500"
//       case "passed":
//         return "bg-green-500"
//       case "rejected":
//         return "bg-red-500"
//       case "pending":
//         return "bg-yellow-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   const handleVote = () => {
//     if (!selectedVote) return

//     onVote({
//       proposalId: proposal.id,
//       vote: selectedVote,
//     })

//     setIsVoting(false)
//     setSelectedVote(null)
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card className="border-2 border-primary/10">
//         <div className={`h-1 w-full ${getStatusColor(proposal.status)}`} />
//         <CardHeader>
//           <div className="flex items-center">
//             <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 h-8 w-8">
//               <ArrowLeftIcon className="h-4 w-4" />
//             </Button>
//             <div className="flex-1">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <CardTitle>{proposal.title}</CardTitle>
//                   <CardDescription>Proposal ID: {proposal.id}</CardDescription>
//                 </div>
//                 <Badge variant={proposal.status === "active" ? "default" : "outline"}>
//                   {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
//             <div className="flex items-center gap-2">
//               <ClockIcon className="h-4 w-4 text-muted-foreground" />
//               <span>{getTimeLeft(proposal.endDate)}</span>
//             </div>
//             <div>End date: {formatDate(proposal.endDate)}</div>
//           </div>

//           <Tabs defaultValue="details">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="votes">Votes</TabsTrigger>
//               <TabsTrigger value="execution">Execution</TabsTrigger>
//             </TabsList>

//             <TabsContent value="details" className="space-y-4 pt-4">
//               <div>
//                 <h3 className="mb-2 font-medium">Description</h3>
//                 <p className="text-muted-foreground">{proposal.description}</p>
//               </div>

//               <div>
//                 <h3 className="mb-2 font-medium">Created</h3>
//                 <p className="text-muted-foreground">{formatDate(proposal.createdAt)}</p>
//               </div>

//               <div>
//                 <h3 className="mb-2 font-medium">Voting Period</h3>
//                 <p className="text-muted-foreground">{proposal.votingPeriodDays} days</p>
//               </div>
//             </TabsContent>

//             <TabsContent value="votes" className="space-y-6 pt-4">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium">For</span>
//                     <span>
//                       {proposal.votes.for} votes ({forPercentage.toFixed(2)}%)
//                     </span>
//                   </div>
//                   <Progress value={forPercentage} className="h-2 bg-muted" />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium">Against</span>
//                     <span>
//                       {proposal.votes.against} votes ({againstPercentage.toFixed(2)}%)
//                     </span>
//                   </div>
//                   <Progress value={againstPercentage} className="h-2 bg-muted" />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium">Abstain</span>
//                     <span>
//                       {proposal.votes.abstain} votes ({abstainPercentage.toFixed(2)}%)
//                     </span>
//                   </div>
//                   <Progress value={abstainPercentage} className="h-2 bg-muted" />
//                 </div>
//               </div>

//               <div className="rounded-lg border p-4">
//                 <h3 className="mb-2 font-medium">Total Votes</h3>
//                 <p className="text-2xl font-bold">{totalVotes}</p>
//               </div>
//             </TabsContent>

//             <TabsContent value="execution" className="space-y-4 pt-4">
//               <div>
//                 <h3 className="mb-2 font-medium">Target Contract</h3>
//                 <div className="flex items-center gap-2 overflow-hidden rounded-md bg-muted p-2 font-mono text-xs">
//                   <CodeIcon className="h-4 w-4 shrink-0" />
//                   <span className="truncate">{proposal.targetContract}</span>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="mb-2 font-medium">Calldata</h3>
//                 <div className="flex items-center gap-2 overflow-hidden rounded-md bg-muted p-2 font-mono text-xs">
//                   <CodeIcon className="h-4 w-4 shrink-0" />
//                   <span className="truncate">{proposal.calldata}</span>
//                 </div>
//               </div>

//               <div className="rounded-lg border p-4">
//                 <h3 className="mb-2 font-medium">Execution Status</h3>
//                 <Badge variant={proposal.status === "passed" ? "default" : "outline"}>
//                   {proposal.status === "passed" ? "Ready for execution" : "Pending vote results"}
//                 </Badge>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//         <CardFooter className="flex flex-col gap-4">
//           {isVoting ? (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="w-full space-y-4"
//             >
//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <Button
//                   variant={selectedVote === "for" ? "default" : "outline"}
//                   className="flex-1 justify-start gap-2"
//                   onClick={() => setSelectedVote("for")}
//                 >
//                   <CheckIcon className="h-4 w-4" />
//                   For
//                 </Button>
//                 <Button
//                   variant={selectedVote === "against" ? "default" : "outline"}
//                   className="flex-1 justify-start gap-2"
//                   onClick={() => setSelectedVote("against")}
//                 >
//                   <XIcon className="h-4 w-4" />
//                   Against
//                 </Button>
//                 <Button
//                   variant={selectedVote === "abstain" ? "default" : "outline"}
//                   className="flex-1 justify-start gap-2"
//                   onClick={() => setSelectedVote("abstain")}
//                 >
//                   Abstain
//                 </Button>
//               </div>

//               <div className="flex justify-end gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setIsVoting(false)
//                     setSelectedVote(null)
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button onClick={handleVote} disabled={!selectedVote}>
//                   Submit Vote
//                 </Button>
//               </div>
//             </motion.div>
//           ) : (
//             <Button onClick={() => setIsVoting(true)} disabled={proposal.status !== "active"} className="w-full">
//               {proposal.status === "active" ? "Vote on Proposal" : "Voting Closed"}
//             </Button>
//           )}
//         </CardFooter>
//       </Card>
//     </motion.div>
//   )
// }

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  CodeIcon,
  XIcon,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  HourglassIcon,
} from "lucide-react"
import type { Proposal, Vote } from "@/components/proposals"

interface ProposalDetailsProps {
  proposal: Proposal
  onBack: () => void
  onVote: (vote: Vote) => void
}

export function ProposalDetails({ proposal, onBack, onVote }: ProposalDetailsProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [selectedVote, setSelectedVote] = useState<"for" | "against" | "abstain" | null>(null)
  const [activeTab, setActiveTab] = useState("details")

  // Add null check and default values
  if (!proposal) {
    return (
      <Card className="border-2 border-primary/10 overflow-hidden shadow-lg p-8 text-center">
        <p>Proposal not found or still loading...</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </Card>
    )
  }

  // Ensure votes object exists with default values
  const votes = proposal.votes || { for: 0, against: 0, abstain: 0 }

  const totalVotes = votes.for + votes.against + votes.abstain
  const forPercentage = totalVotes > 0 ? (votes.for / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (votes.against / totalVotes) * 100 : 0
  const abstainPercentage = totalVotes > 0 ? (votes.abstain / totalVotes) * 100 : 0

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
        return "bg-gradient-to-r from-blue-500 to-cyan-400"
      case "passed":
        return "bg-gradient-to-r from-emerald-500 to-green-400"
      case "rejected":
        return "bg-gradient-to-r from-red-500 to-rose-400"
      case "pending":
        return "bg-gradient-to-r from-amber-400 to-yellow-300"
      default:
        return "bg-gradient-to-r from-slate-500 to-gray-400"
    }
  }

  const getStatusIcon = (status: Proposal["status"]) => {
    switch (status) {
      case "active":
        return <Sparkles className="h-4 w-4" />
      case "passed":
        return <TrendingUp className="h-4 w-4" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />
      case "pending":
        return <HourglassIcon className="h-4 w-4" />
      default:
        return null
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
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="border-2 border-primary/10 overflow-hidden shadow-lg">
        <div className={`h-1.5 w-full ${getStatusColor(proposal.status)}`} />
        <CardHeader>
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 h-8 w-8">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </motion.div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{proposal.title}</CardTitle>
                  <CardDescription className="text-sm">Proposal ID: {proposal.id}</CardDescription>
                </div>
                <Badge
                  variant={proposal.status === "active" ? "default" : "outline"}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium"
                >
                  {getStatusIcon(proposal.status)}
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            className="flex items-center justify-between rounded-lg bg-slate-100 dark:bg-slate-800 p-3.5 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  scale: proposal.status === "active" ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: proposal.status === "active" ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                }}
              >
                <ClockIcon className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
              </motion.div>
              <span>{getTimeLeft(proposal.endDate)}</span>
            </div>
            <div>End date: {formatDate(proposal.endDate)}</div>
          </motion.div>

          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="details" className="data-[state=active]:bg-primary/10">
                Details
              </TabsTrigger>
              <TabsTrigger value="votes" className="data-[state=active]:bg-primary/10">
                Votes
              </TabsTrigger>
              <TabsTrigger value="execution" className="data-[state=active]:bg-primary/10">
                Execution
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
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
                </motion.div>
              )}

              {activeTab === "votes" && (
                <motion.div
                  key="votes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="votes" className="space-y-6 pt-4">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                            <CheckIcon className="h-4 w-4" />
                            For
                          </span>
                          <span>
                            {votes.for} votes ({forPercentage.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                            <motion.div
                              className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-cyan-500 to-blue-500"
                              style={{ width: `${forPercentage}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${forPercentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                            <XIcon className="h-4 w-4" />
                            Against
                          </span>
                          <span>
                            {votes.against} votes ({againstPercentage.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                            <motion.div
                              className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-rose-500 to-red-500"
                              style={{ width: `${againstPercentage}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${againstPercentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-600 dark:text-slate-400">Abstain</span>
                          <span>
                            {votes.abstain} votes ({abstainPercentage.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                            <motion.div
                              className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-slate-500 to-gray-500"
                              style={{ width: `${abstainPercentage}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${abstainPercentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className="rounded-lg border p-5 bg-slate-50 dark:bg-slate-900"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <h3 className="mb-2 font-medium">Total Votes</h3>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                        {totalVotes}
                      </p>
                    </motion.div>
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === "execution" && (
                <motion.div
                  key="execution"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="execution" className="space-y-4 pt-4">
                    <div>
                      <h3 className="mb-2 font-medium">Target Contract</h3>
                      <div className="flex items-center gap-2 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 p-3 font-mono text-xs">
                        <CodeIcon className="h-4 w-4 shrink-0 text-cyan-500 dark:text-cyan-400" />
                        <span className="truncate">{proposal.targetContract}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Calldata</h3>
                      <div className="flex items-center gap-2 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 p-3 font-mono text-xs">
                        <CodeIcon className="h-4 w-4 shrink-0 text-cyan-500 dark:text-cyan-400" />
                        <span className="truncate">{proposal.calldata}</span>
                      </div>
                    </div>

                    <motion.div
                      className="rounded-lg border p-5 bg-slate-50 dark:bg-slate-900"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <h3 className="mb-2 font-medium">Execution Status</h3>
                      <Badge
                        variant={proposal.status === "passed" ? "default" : "outline"}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium"
                      >
                        {getStatusIcon(proposal.status)}
                        {proposal.status === "passed" ? "Ready for execution" : "Pending vote results"}
                      </Badge>
                    </motion.div>
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {isVoting ? (
              <motion.div
                key="voting-options"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                className="w-full space-y-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Button
                      variant={selectedVote === "for" ? "default" : "outline"}
                      className={`flex-1 justify-start gap-2 w-full ${selectedVote === "for" ? "bg-gradient-to-r from-cyan-500 to-blue-500" : ""}`}
                      onClick={() => setSelectedVote("for")}
                    >
                      <CheckIcon className="h-4 w-4" />
                      For
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Button
                      variant={selectedVote === "against" ? "default" : "outline"}
                      className={`flex-1 justify-start gap-2 w-full ${selectedVote === "against" ? "bg-gradient-to-r from-rose-500 to-red-500" : ""}`}
                      onClick={() => setSelectedVote("against")}
                    >
                      <XIcon className="h-4 w-4" />
                      Against
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Button
                      variant={selectedVote === "abstain" ? "default" : "outline"}
                      className={`flex-1 justify-start gap-2 w-full ${selectedVote === "abstain" ? "bg-gradient-to-r from-slate-500 to-gray-500" : ""}`}
                      onClick={() => setSelectedVote("abstain")}
                    >
                      Abstain
                    </Button>
                  </motion.div>
                </div>

                <div className="flex justify-end gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsVoting(false)
                        setSelectedVote(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleVote}
                      disabled={!selectedVote}
                      className={
                        selectedVote
                          ? "bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600"
                          : ""
                      }
                    >
                      Submit Vote
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="vote-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setIsVoting(true)}
                    disabled={proposal.status !== "active"}
                    className={`w-full ${proposal.status === "active" ? "bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600" : ""}`}
                  >
                    {proposal.status === "active" ? "Vote on Proposal" : "Voting Closed"}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

