# ProofBounty — Open Questions

Unresolved design items. When one is resolved: remove it here, add an entry to
[decisions.md](decisions.md) with date and rationale, and update
[architecture.md](architecture.md) — all in the same change.

Who works on what is tracked in GitLab, not here.

## Hints

A participant may contribute a hint (an incomplete lead) that helps another participant find a
valid vulnerability, and would likely receive a small share of the reward.

- How are hints submitted?
- How is a hint linked to the final report?
- How is it rewarded?

The team member who takes up this topic works out the details.

## Metadata protection

How do we keep per-submission information from signaling that an unpatched vulnerability exists?
(Background: architecture.md Section 5.)

Hidden severity is decided, but it only protects until the payout reveals the amount. So payout
timing remains open.

Ideas under evaluation:

- **Uniform submissions** — every submission looks the same on-chain (commitment hash + the same
  fixed bond).
- **Delayed payout** — pay after the company's "fix deployed" signal or after a maximum fix
  window, whichever comes first.

Known gaps:

- Delayed payout makes whitehats wait for their money.
- The company's "fix deployed" signal is itself a visible signal.
- The timing of accept / reject transactions can leak information.
- A well-known whitehat address submitting to a bounty is a signal on its own (reputation vs.
  privacy trade-off).

## Network

- Exact demo testnet (or L2 testnet).

## Parameters

- Concrete durations: decision period, appeal period, withdrawal notice period, maximum fix window.
- Bond amounts: submission bond, decision bond, dispute bond.
- Severity classification scheme (e.g. based on an existing industry standard).

## Arbitration

- Juror selection randomness method (and documenting its limitations).
- Panel size.
- Whether an appeal round is included.
- How a panel reaches a result when its votes split over several tiers.
- Who loses the bond when the awarded tier lies between the company's and the claimed tier.

## Off-chain and frontend

- Off-chain delivery channel for the demo (e.g. IPFS with encryption, a simple server, or a
  wallet-based messaging service).
- Frontend scope for the demo.

## Reproduction environment and target versions

Details of D-02, D-11, and D-27. Not yet discussed by the team.

- **Form and access:** what is a reproduction environment concretely (hosted staging instance,
  container image, ...), and how do the jurors get access to it?
- **Binding to the version hash:** who checks that the provided environment really is the committed
  version, and how — especially for closed-source systems, where nobody else can rebuild it?
- **Deadline:** how long does the company have to provide the environment, and what exactly counts
  as "not provided" (unreachable, incomplete, wrong version)?
- **What whitehats test against:** the company's live system, or an environment the company
  provides up front? How does the bounty state what testing is authorized?
- **Juror competence:** jurors must be able to run a PoC against arbitrary kinds of systems. Is
  that realistic for a staked, randomly drawn panel?
- **Demo target:** which example system (and reproduction environment) do we use for the demo?

## Raised during repository setup (not yet discussed by the team)

Gaps noticed while writing the docs. They are listed here so nobody fills them in silently.

- **Opening the hidden severity.** When and how does the whitehat learn the committed tier, given
  that they must be able to dispute it within the appeal period? What happens if the company never
  opens it?
- **Where do forfeited bonds go?** A lost submission bond (invalid report, no dispute) — to the
  company, a platform treasury, or burned? And is the company's rejection bond returned in full
  if the whitehat does not dispute?
- **Who decides that a submission bond is lost?** If the company's rejection alone forfeits it,
  the whitehat's only remedy is a dispute; confirm this is intended.

## Raised while writing the interfaces (not yet discussed by the team)

- **Invalid reports and silence.** An invalid report that is first in line would collect the reward
  when the company stays silent (D-37).
- **Reveal deadline.** A whitehat who commits and never delivers would block the withdrawal. The
  interface has a `revealPeriod` for this; confirm it and decide what happens to the bond.
- **Other pending submissions.** What happens to them, and to their bonds, once the bounty has paid?
- **Order of payouts.** Can a later report be paid while an earlier one is still open or in dispute?
