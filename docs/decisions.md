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
| D-01 | 2026-11-15 | Targets are smart contracts only. Vulnerabilities are verified by forking the chain at a committed block and running the whitehat's PoC against it. | Verification is objective: the exploit either works on the committed state or it does not. |
| D-02 | 2026-11-15 | Closed Web2 systems (websites, APIs, databases) are out of scope and documented as Future Work, with the designed approach: version hash, mandatory reproduction environment, "if you don't provide the environment, you lose the dispute". | They cannot be verified objectively by forking; keeps the project feasible. |
| D-03 | 2026-11-15 | Tooling is Hardhat 3 (TypeScript + Foundry-compatible Solidity tests). | One tool for contracts, tests, and frontend; Foundry-style PoCs from whitehats can still run. |
| D-04 | 2026-11-15 | Local Hardhat network for development; a public testnet for the demo. | Exact testnet is still open (see open-questions.md). |
| D-05 | 2026-11-15 | Documentation, code, and comments are in English. | — |

## Roles

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| D-06 | 2026-11-15 | Role names are **Protocol**, **Whitehat**, **Juror**, and **Platform contracts**, used consistently in docs and code. | Consistent vocabulary across four people and several AI tools. |
| D-07 | 2026-11-15 | ProofBounty's own contracts are always called "the platform contracts", never "the protocol". | Avoids confusion with the Protocol role. |
| D-08 | 2026-11-15 | Spam is prevented by a small submission bond that is lost if the report is invalid. The protocol does its own report screening. | Makes spam cost money without adding a screening party. |

## Core mechanisms

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| D-09 | 2026-11-15 | Escrow: the protocol locks the full reward when posting. No withdrawal while submissions are pending, plus a notice period. | Prevents emptying the escrow right after receiving a report. |
| D-10 | 2026-11-15 | Commit-reveal for reports: the whitehat commits `hash(report + salt + whitehatAddress)` on-chain before disclosing anything. | Proves priority and content integrity. The salt prevents guessing; the address prevents front-running. |
| D-11 | 2026-11-15 | Version commitment: the bounty records target contract address(es) and a fork block number (or bytecode hash). Disputes are verified against exactly that state. | Later patches do not matter. |
| D-12 | 2026-11-15 | Known-issues commitment: the hash of the protocol's known-issues list is stored at bounty creation. | A "we already knew this" claim is only valid if backed by an earlier on-chain commitment. |
| D-13 | 2026-11-15 | Report visibility is parallel with "first valid report wins". The protocol sees all reports immediately. A report is valid only if it contains a runnable PoC. Every rejection is recorded on-chain. If a later report is chosen over an earlier one, the earlier reporter automatically gets a right to dispute. | Accepting a later report on the same issue after rejecting an earlier one becomes provably contradictory. |
| D-14 | 2026-11-15 | Timeouts: if the protocol does not respond within the decision period, the reward is released to the whitehat automatically. | The protocol cannot stall after receiving the information. |
| D-15 | 2026-11-15 | Bonds: rejecting requires the protocol to post a bond and a reason; disputing requires the whitehat to post a bond. The losing side loses its bond. | Makes bad-faith rejections and bad-faith disputes cost money. |
| D-16 | 2026-11-15 | Severity disputes ("accepted, but only medium") go through the same dispute path as rejections. | One dispute mechanism instead of two. |
| D-17 | 2026-11-15 | KYC is simulated: each bounty can require it; a mock verifier contract issues on-chain attestations; the bounty contract only checks that an attestation exists. No real KYC provider. Privacy-preserving KYC (zero-knowledge credentials) is Future Work. | Demonstrates the integration point without external dependencies. |

## Metadata protection

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| D-18 | 2026-11-15 | Hidden severity on acceptance: the protocol commits the severity / reward tier only as a hash; it is not visible on-chain at acceptance time. | "A critical report was just accepted for protocol X" tells attackers that a real, unpatched bug exists. |

Only D-18 is decided in this area. Uniform submissions and delayed payout are ideas under
evaluation, not decisions (see open-questions.md).

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
| D-26 | 2026-11-15 | Evidence: the whitehat reveals report and PoC to the selected jurors (encrypted to their keys). Both parties can submit evidence and their signed message chain. | The on-chain hash proves it is the same report the protocol received. |
| D-27 | 2026-11-15 | Jurors verify by running the PoC against a fork at the committed block. | Targets are smart contracts, so the result is objective. |
| D-28 | 2026-11-15 | Juror voting uses commit-reveal. | Jurors cannot copy each other. |
| D-29 | 2026-11-15 | Incentives (Schelling point): majority voters are rewarded from the losing party's bond and the arbitration fee; minority voters and non-revealing jurors lose part of their stake. | Honest voting is the most profitable strategy. |
| D-30 | 2026-11-15 | To limit exposure of vulnerability details, disputes may be heard after the fix window. | Fewer people see an unpatched vulnerability. |
| D-31 | 2026-11-15 | Arbitration contracts are covered with unit, fuzz, and scenario tests (honest majority, colluding minority, non-revealing jurors, protocol never responding, etc.). | — |

## Repository setup choices

Small, easily reversible choices made during repository setup. Not team decisions; change them
freely if the team prefers otherwise.

| ID | Date | Choice | Rationale |
| --- | --- | --- | --- |
| S-01 | 2026-11-15 | Hardhat template: `node:test` + viem (not Mocha + ethers). | Hardhat 3's default; viem is also the usual base for a modern dApp frontend. |
| S-02 | 2026-11-15 | Solidity 0.8.34, as set by the template. | Current compiler at setup time. |
| S-03 | 2026-11-15 | `contracts/Counter.sol` and its two tests are kept as a toolchain smoke test and are to be deleted with the first real contract. | Gives a working `npm test` from day one. |
| S-04 | 2026-11-15 | The template's Hardhat Ignition sample module was removed; `scripts/` is empty. Whether deployment uses Ignition modules or plain scripts is decided when deployment is first needed. | The agreed layout has `/scripts` for deployment. |
| S-05 | 2026-11-15 | The `sepolia` network entry in `hardhat.config.ts` is a template placeholder, not a testnet decision. | The demo testnet is an open question. |
