import { createContext, useContext, useState, useEffect } from "react";

// Create a context for proposals
const ProposalContext = createContext();

export const ProposalProvider = ({ children }) => {
    const [proposals, setProposals] = useState([]);
    const [sortedProposalIds, setSortedProposalIds] = useState([]);

    // Function to fetch proposals (replace with your actual API or data fetching logic)
    const fetchProposals = async () => {
        // Example proposals with endTime (replace with real data)
        const fetchedProposals = [
            { id: 1, endTime: "2025-04-15T10:00:00Z" },
            { id: 2, endTime: "2025-04-14T10:00:00Z" },
            { id: 3, endTime: "2025-04-13T10:00:00Z" },
        ];
        setProposals(fetchedProposals);
    };

    // Sort proposals by endTime and update sortedProposalIds
    useEffect(() => {
        const sortedIds = proposals
            .sort((a, b) => new Date(b.endTime) - new Date(a.endTime)) // Sort descending
            .map((proposal) => proposal.id); // Extract IDs
        setSortedProposalIds(sortedIds);
    }, [proposals]);

    useEffect(() => {
        fetchProposals();
    }, []);

    return (
        <ProposalContext.Provider value={{ proposals, sortedProposalIds }}>
            {children}
        </ProposalContext.Provider>
    );
};

export const useProposalContext = () => useContext(ProposalContext);