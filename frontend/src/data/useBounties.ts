import { useState } from "react";
import type { Address } from "viem";
import type { BountyParams, BountyText, ListedBounty } from "../bounty";
import { MOCK_BOUNTIES } from "./mockBounties";

/**
 * The only place the dApp gets bounties from and posts them to. Uses mock data until BountyEscrow
 * is implemented (issue #1); then this hook reads from and writes to the contract.
 */
export function useBounties() {
  const [bounties, setBounties] = useState<ListedBounty[]>(MOCK_BOUNTIES);

  function createBounty(company: Address, params: BountyParams, text: BountyText) {
    setBounties((current) => [
      { id: BigInt(current.length), company, open: true, params, ...text },
      ...current,
    ]);
  }

  return { bounties, createBounty };
}
