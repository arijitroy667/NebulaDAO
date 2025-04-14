import { ethers } from "ethers";

const TOKEN_ADDRESS = "0xA7E27d9BbcD7ff69F7d5e409BbB70bFdD734D9E5";
const DAO_ADDRESS = "0x35C487FFe175b99F736afA0b230BaE244b780fE9";

const TOKEN_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)"
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

async function createProposal(description, votingPeriod, targetContract, callData) {
    try {
        await checkAndApproveTokens();
        
        const contract = await getContract();
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
        throw error;
    }
}

async function voteOnProposal(proposalId, voteType) {
    const contract = await getContract(); // Fixed: removed parameter
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
        // First, resolve the proposalId if it's a Promise
        const resolvedId = proposalId && typeof proposalId === 'object' && 'then' in proposalId
            ? await proposalId
            : proposalId;
            
        // Make sure we have a valid value
        if (resolvedId === null || resolvedId === undefined) {
            throw new Error("Invalid proposal ID: null or undefined");
        }
        
        // Convert to string to ensure it can be properly handled
        const stringId = resolvedId.toString();
        
        // Now get the contract and call with the resolved ID
        const contract = await getContract();
        const proposal = await contract.getProposal(stringId);
        console.log("Proposal details:", proposal);
        return proposal;
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

export { createProposal, voteOnProposal, executeProposal, getProposal, updateParameters };