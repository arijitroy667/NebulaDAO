"use client"

import { createContext, useContext, useState, ReactNode } from "react"

declare global {
  interface Window {
    ethereum?: any;
  }
}

type ProposalContextType = {
  proposalIds: string[]
  addProposalId: (id: string) => void
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined)

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [proposalIds, setProposalIds] = useState<string[]>([])

  const addProposalId = (id: string) => {
    setProposalIds(prev => [...prev, id])
  }

  return (
    <ProposalContext.Provider value={{ proposalIds, addProposalId }}>
      {children}
    </ProposalContext.Provider>
  )
}

export function useProposalContext() {
  const context = useContext(ProposalContext)
  if (context === undefined) {
    throw new Error('useProposalContext must be used within a ProposalProvider')
  }
  return context
}