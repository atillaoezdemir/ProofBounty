import "./App.css";
import { ConnectWallet } from "./components/ConnectWallet";
import { NetworkStatus } from "./components/NetworkStatus";

export default function App() {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <h1 className="logo">ProofBounty</h1>
          <NetworkStatus />
          <ConnectWallet />
        </div>
      </header>

      <main className="container main" />

      <footer className="footer">
        <div className="container">
          <p>ProofBounty: decentralized bug bounty platform</p>
        </div>
      </footer>
    </>
  );
}
