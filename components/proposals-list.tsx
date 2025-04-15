// "use client"

// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { ChevronRightIcon, ClockIcon } from "lucide-react"
// import type { Proposal } from "@/components/proposals"

// interface ProposalsListProps {
//   proposals: Proposal[]
//   onSelectProposal: (proposal: Proposal) => void
// }

// export function ProposalsList({ proposals, onSelectProposal }: ProposalsListProps) {
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

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     }).format(date)
//   }

//   const getTimeLeft = (endDate: Date) => {
//     const now = new Date()
//     if (now > endDate) return "Ended"

//     const diffMs = endDate.getTime() - now.getTime()
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
//     const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

//     if (diffDays > 0) {
//       return `${diffDays}d ${diffHours}h left`
//     }
//     return `${diffHours}h left`
//   }

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 },
//   }

//   return (
//     <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
//       {proposals.map((proposal) => {
//         const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain
//         const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0

//         return (
//           <motion.div key={proposal.id} variants={item}>
//             <Card className="overflow-hidden transition-all hover:shadow-md" onClick={() => onSelectProposal(proposal)}>
//               <div className={`h-1 w-full ${getStatusColor(proposal.status)}`} />
//               <CardHeader className="pb-2">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <CardTitle className="line-clamp-1">{proposal.title}</CardTitle>
//                     <CardDescription>Created on {formatDate(proposal.createdAt)}</CardDescription>
//                   </div>
//                   <Badge variant={proposal.status === "active" ? "default" : "outline"}>
//                     {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="pb-2">
//                 <p className="line-clamp-2 text-sm text-muted-foreground">{proposal.description}</p>

//                 <div className="mt-4 space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span>Votes: {totalVotes}</span>
//                     <span className="flex items-center gap-1">
//                       <ClockIcon className="h-3 w-3" />
//                       {getTimeLeft(proposal.endDate)}
//                     </span>
//                   </div>
//                   <Progress value={forPercentage} className="h-2" />
//                   <div className="flex justify-between text-xs text-muted-foreground">
//                     <span>For: {proposal.votes.for}</span>
//                     <span>Against: {proposal.votes.against}</span>
//                     <span>Abstain: {proposal.votes.abstain}</span>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button
//                   variant="ghost"
//                   className="ml-auto flex items-center gap-1 text-sm"
//                   onClick={() => onSelectProposal(proposal)}
//                 >
//                   View Details
//                   <ChevronRightIcon className="h-4 w-4" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           </motion.div>
//         )
//       })}

//       {proposals.length === 0 && (
//         <Card className="border-dashed">
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <p className="text-center text-muted-foreground">No proposals found</p>
//             <Button variant="outline" className="mt-4" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
//               Create your first proposal
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </motion.div>
//   )
// }

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRightIcon, ClockIcon, Sparkles, TrendingUp, AlertTriangle, HourglassIcon } from "lucide-react"
import type { Proposal } from "@/components/proposals"

interface ProposalsListProps {
  proposals: Proposal[]
  onSelectProposal: (proposal: Proposal) => void
}

export function ProposalsList({ proposals, onSelectProposal }: ProposalsListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

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
        return <Sparkles className="h-3.5 w-3.5" />
      case "passed":
        return <TrendingUp className="h-3.5 w-3.5" />
      case "rejected":
        return <AlertTriangle className="h-3.5 w-3.5" />
      case "pending":
        return <HourglassIcon className="h-3.5 w-3.5" />
      default:
        return null
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
        staggerChildren: 0.12,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <AnimatePresence>
        {proposals.map((proposal) => {
          // Add null check and default values for votes
          const votes = proposal?.votes || { for: 0, against: 0, abstain: 0 }
          const totalVotes = votes.for + votes.against + votes.abstain
          const forPercentage = totalVotes > 0 ? (votes.for / totalVotes) * 100 : 0
          const isHovered = hoveredId === proposal.id

          return (
            <motion.div
              key={proposal.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredId(proposal.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="relative"
            >
              <Card
                className="overflow-hidden transition-all border-transparent shadow-md hover:shadow-xl cursor-pointer bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950"
                onClick={() => onSelectProposal(proposal)}
              >
                <div className={`h-1.5 w-full ${getStatusColor(proposal.status)}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="line-clamp-1 text-xl group-hover:text-primary transition-colors">
                        {proposal.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5">
                        <span>Created on {formatDate(proposal.createdAt)}</span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={proposal.status === "active" ? "default" : "outline"}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-all"
                    >
                      {getStatusIcon(proposal.status)}
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <motion.p
                    className="line-clamp-2 text-sm text-muted-foreground"
                    initial={{ height: "3rem" }}
                    animate={{ height: isHovered ? "auto" : "3rem" }}
                    transition={{ duration: 0.3 }}
                  >
                    {proposal.description}
                  </motion.p>

                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Votes: {totalVotes}</span>
                      <motion.span
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs"
                        animate={{
                          scale: [1, 1.05, 1],
                          backgroundColor: proposal.status === "active" ? ["#f1f5f9", "#e0f2fe", "#f1f5f9"] : undefined,
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        <ClockIcon className="h-3.5 w-3.5" />
                        {getTimeLeft(proposal.endDate)}
                      </motion.span>
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
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-cyan-600 dark:text-cyan-400">For: {votes.for}</span>
                      <span className="font-medium text-rose-600 dark:text-rose-400">Against: {votes.against}</span>
                      <span className="font-medium text-slate-600 dark:text-slate-400">Abstain: {votes.abstain}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="ml-auto flex items-center gap-1.5 text-sm group"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectProposal(proposal)
                    }}
                  >
                    <span className="relative">
                      View Details
                      <motion.span
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: isHovered ? "100%" : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                    <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRightIcon className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {proposals.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <Sparkles className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
              </motion.div>
              <p className="text-center text-muted-foreground mb-4">No proposals found</p>
              <Button
                variant="outline"
                className="mt-2 bg-gradient-to-r from-slate-50 to-white hover:from-white hover:to-slate-50 dark:from-slate-900 dark:to-slate-800 dark:hover:from-slate-800 dark:hover:to-slate-900 transition-all duration-300"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Create your first proposal
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

