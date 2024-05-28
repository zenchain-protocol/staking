import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { wagmiConfig } from '../../config/wagmi';
import initMetaMask from '@polkadot/extension-compat-metamask/bundle';

export const EthereumProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await initMetaMask();
      }
    };
    void init();
  }, [!!window.ethereum]);

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
