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
- **Delayed payout** — pay after the protocol's "fix deployed" signal or after a maximum fix
  window, whichever comes first.

Known gaps:

- Delayed payout makes whitehats wait for their money.
- The protocol's "fix deployed" signal and the patch / upgrade transaction are themselves visible
  signals.
- The timing of accept / reject transactions can leak information.
- A well-known whitehat address submitting to a bounty is a signal on its own (reputation vs.
  privacy trade-off).

## Network and tokens

- Exact demo testnet (or L2 testnet).
- Reward token: ETH or an ERC-20 stablecoin.
- Token used for juror staking.

## Parameters

- Concrete durations: decision period, appeal period, withdrawal notice period, maximum fix window.
- Bond amounts: submission bond, rejection bond, dispute bond.
- Severity classification scheme (e.g. based on an existing industry standard).

## Arbitration

- Juror selection randomness method (and documenting its limitations).
- Panel size.
- Whether an appeal round is included.

## Off-chain and frontend

- Off-chain delivery channel for the demo (e.g. IPFS with encryption, a simple server, or a
  wallet-based messaging service).
- Frontend scope for the demo.

## Raised during repository setup (not yet discussed by the team)

Gaps noticed while writing the docs. They are listed here so nobody fills them in silently.

- **Hidden severity needs a salt and an opening.** There are only a few severity tiers, so a plain
  `hash(tier)` can be reversed by trying each tier. The commitment needs a secret salt. Also: when
  and how does the whitehat learn the committed tier, given that they must be able to dispute it
  within the appeal period?
- **Where do forfeited bonds go?** A lost submission bond (invalid report, no dispute) — to the
  protocol, a platform treasury, or burned? And is the protocol's rejection bond returned in full
  if the whitehat does not dispute?
- **Who decides that a submission bond is lost?** If the protocol's rejection alone forfeits it,
  the whitehat's only remedy is a dispute; confirm this is intended.
