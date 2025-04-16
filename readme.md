# Nebula DAO

**Nebula DAO** is a decentralized governance platform empowering communities to propose, vote, and execute collective decisions transparently. Built with a modern, responsive UI and robust smart contracts, Nebula DAO is designed to make decentralized governance intuitive and effective.

Live at : nebula-dao-three.vercel.app

## Features

- **Create Proposals:** Any token holder can propose changes or actions.
- **Vote on Proposals:** Use delegated ERC20 voting power to cast your vote.
- **Execute or Reject Proposals:** Automatically execute successful proposals or reject failed ones.
- **Delegation Support:** Leverages ERC20Votes for vote delegation.
- **Custom Governance Token:** Uses the native `$GOV` token for all governance interactions.
- **Quorum & Voting Period:**
  - Minimum **2% quorum** required for proposal execution.
  - Maximum **30 days voting period** for each proposal.

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [TypeScript](https://www.typescriptlang.org/)
- **Smart Contracts:** [Solidity](https://soliditylang.org/), [ERC20Votes](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes)
- **Blockchain Interaction:** [Ethers.js](https://docs.ethers.org/)

## Smart Contract Highlights

- Uses **ERC20Votes** standard for on-chain voting.
- Requires delegation of `$GOV` tokens to participate in voting.
- Secure execution via delegated calls only after meeting quorum and deadline.
- Adminless and transparent — no central authority.

## Getting Started

### Prerequisites

- Node.js >= 16.x
- Yarn or npm
- MetaMask or any Web3 wallet

### Clone the Repository

```bash
git clone https://github.com/yourusername/nebula-dao.git
cd nebula-dao