import {
  type Connector,
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

  // Connecting only asks for an account, so a failing network switch cannot block it. The switch
  // follows as a separate request.
  function handleConnect(connector: Connector) {
    connect.mutate(
      { connector },
      {
        onSuccess: (data) => {
          if (data.chainId !== appChain.id) {
            switchChain.mutate({ chainId: appChain.id, connector });
          }
        },
      },
    );
  }

  if (isConnected && address) {
    return (
      <div className="wallet">
        {chainId !== appChain.id && (
          <button
            className="primary"
            disabled={switchChain.isPending}
            onClick={() => switchChain.mutate({ chainId: appChain.id })}
          >
            {switchChain.isPending
              ? "Confirm the network in your wallet…"
              : `Switch to ${appChain.name}`}
          </button>
        )}
        <span className="wallet-address" title={address}>
          {shortAddress(address)}
        </span>
        <button className="secondary" onClick={() => disconnect.mutate({})}>
          Disconnect
        </button>
        {switchChain.error && chainId !== appChain.id && (
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

  if (connect.isPending) {
    return (
      <div className="wallet">
        <span role="status">Waiting for your wallet…</span>
        <button className="secondary" onClick={() => connect.reset()}>
          Cancel
        </button>
        <p className="wallet-hint">
          If no window appears, open the wallet extension, unlock it and confirm the request.
        </p>
      </div>
    );
  }

  return (
    <div className="wallet">
      {options.map((connector) => (
        <button
          key={connector.uid}
          className="primary"
          onClick={() => handleConnect(connector)}
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
