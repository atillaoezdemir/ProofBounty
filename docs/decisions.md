# ProofBounty — Decision Log

Every project decision is recorded here with date and rationale. The design itself is described in
[architecture.md](architecture.md).

**Rules**

- Decisions listed here are final until the team agrees to change them.
- To change a decision: do not edit the old entry. Add a new entry that references it, and mark the
  old one `Superseded by D-xx`. Update architecture.md and open-questions.md in the same change.
- New entries get the next free ID and the date the decision was made.

The entries dated 2026-11-15 are the initial set, recorded when the repository was set up. A
rationale of "—" means the team has not written one down yet.

## Scope and tooling

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| D-01 | 2026-11-15 | Targets are any system a company puts in scope (websites, APIs, applications, databases, infrastructure, smart contracts). The blockchain is used for the listing, escrow, commitments, payout rules, and arbitration. | Companies post bounties on the dApp and whitehats work on them; the platform contracts enforce the rules. |
| D-02 | 2026-11-15 | In a dispute, the company must provide a reproduction environment for the committed version of the target (D-11). If it does not, it loses the dispute. | Closed systems cannot be recreated by anyone else, so the burden lies with the party that controls the system. |
| D-03 | 2026-11-15 | Tooling is Hardhat 3 (TypeScript + Foundry-compatible Solidity tests). | One tool for contracts, tests, and frontend; Foundry-style PoCs from whitehats can still run. |
| D-04 | 2026-11-15 | Local Hardhat network for development; a public testnet for the demo. | Exact testnet is still open (see open-questions.md). |
| D-05 | 2026-11-15 | Documentation, code, and comments are in English. | — |

## Roles

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| D-06 | 2026-11-15 | Role names are **Company**, **Whitehat**, **Juror**, and **Platform contracts**, used consistently in docs and code. | Consistent vocabulary across four people and several AI tools. |
| D-07 | 2026-11-15 | ProofBounty's own contracts are always called "the platform contracts". | One fixed name for the contracts in docs and code. |
| D-08 | 2026-11-15 | Spam is prevented by a small submission bond that is lost if the report is invalid. The company does its own report screening. | Makes spam cost money without adding a screening party. |

## Core mechanisms

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| D-09 | 2026-11-15 | Escrow: the company locks the full reward when posting. No withdrawal while submissions are pending, plus a notice period. | Prevents emptying the escrow right after receiving a report. |
| D-10 | 2026-11-15 | Commit-reveal for reports: the whitehat commits `hash(report + salt + whitehatAddress)` on-chain before disclosing anything. | Proves priority and content integrity. The salt prevents guessing; the address prevents front-running. |
| D-11 | 2026-11-15 | Version commitment: the bounty records a version hash for each target in scope (e.g. a source commit hash or a build / container image digest). Disputes are verified against exactly that version. | Later patches do not matter. |
| D-12 | 2026-11-15 | Known-issues commitment: the hash of the company's known-issues list is stored at bounty creation. | A "we already knew this" claim is only valid if backed by an earlier on-chain commitment. |
| D-13 | 2026-11-15 | Report visibility is parallel with "first valid report wins". The company sees all reports immediately. A report is valid only if it contains a runnable PoC. Every rejection is recorded on-chain. If a later report is chosen over an earlier one, the earlier reporter automatically gets a right to dispute. | Accepting a later report on the same issue after rejecting an earlier one becomes provably contradictory. |
| D-14 | 2026-11-15 | Timeouts: if the company does not respond within the decision period, the reward is released to the whitehat automatically. | The company cannot stall after receiving the information. |
| D-15 | 2026-11-15 | Bonds: rejecting requires the company to post a bond and a reason; disputing requires the whitehat to post a bond. The losing side loses its bond. | Makes bad-faith rejections and bad-faith disputes cost money. |
| D-16 | 2026-11-25 | Each bounty has one fixed reward. A whitehat whose hint or partial solution is accepted can receive a part of it. | Keeps rulings and payouts simple while incomplete contributions still pay off. The mechanism is open (see open-questions.md). |
| D-17 | 2026-11-15 | KYC is simulated: each bounty can require it; a mock verifier contract issues on-chain attestations; the bounty contract only checks that an attestation exists. No real KYC provider. Privacy-preserving KYC (zero-knowledge credentials) is Future Work. | Demonstrates the integration point without external dependencies. |

## Metadata protection

Nothing is decided in this area yet. Uniform submissions and delayed payout are ideas under
evaluation (see open-questions.md).

## On-chain / off-chain

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| D-19 | 2026-11-15 | On-chain / off-chain split as listed in architecture.md Section 6. The report and PoC are never stored in plaintext on-chain. | Plaintext on a public chain would be a public zero-day disclosure. |
| D-20 | 2026-11-15 | Off-chain messages are encrypted with the recipient's public key and signed with the sender's wallet key. | The channel does not need to be trusted; signatures give non-repudiation. |
| D-21 | 2026-11-15 | Every message includes the hash of the previous message (hash chain). | Proves order and that nothing was removed. |
| D-22 | 2026-11-15 | The latest conversation hash is anchored on-chain as an extra field in state-transition transactions that happen anyway (reveal, reject, dispute). | Almost no extra cost. |

## Lifecycle and arbitration

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| D-23 | 2026-11-15 | Submission lifecycle: post + lock → commit (+ bond, KYC if required) → off-chain delivery + reveal → decision period (accept / reject / silence = auto-payout) → appeal period → arbitration → ruling executed, loser forfeits bond. | Information cannot be taken back, but money can be held: escrow + timeouts + bonds solve the fair exchange problem. |
| D-24 | 2026-11-15 | The arbitration system is built and tested as part of this project — not a mock, not an external service. Initial design inspired by Kleros and the UMA Optimistic Oracle. | It is the oracle for "is this vulnerability valid?" and the core of replacing the central authority. |
| D-25 | 2026-11-15 | Jurors register and stake tokens. A small odd-numbered panel is drawn per dispute, weighted by stake. | Odd size avoids ties; stake gives jurors something to lose. |
| D-26 | 2026-11-15 | Evidence: the whitehat reveals report and PoC to the selected jurors (encrypted to their keys). Both parties can submit evidence and their signed message chain. | The on-chain hash proves it is the same report the company received. |
| D-27 | 2026-11-15 | Jurors verify by running the PoC in the reproduction environment provided by the company (D-02). | The PoC is checked against exactly the committed version. |
| D-28 | 2026-11-15 | Juror voting uses commit-reveal. | Jurors cannot copy each other. |
| D-29 | 2026-11-15 | Incentives (Schelling point): majority voters are rewarded from the losing party's bond and the arbitration fee; minority voters and non-revealing jurors lose part of their stake. | Honest voting is the most profitable strategy. |
| D-30 | 2026-11-15 | To limit exposure of vulnerability details, disputes may be heard after the fix window. | Fewer people see an unpatched vulnerability. |
| D-31 | 2026-11-15 | Arbitration contracts are covered with unit, fuzz, and scenario tests (honest majority, colluding minority, non-revealing jurors, company never responding, etc.). | — |

## Contract interfaces

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| D-32 | 2026-11-24 | The contracts call each other through the interfaces in `contracts/interfaces/`. Interface changes are agreed with the owners of the calling contracts. | The four work areas can progress in parallel. |
| D-33 | 2026-11-25 | A ruling is a yes/no answer: the report is valid or invalid. | One clear question for the jurors. |
| D-34 | 2026-11-24 | In a dispute, both bonds move to the arbitration contract, which returns the winner's bond and pays the jurors. | One place distributes bonds and juror rewards (D-29). |
| D-35 | 2026-11-24 | Rewards, bonds, and juror stakes are paid in testnet ETH. | One asset, no token contract needed. |
| D-36 | 2026-11-24 | The report commitment is `keccak256(abi.encode(reportHash, salt, whitehat))` as in `contracts/shared/Commitments.sol`. | Contracts and dApp compute identical hashes. |
| D-37 | 2026-11-24 | Public encryption keys are published in an on-chain key registry. | A wallet address alone is not enough to encrypt to its owner. |

## Repository setup choices

Small, easily reversible choices made during repository setup. Not team decisions; change them
freely if the team prefers otherwise.

| ID | Date | Choice | Rationale |
| --- | --- | --- | --- |
| S-01 | 2026-11-15 | Hardhat template: `node:test` + viem (not Mocha + ethers). | Hardhat 3's default; viem is also the usual base for a modern dApp frontend. |
| S-02 | 2026-11-15 | Solidity 0.8.34, as set by the template. | Current compiler at setup time. |
| S-03 | 2026-11-24 | Contracts start as skeletons whose functions revert with `NotImplemented`; the owner of each contract fills them in. | Everything compiles from day one. |
| S-04 | 2026-11-15 | The template's Hardhat Ignition sample module was removed; `scripts/` is empty. Whether deployment uses Ignition modules or plain scripts is decided when deployment is first needed. | The agreed layout has `/scripts` for deployment. |
| S-05 | 2026-11-15 | The `sepolia` network entry in `hardhat.config.ts` is a template placeholder, not a testnet decision. | The demo testnet is an open question. |
| S-06 | 2026-11-25 | The dApp in `frontend/` uses React, Vite and TypeScript, with viem and wagmi for wallet and network access. It has its own `package.json`. | A static client-side app needs no server; viem is already used by the tests (S-01) and wagmi adds its React hooks. |
