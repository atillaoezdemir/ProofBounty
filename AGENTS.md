# ProofBounty

ProofBounty is a decentralized bug bounty platform, built by a 4-person student team in the
university course "Blockchain und Smart Contracts". Companies post bounties for their systems
on-chain and lock the reward in escrow; whitehats commit a report hash, deliver the encrypted
report off-chain, and are paid by rule: timeouts, bonds, and the platform's own juror-based
arbitration system replace a central authority. Targets are whatever systems a company puts in
scope (websites, APIs, applications, smart contracts, ...). In a dispute, the whitehat's PoC is run
in a reproduction environment that the company must provide for the version committed in the
bounty.

**Core framing:** We do not eliminate the intermediary entirely; we replace one party's arbitrary
decision with a mechanism whose rules are visible to everyone.

**Status:** docs and tooling only. The platform contracts are not written yet.
`contracts/Counter.sol` and its tests are a toolchain placeholder — delete them with the first real
contract.

## Where to find what

| What | Where |
| --- | --- |
| Vision, scope, roles, mechanisms, lifecycle, arbitration | `docs/architecture.md` |
| Every decision with date and rationale | `docs/decisions.md` |
| Unresolved items | `docs/open-questions.md` |
| Tasks and who works on what | GitLab issues / boards (not in this repo) |

## Working rules

- Before changing architecture or contract logic, read `docs/architecture.md` and
  `docs/decisions.md`.
- Treat the decisions in `docs/decisions.md` as final. In metadata protection, only hidden severity
  is decided; the other ideas are open. If someone proposes changing a decision, point out the
  existing decision and its rationale, and change it only after the team agrees.
- When a decision is made or changed, update `docs/decisions.md` (with date and rationale) and, if
  affected, `docs/architecture.md` and `docs/open-questions.md` in the same change. Doc updates go
  through GitLab like code (commit / merge request).
- Ask before major or hard-to-reverse choices; for small choices, decide and note it.
- Keep all documentation and code in English.
- Do not add `CLAUDE.md`, `GEMINI.md`, or other tool-specific instruction files. This file is the
  single entry point. Only if a tool version does not pick up `AGENTS.md`: add a `CLAUDE.md`
  containing just the line `@AGENTS.md`.

## Naming

Use these role names consistently in docs and code (functions, events, variables):

- **Company** — the organization that posts a bounty and evaluates reports.
- **Whitehat** — the security researcher who submits a report.
- **Juror** — a staked member of the arbitration system; several jurors form a panel.
- **Platform contracts** — ProofBounty's own contracts.

## Tech stack

- Hardhat 3, TypeScript config, ES modules, Node.js 22.10 or newer
- Solidity 0.8.34
- Solidity tests: Foundry-style with `forge-std` (`*.t.sol`)
- TypeScript tests: `node:test` + viem
- Local Hardhat network for development; public testnet for the demo (not chosen yet)

## Commands

```
npm install              # install dependencies
npm run compile          # compile contracts (hardhat build)
npm test                 # run all tests
npm run test:solidity    # Solidity tests only
npm run test:ts          # TypeScript tests only
```

## Layout

```
contracts/          Solidity sources
test/               Solidity tests (*.t.sol) and TypeScript tests (*.ts)
scripts/            deployment scripts
frontend/           dApp (later phase)
docs/               architecture, decisions, open questions
hardhat.config.ts
.agents/skills/     Hardhat 3 and viem-toolbox guidance shipped by the Hardhat template
```

When writing tests, editing `hardhat.config.ts`, or talking to the network from TypeScript, read
`.agents/skills/hardhat/SKILL.md` and `.agents/skills/hardhat-toolbox-viem/SKILL.md` first —
Hardhat 3 differs a lot from Hardhat 2. Further reference: https://hardhat.org/llms.txt and
https://viem.sh/llms.txt.
