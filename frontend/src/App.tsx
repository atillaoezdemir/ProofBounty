import "./App.css";
import { BountyList } from "./components/BountyList";
import { ConnectWallet } from "./components/ConnectWallet";
import { NetworkStatus } from "./components/NetworkStatus";
import { useBounties } from "./data/useBounties";

export default function App() {
  const { bounties } = useBounties();

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <h1 className="logo">ProofBounty</h1>
          <NetworkStatus />
          <ConnectWallet />
        </div>
      </header>

      <main className="container main">
        <BountyList bounties={bounties} />
      </main>

      <footer className="footer">
        <div className="container">
          <p>ProofBounty: decentralized bug bounty platform</p>
        </div>
      </footer>
    </>
  );
}
