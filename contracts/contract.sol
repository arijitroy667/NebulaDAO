// // SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SimpleDAO is Ownable, ReentrancyGuard {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesAbstain;
        uint256 startTime;
        uint256 endTime;
        uint256 startBlock;
        bool executed;
        bytes callData;
        address targetContract;
    }

    ERC20Votes public governanceToken;

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public minimumTokensToPropose;
    uint256 public minimumVotingPeriod;
    uint256 public quorumPercentage;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string description
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint8 voteType,
        uint256 weight
    );
    event ProposalExecuted(uint256 indexed proposalId);

    uint8 constant VOTE_FOR = 1;
    uint8 constant VOTE_AGAINST = 2;
    uint8 constant VOTE_ABSTAIN = 3;

    constructor(
        address _governanceToken,
        uint256 _minimumTokensToPropose,
        uint256 _minimumVotingPeriod,
        uint256 _quorumPercentage
    ) Ownable(msg.sender) {
        require(_quorumPercentage <= 100, "Invalid quorum");

        governanceToken = ERC20Votes(_governanceToken);
        minimumTokensToPropose = _minimumTokensToPropose;
        minimumVotingPeriod = _minimumVotingPeriod;
        quorumPercentage = _quorumPercentage;
    }

    function createProposal(
        string memory _description,
        uint256 _votingPeriod,
        address _targetContract,
        bytes memory _callData
    ) external returns (uint256) {
        require(
            governanceToken.getPastVotes(msg.sender, block.number - 1) >=
                minimumTokensToPropose,
            "Not enough delegated votes to propose"
        );
        require(
            _votingPeriod >= minimumVotingPeriod,
            "Voting period too short"
        );

        uint256 proposalId = ++proposalCount;
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            votesAbstain: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + _votingPeriod,
            startBlock: block.number,
            executed: false,
            callData: _callData,
            targetContract: _targetContract
        });

        emit ProposalCreated(proposalId, msg.sender, _description);
        return proposalId;
    }

    function vote(uint256 _proposalId, uint8 _voteType) external {
        Proposal storage proposal = proposals[_proposalId];

        require(proposal.id != 0, "Invalid proposal");
        require(block.timestamp < proposal.endTime, "Voting ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        require(
            _voteType >= VOTE_FOR && _voteType <= VOTE_ABSTAIN,
            "Invalid vote"
        );

        uint256 votingPower = governanceToken.getPastVotes(
            msg.sender,
            proposal.startBlock
        );
        require(
            votingPower > 0,
            "No voting power (delegate to yourself first)"
        );

        if (_voteType == VOTE_FOR) {
            proposal.votesFor += votingPower;
        } else if (_voteType == VOTE_AGAINST) {
            proposal.votesAgainst += votingPower;
        } else {
            proposal.votesAbstain += votingPower;
        }

        hasVoted[_proposalId][msg.sender] = true;

        emit VoteCast(_proposalId, msg.sender, _voteType, votingPower);
    }

    function executeProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];

        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");

        uint256 totalVotes = proposal.votesFor +
            proposal.votesAgainst +
            proposal.votesAbstain;
        uint256 totalSupply = governanceToken.getPastTotalSupply(
            proposal.startBlock
        );
        uint256 quorumThreshold = (totalSupply * quorumPercentage) / 100;

        require(totalVotes >= quorumThreshold, "Quorum not reached");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal failed");

        proposal.executed = true;

        (bool success, ) = proposal.targetContract.call(proposal.callData);
        require(success, "Execution failed");

        emit ProposalExecuted(_proposalId);
    }

    function updateParameters(
        uint256 _minimumTokensToPropose,
        uint256 _minimumVotingPeriod,
        uint256 _quorumPercentage
    ) external onlyOwner {
        require(_quorumPercentage <= 100, "Invalid quorum");
        minimumTokensToPropose = _minimumTokensToPropose;
        minimumVotingPeriod = _minimumVotingPeriod;
        quorumPercentage = _quorumPercentage;
    }

    function getProposal(
        uint256 _proposalId
    )
        external
        view
        returns (
            address proposer,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 votesAbstain,
            uint256 startTime,
            uint256 endTime,
            bool executed
        )
    {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id != 0, "Proposal does not exist");

        return (
            proposal.proposer,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.votesAbstain,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }

    function MinimumTokensToPropose() external view returns (uint256) {
        return (minimumTokensToPropose);
    }

    
}
