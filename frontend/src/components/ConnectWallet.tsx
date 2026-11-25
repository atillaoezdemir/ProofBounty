import {
  ProviderNotFoundError,
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { shortAddress } from "../format";
import { appChain } from "../wagmi";
import "./ConnectWallet.css";

export function ConnectWallet() {
  const { address, chainId, isConnected } = useConnection();
  const connectors = useConnectors();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();

  if (isConnected && address) {
    return (
      <div className="wallet">
        {chainId !== appChain.id && (
          <button
            className="primary"
            disabled={switchChain.isPending}
            onClick={() => switchChain.mutate({ chainId: appChain.id })}
          >
            Switch to {appChain.name}
          </button>
        )}
        <span className="wallet-address" title={address}>
          {shortAddress(address)}
        </span>
        <button className="secondary" onClick={() => disconnect.mutate({})}>
          Disconnect
        </button>
        {switchChain.error && (
          <p className="wallet-error" role="alert">
            {switchChain.error.message.split("\n")[0]}
          </p>
        )}
      </div>
    );
  }

  // Wallets that announce themselves (EIP-6963) replace the generic entry.
  const announced = connectors.filter((connector) => connector.id !== "injected");
  const options = announced.length > 0 ? announced : connectors;

  return (
    <div className="wallet">
      {options.map((connector) => (
        <button
          key={connector.uid}
          className="primary"
          disabled={connect.isPending}
          onClick={() => connect.mutate({ connector, chainId: appChain.id })}
        >
          {announced.length > 1 ? `Connect ${connector.name}` : "Connect wallet"}
        </button>
      ))}
      {connect.error && (
        <p className="wallet-error" role="alert">
          {connect.error instanceof ProviderNotFoundError
            ? "No wallet found. Install a browser wallet such as MetaMask."
            : connect.error.message.split("\n")[0]}
        </p>
      )}
    </div>
  );
}
