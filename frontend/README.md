# Frontend

The ProofBounty dApp: React, Vite and TypeScript, with viem and wagmi for wallet and network access.

## Requirements

- Node.js 22.10 or newer
- A browser wallet such as MetaMask

## Setup

Install the dependencies of the contracts and of the dApp, from the repository root:

```shell
npm install
npm install --prefix frontend
```

Start the local Hardhat network (chain id 31337, `http://127.0.0.1:8545`) and keep it running:

```shell
npx hardhat node
```

Start the dApp in a second terminal and open http://localhost:3000:

```shell
npm run dev --prefix frontend
```

The header shows the current block when the node is reachable.

## Wallet

1. Import one of the test accounts printed by `npx hardhat node` into the wallet, preferably in a
   separate browser profile. Their private keys are public: use them on the local network only.
2. Click **Connect wallet**. The wallet asks for the account. If it is on another network, a
   second request adds and switches to Hardhat.

To add the network by hand:

| Field | Value |
| --- | --- |
| Name | Hardhat |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | 31337 |
| Currency | ETH |

## Commands

Run in `frontend/`:

```
npm run dev          # development server on port 3000
npm run typecheck    # type check only
npm run build        # type check and production build in dist/
npm run preview      # serve the production build
```

## Layout

```
src/wagmi.ts         chain and wallet configuration
src/bounty.ts        types mirroring IBountyEscrow
src/bountyForm.ts    form values to createBounty parameters
src/hashes.ts        hashing of the bounty texts
src/data/            useBounties hook and mock data
src/components/      wallet, network status, bounty list, create form
```

## Mock data

Until `BountyEscrow` is implemented (issue #1), bounties come from `src/data/mockBounties.ts`.
Created bounties are kept in memory, no transaction is sent, and a page reload resets the list.
To switch to the contract, change `src/data/useBounties.ts`. The contract returns no title and scope
text; where these are stored is open (see [../docs/open-questions.md](../docs/open-questions.md)).
