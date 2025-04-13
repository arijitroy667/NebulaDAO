import {ethers} from "ethers";

const TOKEN_ADDRESS=0xA7E27d9BbcD7ff69F7d5e409BbB70bFdD734D9E5
const DAO_ADDRESS=0x6dd27AE40684a7aA2737409c7241D26576EC9e5F


const DAO_ABI = [
    "function createProposal(string memory _description,uint256 _votingPeriod,address _targetContract,bytes memory _callData) external",
    "function vote(uint256 _proposalId, uint8 _voteType) external",
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
    
    if (!address) {
        throw new Error("Contract address is undefined");
    }
    
    return new ethers.Contract(address, DAO_ABI, signer);
}

async function createProposal(description,votingPeriod,targetContract,callData){
    const contract = await getContract(DAO_ADDRESS);
    const tx = await contract.createProposal(description,votingPeriod,targetContract,callData);
    await tx.wait();
    console.log("Proposal created:", tx);
}

async function vote(proposalId,voteType){
    const contract = await getContract(DAO_ADDRESS);
    const tx = await contract.vote(proposalId,voteType);
    await tx.wait();
    console.log("Vote cast:", tx);
}

async function executeProposal(proposalId){
    const contract = await getContract(DAO_ADDRESS);
    const tx = await contract.executeProposal(proposalId);
    await tx.wait();
    console.log("Proposal executed:", tx);
}

async function getProposal(proposalId){
    const contract = await getContract(DAO_ADDRESS);
    const proposal = await contract.getProposal(proposalId);
    console.log("Proposal details:", proposal);
    return proposal;
}

async function updateParameters(minimumTokensToPropose,minimumVotingPeriod,quorumPercentage){
    const contract = await getContract(DAO_ADDRESS);
    const tx = await contract.updateParameters(minimumTokensToPropose,minimumVotingPeriod,quorumPercentage);
    await tx.wait();
    console.log("Parameters updated:", tx);
}

export {createProposal, vote, executeProposal, getProposal, updateParameters};