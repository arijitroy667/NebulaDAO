import { ethers } from "ethers";

const TOKEN_ADDRESS = "0xA7E27d9BbcD7ff69F7d5e409BbB70bFdD734D9E5"
const DAO_ADDRESS = "0x6b28EFbaF76cDd7F941Ae16F8FC345396bdeea42"

const TOKEN_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)"
];

const DAO_ABI = [
    "function createProposal(string memory _description,uint256 _votingPeriod,address _targetContract,bytes memory _callData) external returns(uint256)",
    "function vote(uint256 _proposalId, uint8 _voteType) external",
    "function minimumTokensToPropose() external view returns (uint256)",
    "function executeProposal(uint256 _proposalId) external nonReentrant",
    "function getProposal(uint256 _proposalId) external view returns (address proposer,string memory description,uint256 votesFor,uint256 votesAgainst,uint256 votesAbstain,uint256 startTime,uint256 endTime,bool executed)",
    "function updateParameters(uint256 _minimumTokensToPropose,uint256 _minimumVotingPeriod,uint256 _quorumPercentage) external onlyOwner"
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

// async function createProposal(description, votingPeriod, targetContract, callData) {
//     const contract = await getContract(DAO_ADDRESS);
//     const tx = await contract.createProposal(description, votingPeriod, targetContract, callData);
//     const receipt = await tx.wait();

async function createProposal(description, votingPeriod, targetContract, callData) {
    await checkAndApproveTokens();

    const contract = await getContract(); // Remove DAO_ADDRESS parameter
    const tx = await contract.createProposal(description, votingPeriod, targetContract, callData);
    const receipt = await tx.wait();

    // Find the ProposalCreated event in the logs
    const proposalCreatedEvent = receipt.logs
        .map(log => {
            try {
                return contract.interface.parseLog(log);
            } catch (e) {
                return null;
            }
        })
        .find(event => event && event.name === "ProposalCreated");

    // Extract the proposal ID from the event
    const proposalId = proposalCreatedEvent ? proposalCreatedEvent.args[0] : null;

    console.log("Proposal created:", proposalId);
    return proposalId;
}

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

async function checkAndApproveTokens() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
    const daoContract = new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer);

    const minTokens = await daoContract.minimumTokensToPropose();
    const balance = await tokenContract.balanceOf(address);

    if (balance < minTokens) {
        throw new Error(`Insufficient tokens. You have ${balance} but need ${minTokens}`);
    }

    // Approve tokens
    const tx = await tokenContract.approve(DAO_ADDRESS, minTokens);
    await tx.wait();
    return true;
}
export { createProposal, vote, executeProposal, getProposal, updateParameters };