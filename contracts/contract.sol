// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
        bool executed;
        bytes callData;
        address targetContract;
    }

    // Token used for governance
    IERC20 public governanceToken;

    // Proposal tracking
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    // Vote tracking
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // Proposal thresholds
    uint256 public minimumTokensToPropose;
    uint256 public minimumVotingPeriod;
    uint256 public quorumPercentage; // Percentage of total token supply needed for quorum (1-100)

    // Events
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

    // Vote types
    uint8 constant VOTE_FOR = 1;
    uint8 constant VOTE_AGAINST = 2;
    uint8 constant VOTE_ABSTAIN = 3;

    constructor(
        address _governanceToken,
        uint256 _minimumTokensToPropose,
        uint256 _minimumVotingPeriod,
        uint256 _quorumPercentage
    ) Ownable(msg.sender) {
        require(_governanceToken != address(0), "Invalid token address");
        require(_quorumPercentage <= 100, "Quorum percentage must be <= 100");

        governanceToken = IERC20(_governanceToken);
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
        // Check if proposer has enough tokens
        require(
            governanceToken.balanceOf(msg.sender) >= minimumTokensToPropose,
            "Not enough tokens to propose"
        );
        require(
            _votingPeriod >= minimumVotingPeriod,
            "Voting period too short"
        );

        // Create proposal
        uint256 proposalId = proposalCount + 1;

        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            votesAbstain: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + _votingPeriod,
            executed: false,
            callData: _callData,
            targetContract: _targetContract
        });

        proposalCount = proposalId;
        emit ProposalCreated(proposalId, msg.sender, _description);
        return proposalId;
    }

    function vote(uint256 _proposalId, uint8 _voteType) external {
        Proposal storage proposal = proposals[_proposalId];

        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp < proposal.endTime, "Voting period ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        require(
            _voteType >= VOTE_FOR && _voteType <= VOTE_ABSTAIN,
            "Invalid vote type"
        );

        // Calculate voting power based on token balance
        uint256 votingPower = governanceToken.balanceOf(msg.sender);
        require(votingPower > 0, "No voting power");

        // Record the vote
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
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");

        // Check if proposal passed (more votes for than against AND meets quorum)
        uint256 totalVotes = proposal.votesFor +
            proposal.votesAgainst +
            proposal.votesAbstain;
        uint256 totalSupply = governanceToken.totalSupply();

        // Calculate quorum threshold (percentage of total supply)
        uint256 quorumThreshold = (totalSupply * quorumPercentage) / 100;

        require(totalVotes >= quorumThreshold, "Quorum not reached");
        require(
            proposal.votesFor > proposal.votesAgainst,
            "Proposal did not pass"
        );

        proposal.executed = true;

        // Execute the proposal's action
        (bool success, ) = proposal.targetContract.call(proposal.callData);
        require(success, "Proposal execution failed");

        emit ProposalExecuted(_proposalId);
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

    function updateParameters(
        uint256 _minimumTokensToPropose,
        uint256 _minimumVotingPeriod,
        uint256 _quorumPercentage
    ) external onlyOwner {
        require(_quorumPercentage <= 100, "Quorum percentage must be <= 100");

        minimumTokensToPropose = _minimumTokensToPropose;
        minimumVotingPeriod = _minimumVotingPeriod;
        quorumPercentage = _quorumPercentage;
    }
}
