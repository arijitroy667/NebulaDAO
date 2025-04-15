"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type ProposalContextType = {
    proposalIds: string[]
    addProposalId: (id: string) => void
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined)

export function ProposalProvider({ children }: { children: ReactNode }) {
    const [proposalIds, setProposalIds] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('proposalIds')
                return saved ? JSON.parse(saved) : []
            } catch {
                return []
            }
        }
        return []
    })

    useEffect(() => {
        if (typeof window !== 'undefined' && proposalIds.length > 0) {
            localStorage.setItem('proposalIds', JSON.stringify(proposalIds))
        }
    }, [proposalIds])

    const addProposalId = (id: string) => {
        setProposalIds(prev => {
            if (prev.includes(id)) return prev
            return [...prev, id]
        })
    }

    const value = {
        proposalIds,
        addProposalId
    }

    return (
        <ProposalContext.Provider value={value}>
            {children}
        </ProposalContext.Provider>
    )
}

export function useProposalContext() {
    const context = useContext(ProposalContext)
    if (!context) {
        throw new Error('useProposalContext must be used within a ProposalProvider')
    }
    return context
}