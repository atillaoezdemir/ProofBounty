import type { Address, Hash } from "viem";

/** Mirrors IBountyEscrow.BountyParams. Amounts in wei, periods in seconds (uint64). */
export interface BountyParams {
  reward: bigint;
  scopeHash: Hash;
  versionHashes: Hash[];
  knownIssuesHash: Hash;
  submissionBond: bigint;
  rejectionBond: bigint;
  disputeBond: bigint;
  revealPeriod: bigint;
  decisionPeriod: bigint;
  appealPeriod: bigint;
  noticePeriod: bigint;
  requiresKyc: boolean;
}

/** Mirrors IBountyEscrow.Bounty. */
export interface Bounty {
  company: Address;
  open: boolean;
  params: BountyParams;
}

/** Text the contract does not store; the scope is on-chain as a hash only. */
export interface BountyText {
  title: string;
  scope: string;
}

export interface ListedBounty extends Bounty, BountyText {
  id: bigint;
}

export const DAY = 86_400n;
