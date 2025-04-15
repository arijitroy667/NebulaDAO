import { ethers } from "ethers";

const TOKEN_ADDRESS = "0x6fAd7ECe2C82a6AeB1B87755261456a58d276976";
const DAO_ADDRESS = "0x62BbC5F762f1814E47A32c0adeD933a4Fa3Cd8b3";

const TOKEN_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function delegate(address delegatee) external",
    "function delegates(address account) external view returns (address)",
    "function getPastVotes(address account, uint256 blockNumber) external view returns (uint256)"
];

const DAO_ABI = [
    // "function createProposal(string memory _description,uint256 _votingPeriod,address _targetContract,bytes memory _callData) external returns(uint256)",
    // "function vote(uint256 _proposalId, uint8 _voteType) external",
    // "function MinimumTokensToPropose() external view returns (uint256)",
    // "function executeProposal(uint256 _proposalId) external nonReentrant",
    // "function getProposal(uint256 _proposalId) external view returns (address proposer,string memory description,uint256 votesFor,uint256 votesAgainst,uint256 votesAbstain,uint256 startTime,uint256 endTime,bool executed)",
    // "function updateParameters(uint256 _minimumTokensToPropose,uint256 _minimumVotingPeriod,uint256 _quorumPercentage) external onlyOwner"
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_governanceToken",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_minimumTokensToPropose",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_minimumVotingPeriod",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_quorumPercentage",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "OwnableInvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "OwnableUnauthorizedAccount",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "ReentrancyGuardReentrantCall",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "proposalId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "proposer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                }
            ],
            "name": "ProposalCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "proposalId",
                    "type": "uint256"
                }
            ],
            "name": "ProposalExecuted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "proposalId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "voter",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint8",
                    "name": "voteType",
                    "type": "uint8"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "weight",
                    "type": "uint256"
                }
            ],
            "name": "VoteCast",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "MinimumTokensToPropose",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_votingPeriod",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "_targetContract",
                    "type": "address"
                },
                {
                    "internalType": "bytes",
                    "name": "_callData",
                    "type": "bytes"
                }
            ],
            "name": "createProposal",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_proposalId",
                    "type": "uint256"
                }
            ],
            "name": "executeProposal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_proposalId",
                    "type": "uint256"
                }
            ],
            "name": "getProposal",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "proposer",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "votesFor",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesAgainst",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesAbstain",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "startTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "endTime",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "executed",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "governanceToken",
            "outputs": [
                {
                    "internalType": "contract ERC20Votes",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "hasVoted",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "minimumTokensToPropose",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "minimumVotingPeriod",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "proposalCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "proposals",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "proposer",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "votesFor",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesAgainst",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesAbstain",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "startTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "endTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "startBlock",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "executed",
                    "type": "bool"
                },
                {
                    "internalType": "bytes",
                    "name": "callData",
                    "type": "bytes"
                },
                {
                    "internalType": "address",
                    "name": "targetContract",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "quorumPercentage",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_minimumTokensToPropose",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_minimumVotingPeriod",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_quorumPercentage",
                    "type": "uint256"
                }
            ],
            "name": "updateParameters",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_proposalId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint8",
                    "name": "_voteType",
                    "type": "uint8"
                }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
];

async function getContract() {
    if (!window.ethereum) {
        throw new Error("MetaMask not detected");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    if (!DAO_ADDRESS) {
        throw new Error("Contract address is undefined");
    }

    return new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer);
}

async function delegateTokens() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    try {
        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        
        // First check if the user already has delegated votes
        try {
            const daoContract = new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer);
            const minTokensToPropose = await daoContract.minimumTokensToPropose();
            
            // Add this method to TOKEN_ABI
            // "function getPastVotes(address account, uint256 blockNumber) external view returns (uint256)"
            const currentBlock = await provider.getBlockNumber();
            const currentVotes = await tokenContract.getPastVotes(address, currentBlock - 1);
            
            console.log(`Current delegated votes: ${ethers.formatEther(currentVotes)}`);
            console.log(`Minimum required: ${ethers.formatEther(minTokensToPropose)}`);
            
            if (currentVotes >= minTokensToPropose) {
                console.log("Already have enough delegated votes");
                return true;
            }
        } catch (error) {
            console.warn("Could not check current votes, proceeding with delegation", error);
        }
        
        // Check balance
        const balance = await tokenContract.balanceOf(address);
        if (balance <= 0) {
            throw new Error("No tokens to delegate. You need to get some tokens first.");
        }
        
        console.log(`Delegating ${ethers.formatEther(balance)} tokens to self...`);
        const tx = await tokenContract.delegate(address);
        const receipt = await tx.wait();
        console.log("Delegation transaction confirmed:", receipt.hash);
        
        // IMPORTANT: Wait for the next block before proceeding
        console.log("Waiting for delegation to take effect (next block)...");
        await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds
        
        return true;
    } catch (error) {
        console.error("Token delegation failed:", error);
        throw new Error(`Delegation failed: ${error.message}`);
    }
}

async function createProposal(description, votingPeriod, targetContract, callData) {
    try {
        await checkAndApproveTokens();
        
        const delegated = await delegateTokens();
        if (!delegated) {
            throw new Error("Could not delegate tokens. Please try again later.");
        }

        // Add this code to check minimum voting period
        const contract = await getContract();
        const minVotingPeriod = await contract.minimumVotingPeriod();
        console.log(`Minimum voting period: ${minVotingPeriod}`);
        
        // Ensure voting period is at least the minimum required
        const adjustedVotingPeriod = Math.max(Number(votingPeriod), Number(minVotingPeriod));
        if (adjustedVotingPeriod > votingPeriod) {
            console.log(`Voting period adjusted from ${votingPeriod} to minimum required: ${adjustedVotingPeriod}`);
            votingPeriod = adjustedVotingPeriod;
        }

        console.log("Tokens approved and delegated successfully");
        const tx = await contract.createProposal(description, votingPeriod, targetContract, callData);
        console.log("Create proposal transaction sent:", tx.hash);
        
        const receipt = await tx.wait();
        console.log("Create proposal transaction confirmed:", receipt);
        
        // Extract proposal ID from event
        const proposalCreatedEvent = receipt.logs
            .map(log => {
                try {
                    return contract.interface.parseLog(log);
                } catch (e) {
                    return null;
                }
            })
            .find(event => event && event.name === "ProposalCreated");
        
        const proposalId = proposalCreatedEvent ? proposalCreatedEvent.args[0] : null;
        console.log("Proposal created with ID:", proposalId);
        return proposalId;
    } catch (error) {
        console.error("Failed to create proposal:", error);
        if (error.message && error.message.includes("Not enough delegated votes to propose")) {
            throw new Error("You don't have enough voting power. Make sure you have delegated your tokens and wait for the next block.");
        } else if (error.message && error.message.includes("Voting period too short")) {
            throw new Error("Voting period is too short. Please increase the voting period.");
        }
        throw error;
    }
}

async function voteOnProposal(proposalId, voteType) {
     // Add validation
  if (voteType !== 1 && voteType !== 2 && voteType !== 3) {
    throw new Error(`Invalid vote type: ${voteType}. Must be 1, 2, or 3.`);
  }
  
  const contract = await getContract();
  const tx = await contract.vote(proposalId, voteType);
  await tx.wait();
  console.log("Vote cast:", tx);
}

async function executeProposal(proposalId) {
    const contract = await getContract(); // Fixed: removed parameter
    const tx = await contract.executeProposal(proposalId);
    await tx.wait();
    console.log("Proposal executed:", tx);
}

async function getProposal(proposalId) {
    try {
        // Handle null/undefined inputs
        if (proposalId === null || proposalId === undefined) {
            throw new Error("Invalid proposal ID: null or undefined");
        }

        // Convert Promise to actual value
        let resolvedId;
        if (typeof proposalId === 'object' && proposalId !== null) {
            console.log("ProposalID type before resolution:", typeof proposalId);
            
            if ('then' in proposalId && typeof proposalId.then === 'function') {
                try {
                    resolvedId = await proposalId;
                    console.log("Resolved Promise to:", resolvedId);
                } catch (err) {
                    throw new Error(`Failed to resolve Promise: ${err.message}`);
                }
            } else {
                resolvedId = proposalId;
            }
        } else {
            resolvedId = proposalId;
        }
        
        // Convert to a proper numeric value
        let numericId;
        if (typeof resolvedId === 'string') {
            // Remove any non-numeric characters if present
            const cleanId = resolvedId.replace(/[^0-9]/g, '');
            numericId = cleanId.length > 0 ? cleanId : '0';
        } else if (typeof resolvedId === 'number') {
            numericId = resolvedId.toString();
        } else {
            numericId = '0';
            console.warn(`Unexpected proposal ID type: ${typeof resolvedId}, using default 0`);
        }
        
        console.log(`Final ID being sent to contract: ${numericId} (type: ${typeof numericId})`);
        
        // First check if the proposal exists by querying the proposal count
        const contract = await getContract();
        try {
            const count = await contract.proposalCount();
            const proposalCount = Number(count);
            console.log(`Total proposal count: ${proposalCount}`);
            
            // Check if the ID is within valid range (assuming IDs start from 1)
            const idNumber = Number(numericId);
            if (idNumber <= 0 || idNumber > proposalCount) {
                console.warn(`Proposal ID ${idNumber} out of range (max: ${proposalCount})`);
                return null; // Return null to indicate non-existent proposal
            }
            
            // Try to get the proposal
            const proposal = await contract.getProposal(numericId);
            console.log("Proposal details:", proposal);
            return proposal;
        } catch (contractError) {
            console.error(`Contract error fetching proposal: ${contractError.message}`);
            
            // Check if it's the specific "does not exist" error
            if (contractError.message.includes("Proposal does not exist")) {
                console.warn(`Proposal ${numericId} does not exist on the contract`);
                return null; // Return null instead of throwing
            }
            
            throw contractError; // Re-throw other errors
        }
    } catch (error) {
        console.error(`Error fetching proposal ${proposalId}:`, error);
        throw error;
    }
}

async function updateParameters(minimumTokensToPropose, minimumVotingPeriod, quorumPercentage) {
    const contract = await getContract(); // Fixed: removed parameter
    const tx = await contract.updateParameters(minimumTokensToPropose, minimumVotingPeriod, quorumPercentage);
    await tx.wait();
    console.log("Parameters updated:", tx);
}

async function checkAndApproveTokens() {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        // 1. First check if the token contract is valid
        try {
            const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
            const balance = await tokenContract.balanceOf(address);
            console.log(`Token balance: ${ethers.formatEther(balance)}`);
            
            // 2. Only if token contract works, try DAO contract
            const daoContract = new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer);
            
            let minTokens;
            try {
                minTokens = await daoContract.MinimumTokensToPropose();
                console.log(`Minimum tokens required: ${ethers.formatEther(minTokens)}`);
            } catch (error) {
                console.warn("Could not fetch minimum tokens, using default:", error);
                minTokens = ethers.parseEther("1");
            }
            
            if (balance < minTokens) {
                throw new Error(`Insufficient tokens. You have ${ethers.formatEther(balance)} but need ${ethers.formatEther(minTokens)}`);
            }
            
            // 3. Approve tokens
            try {
                const tx = await tokenContract.approve(DAO_ADDRESS, minTokens);
                await tx.wait();
                console.log("Token approval successful");
                return true;
            } catch (approveError) {
                console.error("Token approval failed:", approveError);
                throw new Error("Failed to approve tokens for spending");
            }
            
        } catch (tokenError) {
            console.error("Token contract error:", tokenError);
            throw new Error("Invalid token contract or address");
        }
    } catch (error) {
        console.error("CheckAndApproveTokens failed:", error);
        // Propagate the error up
        throw error;
    }
}

async function getDAOParameters() {
    try {
        const contract = await getContract();
        const [
            minimumTokensToPropose,
            minimumVotingPeriod,
            quorumPercentage
        ] = await Promise.all([
            contract.minimumTokensToPropose(),
            contract.minimumVotingPeriod(),
            contract.quorumPercentage()
        ]);
        
        return {
            minimumTokensToPropose: ethers.formatEther(minimumTokensToPropose),
            minimumVotingPeriod: Number(minimumVotingPeriod),
            quorumPercentage: Number(quorumPercentage)
        };
    } catch (error) {
        console.error("Failed to get DAO parameters:", error);
        throw new Error("Could not retrieve DAO configuration parameters");
    }
}



export { createProposal, voteOnProposal, executeProposal, getProposal, updateParameters,delegateTokens, checkAndApproveTokens,getDAOParameters };