import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/custom.scss";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  chain as chainList,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { AppWrapper } from "../context/state";
import Layout from "../components/layout";
import { useIsMounted } from "../hooks";

const chain = chainList[process.env.NEXT_PUBLIC_CHAIN_NAME.toLowerCase()];
const { chains, provider } = configureChains(
  [chain],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "NounScout",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted();
  if (!isMounted)
    return (
      <Layout isMounted={isMounted}>
        <AppWrapper isMounted={isMounted}>
          <Layout isMounted={isMounted}>
            <Component
              {...pageProps}
              suppressHydrationWarning
              isMounted={isMounted}
            />
          </Layout>
        </AppWrapper>
      </Layout>
    );
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <AppWrapper isMounted={isMounted}>
          <Layout isMounted={isMounted}>
            <Component
              {...pageProps}
              suppressHydrationWarning
              isMounted={isMounted}
            />
          </Layout>
        </AppWrapper>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
