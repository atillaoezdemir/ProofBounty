# ProofBounty — Architecture

This document describes what ProofBounty is, what it covers, and how its mechanisms work.
Decisions and their rationale are logged in [decisions.md](decisions.md); unresolved items are in
[open-questions.md](open-questions.md). Where this document says "open", the linked entry in
open-questions.md is the place to look.

Terms are explained briefly where they first appear.

## 1. Vision

Companies need security vulnerabilities in their systems found and fixed quickly. Hackathons,
bootcamps, and centralized bug bounty platforms are costly and require trusting an intermediary.
Ethical hackers, on the other side, have no guarantee that they will be paid once they have
disclosed a vulnerability.

ProofBounty connects companies directly with ethical hackers. Bounties with predefined rewards
are posted on-chain. The blockchain protects the hacker's rights and replaces a single central
authority with transparent, rule-based mechanisms. It also creates a freelance market for security
researchers.

**Core framing** (use this in docs and presentations):

> We do not eliminate the intermediary entirely; we replace one party's arbitrary decision with a
> mechanism whose rules are visible to everyone.

## 2. Scope

- **Targets: any system a company puts in scope** — websites, APIs, applications, databases,
  infrastructure, smart contracts.
- **What the blockchain is used for:** the bounty listing, the escrow, the report commitments, the
  payout rules, and the arbitration. The systems being tested are normally off-chain.
- **Verification:** a report must contain a *PoC* (proof of concept — runnable exploit code or
  exact reproducible steps that demonstrate the vulnerability). In a dispute, the PoC is run in a
  *reproduction environment* — a running copy of the target at the version committed in the
  bounty — which the company must provide (Sections 4.3 and 8).
- **Tooling:** Hardhat 3 with TypeScript and Foundry-compatible Solidity tests.
- **Network:** local Hardhat network for development; a public testnet for the demo (which one is
  open).
- **Language:** English for documentation, code, and comments.

## 3. Roles

These names are final. Use them consistently in docs and code (function, event, and variable
names).

| Role | Description |
| --- | --- |
| **Company** | The organization that posts a bounty, defines scope and reward tiers, locks the reward in escrow, and evaluates reports. The company does its own report screening. |
| **Whitehat** | The ethical hacker / security researcher who finds a vulnerability, commits the report hash on-chain, delivers the encrypted report, and receives the reward. |
| **Juror** | A registered, staked member of the platform's own arbitration system. Only involved in disputes. Several jurors form a *panel* for each dispute. |
| **Platform contracts** | ProofBounty's own contracts: the neutral vault and rule engine that enforce everything. |

Naming rule: ProofBounty's own contracts are always called **"the platform contracts"**.

## 4. Core mechanisms

### 4.1 Escrow

*Escrow* means funds are held by a neutral party — here, the platform contracts — until predefined
conditions are met. The company locks the **full reward** (the top tier) when posting a bounty. If a
lower tier is paid, the rest returns to the company and the bounty closes. Funds cannot be
withdrawn while submissions are pending, plus a notice period. This prevents a company from
emptying the escrow right after receiving a report.

### 4.2 Commit-reveal for reports

A *hash* is a short, fixed-size fingerprint of data: the same input always gives the same hash, but
the input cannot be recovered from the hash, and any change to the input changes the hash.
*Commit-reveal* is a two-step scheme built on this: first publish only the hash of a value (commit),
later disclose the value itself (reveal); anyone can check that the revealed value matches the
earlier commitment.

Before disclosing anything, the whitehat writes on-chain:

```
hash(report + salt + whitehatAddress)
```

The exact encoding is in `contracts/shared/Commitments.sol`.

- This proves **priority** (who committed first) and **content integrity** (the report cannot be
  changed afterwards).
- The *salt* (a secret random value) prevents others from guessing the report content by trial
  hashing.
- Including the whitehat's address prevents *front-running* (someone seeing the pending transaction
  and submitting the same commitment first under their own address).

### 4.3 Version commitment

The bounty records a *version hash* for each target in scope: a hash that pins the exact version
of the system the bounty refers to (for example a source commit hash or a build / container image
digest). Disputes are verified against exactly that version, so later patches do not matter.

Because the targets are normally closed, off-chain systems, nobody but the company can recreate
that version. The company must therefore provide a reproduction environment for the committed
version when a dispute is opened. **If the company does not provide the environment, it loses the
dispute.** How the environment is delivered and how it is tied to the version hash is open.

### 4.4 Known-issues commitment

The hash of the company's known-issues list is stored at bounty creation. A "we already knew this"
claim is only valid if it is backed by this earlier on-chain commitment.

### 4.5 Report visibility: parallel, first valid report wins

- The company sees all reports immediately (reports are handled in parallel, not queued).
- A report is **valid** only if it contains reproducible steps, i.e. a runnable PoC.
- The **first valid report** receives the reward.
- Every rejection is recorded on-chain. Accepting a later report on the same issue after rejecting
  an earlier one is therefore provably contradictory.
- If a later report is chosen over an earlier one, the earlier reporter automatically gets a right
  to dispute.
- Whether contributors of hints receive a small share is open.

### 4.6 Timeouts

If the company does not respond within the decision period, the top tier is released automatically
to the earliest committed report that has been delivered.

### 4.7 Bonds

A *bond* is a deposit that a party loses if it turns out to be wrong, and gets back otherwise. It
makes bad-faith actions cost money.

- **Submission bond:** a small bond paid by the whitehat with each submission; lost if the report is
  invalid. This is the spam protection.
- **Decision bond:** accepting or rejecting a report requires the company to post a bond; rejecting
  also requires a reason. The bond of an undisputed acceptance is returned.
- **Dispute bond:** disputing a decision requires the whitehat to post a bond.
- In a dispute, both bonds move to the arbitration contract. The losing side loses its bond; the
  winner's bond is returned.

### 4.8 Severity disputes

"Accepted, but only medium severity" goes through the same dispute path as a rejection. The ruling is
one value: 0 = report invalid, otherwise the tier to pay.

### 4.9 Simulated KYC

*KYC* ("know your customer") is identity verification, typically including a sanctions check. Each
bounty can require it. In this project KYC is **simulated**: a mock verifier contract issues
on-chain *attestations* (signed statements such as "verified, not sanctioned") to whitehat
addresses. There is no real KYC provider and no external connection. The bounty contract only
checks whether an attestation exists.

## 5. Metadata protection (partly decided)

Publicly listed bounties are not the problem: listings are public on existing platforms too and do
not imply that a vulnerability exists. The leak is **per-submission information**. "A critical
report was just accepted for company X" tells attackers that a real, unpatched, high-value bug
exists within a known scope, which narrows their search.

This problem is not fully solved yet.

**Decided**

- **Hidden severity on acceptance:** when accepting, the company commits the severity / reward
  tier only as a salted hash. The severity is not visible on-chain at acceptance time.

**Ideas under evaluation (open — not decided)**

- **Uniform submissions:** every submission looks the same on-chain — a commitment hash plus the
  same fixed submission bond. No severity or category is visible at submission time. Since many
  submissions are invalid, a single submission event carries little information.
- **Delayed payout:** the payout (which reveals the amount and therefore the severity) happens after
  the company signals that the fix is deployed, or automatically after a maximum fix window —
  whichever comes first.

Known gaps in these ideas are listed in [open-questions.md](open-questions.md).

## 6. On-chain vs. off-chain

**On-chain**

- Bounty metadata: company address, reward tiers, deadlines
- Scope hash
- Target version hash(es)
- Known-issues hash
- Escrowed funds
- Report commitments with timestamps
- Submission state: submitted / revealed / accepted / rejected / disputed / paid
- Rejection reasons (as hash)
- Payments
- Arbitration data: stakes, vote commitments, rulings
- KYC attestations (simulated)
- Public encryption keys
- Reputation counters

**Off-chain**

- The vulnerability report and the PoC code. These are never stored in plaintext on a public
  chain — that would be a public *zero-day* disclosure (publishing a vulnerability for which no fix
  exists yet).
- Identity data
- Large files
- Messages

### Off-chain messaging

- Reports and messages travel encrypted with the recipient's public key. The channel does not need
  to be trusted, because hashes and signatures guarantee integrity.
- Every message is signed with the sender's wallet key (*non-repudiation*: the sender cannot later
  deny having sent it).
- Every message includes the hash of the previous message. This *hash chain* proves the order of
  messages and that nothing was removed.
- The latest conversation hash is anchored on-chain as an extra field in state-transition
  transactions that happen anyway (reveal, reject, dispute) — at almost no extra cost.

The concrete delivery channel for the demo is open.

## 7. Submission lifecycle

1. The company posts a bounty and locks the reward.
2. The whitehat commits the report hash, pays the submission bond, and — if the bounty requires
   it — must hold a KYC attestation.
3. The whitehat delivers the encrypted report off-chain and marks it as revealed on-chain.
4. **Decision period** (e.g. 14 days):
   - **accept** (with hidden severity, Section 5) → the company posts a bond, then payout (exact
     timing is open);
   - **reject** → the company posts a bond and a reason;
   - **silence** → automatic payout (Section 4.6).
5. **Appeal period** (e.g. 7 days): the whitehat may dispute, posting a bond.
6. **Arbitration** (Section 8).
7. The contract executes the ruling; the loser forfeits its bond.

Durations and bond amounts are examples; the concrete values are open.

```
            commit            reveal             accept
  (none) ──────────▶ submitted ─────▶ revealed ──────────▶ accepted ──▶ paid
                                         │  │                  ▲
                                         │  └── timeout ───────┼──────▶ paid
                                  reject │                     │
                                         ▼      dispute        │ ruling
                                     rejected ──────────▶ disputed
```

A severity dispute ("accepted, but too low") enters `disputed` from `accepted` in the same way.

**Key insight:** information cannot be taken back, but money can be held. Escrow, timeouts, and
bonds solve the *fair exchange problem* (two parties who do not trust each other each want the
other to deliver first). The arbitration system acts as the oracle for the question "is this
vulnerability valid?".

The *oracle problem*: a smart contract can only see data that is on the blockchain. It cannot know
by itself whether a statement about the outside world — here, "this report describes a real
vulnerability" — is true. An *oracle* is whatever mechanism brings that answer on-chain; the hard
part is making it trustworthy.

## 8. Arbitration

The arbitration system is **built and tested as part of this project**. It is not a mock and not an
external service. The design below is the initial design, inspired by Kleros and the UMA Optimistic
Oracle.

- **Juror pool:** jurors register and stake tokens to be eligible. (*Staking*: locking tokens that
  can be partly taken away as a penalty.)
- **Juror selection:** a small, odd-numbered panel is drawn per dispute, weighted by stake.
  On-chain randomness is manipulable (e.g. block-based values can be influenced by block
  producers). A method must be chosen and its limitations documented (open).
- **Evidence:** the whitehat reveals the report and PoC to the selected jurors, encrypted to their
  keys. The on-chain hash proves that it is the same report the company received. Both parties can
  submit evidence and their signed message chain.
- **Verification:** jurors run the PoC in the reproduction environment that the company must
  provide for the committed version (Section 4.3). If the company does not provide it, the company
  loses the dispute. The burden lies with the company because it is the only party that controls
  the system.
- **Voting:** commit-reveal. Jurors first submit a hash of their vote and reveal it later, so they
  cannot copy each other.
- **Incentives:** jurors who vote with the majority are rewarded from the losing party's bond and
  the arbitration fee. Minority voters and jurors who fail to reveal lose part of their stake. This
  relies on a *Schelling point*: when people cannot coordinate, they tend to pick the answer they
  expect everyone else to pick — and for an objectively checkable question, that is the truth. So
  voting honestly is the most profitable strategy.
- **Appeal:** optionally one appeal round with a larger panel and a higher fee (to be decided
  during design — open).
- **Confidentiality:** to limit exposure of vulnerability details, disputes may be heard after the
  fix window.
- **Testing:** the arbitration contracts are covered with unit tests, *fuzz tests* (tests run with
  many random inputs), and scenario tests: honest majority, colluding minority, non-revealing
  jurors, company never responding, etc.

## 9. Future work

- **Privacy-preserving KYC** via zero-knowledge credentials (proving "I am verified" without
  revealing who you are).

## 10. Reference platforms

For research and differentiation: HackerOne and Bugcrowd (centralized bug bounty platforms for
company systems, where the platform or the company decides), and the Web3 platforms Immunefi,
Code4rena, HackenProof, and Sherlock (three-tier dispute system with UMA as the final instance).
Even the platforms that pay on-chain still rely on a central team or committee for validation —
which is the part ProofBounty replaces with a visible mechanism.
