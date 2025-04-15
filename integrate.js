import { ethers } from "ethers";

const TOKEN_ADDRESS = "0xA7E27d9BbcD7ff69F7d5e409BbB70bFdD734D9E5";
const DAO_ADDRESS = "0x6dd27AE40684a7aA2737409c7241D26576EC9e5F";


// const DAO_ABI = [
//     "function createProposal(string memory _description,uint256 _votingPeriod,address _targetContract,bytes memory _callData) external",
//     "function vote(uint256 _proposalId, uint8 _voteType) external",
//     "function executeProposal(uint256 _proposalId) external nonReentrant",
//     "function getProposal(uint256 _proposalId) external view returns (address proposer,string memory description,uint256 votesFor,uint256 votesAgainst,uint256 votesAbstain,uint256 startTime,uint256 endTime,bool executed)",
//     "function updateParameters(uint256 _minimumTokensToPropose,uint256 _minimumVotingPeriod,uint256 _quorumPercentage) external onlyOwner"
// ];

const DAO_ABI = [
    {
        "inputs": [
            { "name": "_description", "type": "string" },
            { "name": "_votingPeriod", "type": "uint256" },
            { "name": "_targetContract", "type": "address" },
            { "name": "_callData", "type": "bytes" }
        ],
        "name": "createProposal",
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "spender", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "owner", "type": "address" },
            { "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "_proposalId", "type": "uint256" }
        ],
        "name": "executeProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "_proposalId", "type": "uint256" },
            { "name": "_voteType", "type": "uint8" }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "_minimumTokensToPropose", "type": "uint256" },
            { "name": "_minimumVotingPeriod", "type": "uint256" },
            { "name": "_quorumPercentage", "type": "uint256" }
        ],
        "name": "updateParameters",
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

    return new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer);
}

async function checkAndApproveToken() {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

        // Check current allowance
        const currentAllowance = await tokenContract.allowance(await signer.getAddress(), DAO_ADDRESS);

        // If allowance is too low, approve more tokens
        if (currentAllowance === BigInt(0)) {
            const tx = await tokenContract.approve(
                DAO_ADDRESS,
                ethers.MaxUint256 // Approve maximum amount
            );
            await tx.wait();
            console.log("Token approval granted");
        }
    } catch (error) {
        console.error("Failed to approve tokens:", error);
        throw new Error("Please approve token spending first");
    }
}

async function createProposal(description, votingPeriod, targetContract, callData) {
    try {
        // Check and approve tokens first
        await checkAndApproveToken();

        const contract = await getContract();

        // Input validation
        if (!description || description.trim().length === 0) {
            throw new Error("Description cannot be empty");
        }

        if (votingPeriod < 1) {
            throw new Error("Voting period must be at least 1 day");
        }

        // Format inputs
        const formattedDescription = description.trim();
        const votingPeriodInSeconds = BigInt(Math.floor(votingPeriod * 86400));
        const formattedTarget = targetContract || ethers.ZeroAddress;
        const formattedCallData = callData || "0x";

        // Send transaction with fixed gas limit first
        const tx = await contract.createProposal(
            formattedDescription,
            votingPeriodInSeconds,
            formattedTarget,
            formattedCallData,
            {
                gasLimit: 500000 // Fixed gas limit to avoid estimation issues
            }
        );

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Proposal created:", receipt);

        // Find the ProposalCreated event
        const event = receipt.logs.find(
            log => log.topics[0] === contract.interface.getEvent("ProposalCreated").topicHash
        );

        if (event) {
            const parsedLog = contract.interface.parseLog(event);
            return parsedLog.args.proposalId;
        }

        return null;
    } catch (error) {
        console.error("Failed to create proposal:", error);

        // Handle specific error cases
        if (error.message.includes("insufficient allowance")) {
            throw new Error("Please approve token spending first");
        }
        if (error.message.includes("insufficient balance")) {
            throw new Error("You don't have enough tokens to create a proposal");
        }
        if (error.reason) {
            throw new Error(error.reason);
        }
        throw new Error("Failed to create proposal. Check your token balance and approval.");
    }
}


// async function createProposal(description, votingPeriod, targetContract, callData) {
//     const contract = await getContract(DAO_ADDRESS);
//     const tx = await contract.createProposal(description, votingPeriod, targetContract, callData);
//     await tx.wait();
//     console.log("Proposal created:", tx);
// }

async function vote(proposalId, voteType) {
    const contract = await getContract(DAO_ADDRESS);
    const tx = await contract.vote(proposalId, voteType);
    await tx.wait();
    console.log("Vote cast:", tx);
}

async function executeProposal(proposalId) {
    const contract = await getContract(DAO_ADDRESS);
    const tx = await contract.executeProposal(proposalId);
    await tx.wait();
    console.log("Proposal executed:", tx);
}

async function getProposal(proposalId) {
    const contract = await getContract(DAO_ADDRESS);
    const proposal = await contract.getProposal(proposalId);
    console.log("Proposal details:", proposal);
    return proposal;
}

async function updateParameters(minimumTokensToPropose, minimumVotingPeriod, quorumPercentage) {
    const contract = await getContract(DAO_ADDRESS);
    const tx = await contract.updateParameters(minimumTokensToPropose, minimumVotingPeriod, quorumPercentage);
    await tx.wait();
    console.log("Parameters updated:", tx);
}

export { createProposal, vote, executeProposal, getProposal, updateParameters };