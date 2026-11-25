import { useState } from "react";
import type { ListedBounty } from "../bounty";
import { MOCK_BOUNTIES } from "./mockBounties";

/**
 * The only place the dApp gets bounties from. Uses mock data until BountyEscrow is implemented
 * (issue #1); then this hook reads from the contract.
 */
export function useBounties() {
  const [bounties] = useState<ListedBounty[]>(MOCK_BOUNTIES);
  return { bounties };
}
