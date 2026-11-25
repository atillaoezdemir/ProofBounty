import { createConfig, http } from "wagmi";
import { hardhat } from "wagmi/chains";
import { injected } from "wagmi/connectors";

/** The chain the dApp runs on. The demo testnet is added here once it is chosen. */
export const appChain = hardhat;

export const config = createConfig({
  chains: [appChain],
  connectors: [injected()],
  transports: {
    [appChain.id]: http("http://127.0.0.1:8545"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
