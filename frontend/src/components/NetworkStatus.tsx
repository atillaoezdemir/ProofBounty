import { useBlockNumber } from "wagmi";
import { appChain } from "../wagmi";
import "./NetworkStatus.css";

export function NetworkStatus() {
  const block = useBlockNumber({
    chainId: appChain.id,
    query: { refetchInterval: 4_000, retry: false },
  });

  if (block.isPending) {
    return <span className="network">Connecting to {appChain.name}…</span>;
  }
  if (block.isError) {
    return <span className="network network-down">{appChain.name} node not reachable</span>;
  }
  return (
    <span className="network network-up">
      {appChain.name} · block {block.data.toString()}
    </span>
  );
}
