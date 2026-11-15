# ProofBounty

A decentralized bug bounty platform for smart contracts. Protocol teams post bounties on-chain and
lock the reward in escrow; whitehats are paid by transparent rules instead of one party's decision.

> We do not eliminate the intermediary entirely; we replace one party's arbitrary decision with a
> mechanism whose rules are visible to everyone.

Student project for the course "Blockchain und Smart Contracts".

**Status:** documentation and tooling are set up. The platform contracts are not written yet; the
`Counter` contract is only a placeholder to check that the toolchain works.

## Documentation

- [docs/architecture.md](docs/architecture.md) — vision, scope, roles, mechanisms, lifecycle,
  arbitration
- [docs/decisions.md](docs/decisions.md) — decision log with dates and rationale
- [docs/open-questions.md](docs/open-questions.md) — unresolved items
- [AGENTS.md](AGENTS.md) — entry point and working rules for AI coding tools

Tasks are tracked in GitLab issues and boards.

## Requirements

- Node.js 22.10 or newer
- npm

## Install

```shell
npm install
```

## Build

```shell
npm run compile
```

## Test

```shell
npm test                 # all tests
npm run test:solidity    # Solidity (Foundry-style) tests only
npm run test:ts          # TypeScript tests only
```

## Repository layout

```
contracts/    Solidity sources
test/         Solidity (*.t.sol) and TypeScript (*.ts) tests
scripts/      deployment scripts
frontend/     dApp (later phase)
docs/         project documentation
```

## Contributing

- Read the docs above before changing architecture or contract logic.
- When a decision is made or changed, update `docs/decisions.md` in the same merge request.
- Documentation, code, and comments are in English.
