import { formatEther } from "viem";
import type { ListedBounty } from "../bounty";
import { formatPeriod, shortAddress } from "../format";

export function BountyCard({ bounty }: { bounty: ListedBounty }) {
  const { params } = bounty;
  const targets = params.versionHashes.length;
  const details = [
    ["Submission bond", `${formatEther(params.submissionBond)} ETH`],
    ["Rejection bond", `${formatEther(params.rejectionBond)} ETH`],
    ["Dispute bond", `${formatEther(params.disputeBond)} ETH`],
    ["Reveal period", formatPeriod(params.revealPeriod)],
    ["Decision period", formatPeriod(params.decisionPeriod)],
    ["Appeal period", formatPeriod(params.appealPeriod)],
    ["Notice period", formatPeriod(params.noticePeriod)],
  ];

  return (
    <article className={`bounty-card ${bounty.open ? "" : "closed"}`}>
      <div className="bounty-card-header">
        <h3 className="bounty-title">{bounty.title}</h3>
        <span className={`badge ${bounty.open ? "badge-open" : "badge-closed"}`}>
          {bounty.open ? "Open" : "Closed"}
        </span>
      </div>

      <p className="bounty-scope">{bounty.scope}</p>

      <dl className="bounty-details">
        <div className="detail">
          <dt>Reward</dt>
          <dd className="reward">{formatEther(params.reward)} ETH</dd>
        </div>
        {details.map(([label, value]) => (
          <div className="detail" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="bounty-footer">
        <span title={bounty.company}>Posted by {shortAddress(bounty.company)}</span>
        <span>
          {targets} {targets === 1 ? "target" : "targets"}
        </span>
      </div>
    </article>
  );
}
