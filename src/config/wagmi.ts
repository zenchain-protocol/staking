import { crossChainJsonRpcEndpoints, NetworkList } from './networks';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import type { Chain } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import {
  braveWallet,
  coinbaseWallet,
  frameWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { mainnet } from 'wagmi/chains';

const zcTestnetEndpoints = NetworkList['zenchain_testnet'].endpoints;
const zenchainTestnet = {
  id: 8408,
  name: 'Zenchain Testnet',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
  iconBackground: '#fff',
  nativeCurrency: {
    name: 'Zenchain Exchange Token',
    symbol: 'ZCX',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        zcTestnetEndpoints.jsonRpcEndpoints[
          zcTestnetEndpoints.defaultRpcEndpoint
        ],
      ],
      webSocket: [
        zcTestnetEndpoints.wsRpcEndpoints[
          zcTestnetEndpoints.defaultRpcEndpoint
        ],
      ],
    },
  },
  // blockExplorers: {
  //   default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  // },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 11_907_934,
  //   },
  // },
} as const satisfies Chain;

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        braveWallet,
        frameWallet,
        rainbowWallet,
        trustWallet,
      ],
    },
  ],
  {
    appName: 'Zenchain Staking',
    projectId: '20ab57bb9999f58c6d3f2408e7d7cfc4',
  }
);

export const wagmiConfig = createConfig({
  connectors,
  ssr: false,
  chains: [zenchainTestnet],
  transports: {
    [zenchainTestnet.id]: http(zenchainTestnet.rpcUrls.default.http[0]),
  },
});

export const mainnetWagmiConfig = createConfig({
  ssr: false,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(crossChainJsonRpcEndpoints.mainnet),
  },
});
