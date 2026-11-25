import type { ListedBounty } from "../bounty";
import { BountyCard } from "./BountyCard";
import "./BountyList.css";

export function BountyList({ bounties }: { bounties: ListedBounty[] }) {
  return (
    <section className="bounty-list-section">
      <h2>Bounties</h2>
      {bounties.length === 0 && <p>No bounties yet.</p>}
      <div className="bounty-list">
        {bounties.map((bounty) => (
          <BountyCard key={bounty.id.toString()} bounty={bounty} />
        ))}
      </div>
    </section>
  );
}
