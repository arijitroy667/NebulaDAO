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
  
  const [proposalIds, setProposalIds] = useState<string[]>(() => {
    // Load from localStorage on initial render
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("proposalIds");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const addProposalId = (id: string) => {
    setProposalIds(prev => {
      const updated = [...prev, id];
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("proposalIds", JSON.stringify(updated));
      }
      return updated;
    });
  };

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