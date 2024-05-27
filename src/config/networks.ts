// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import KusamaIconSVG from 'img/kusama_icon.svg?react';
import KusamaInlineSVG from 'img/kusama_inline.svg?react';
import KusamaLogoSVG from 'img/kusama_logo.svg?react';
import PolkadotIconSVG from 'img/polkadot_icon.svg?react';
import PolkadotInlineSVG from 'img/polkadot_inline.svg?react';
import PolkadotLogoSVG from 'img/polkadot_logo.svg?react';
import PolkadotTokenSVG from 'config/tokens/svg/DOT.svg?react';
import KusamaTokenSVG from 'config/tokens/svg/KSM.svg?react';

import type { NetworkName, Networks } from 'types';
import BigNumber from 'bignumber.js';

// DEPRECATION: Paged Rewards
//
// Temporary until paged rewards migration has completed on all networks. Wait 84 eras from Polkadot
// start: 1420 + 84 = 1504, when full history depth will be moved over to new paged rewards storage.
export const NetworksWithPagedRewards: NetworkName[] = [
  'polkadot',
  'zenchain_testnet',
];
export const PagedRewardsStartEra: Record<NetworkName, BigNumber | null> = {
  polkadot: new BigNumber(1420),
  zenchain_testnet: new BigNumber(1),
};

export const crossChainJsonRpcEndpoints: Record<string, string> = {
  mainnet: 'https://mainnet.infura.io/v3/617baa5f9ce341899f31633fae9f6ce5',
};

export const NetworkList: Networks = {
  polkadot: {
    name: 'polkadot',
    chainId: 0,
    endpoints: {
      lightClient: 'polkadot',
      defaultRpcEndpoint: 'IBP-GeoDNS1',
      wsRpcEndpoints: {
        'Automata 1RPC': 'wss://1rpc.io/dot',
        Dwellir: 'wss://polkadot-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/polkadot',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/polkadot',
        LuckyFriday: 'wss://rpc-polkadot.luckyfriday.io',
        RadiumBlock: 'wss://polkadot.public.curie.radiumblock.co/ws',
        Stakeworld: 'wss://dot-rpc.stakeworld.io',
      },
      jsonRpcEndpoints: {
        'IBP-GeoDNS1': 'https://rpc.ibp.network/polkadot',
      },
    },
    colors: {
      primary: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
      },
      secondary: {
        light: '#552bbf',
        dark: '#6d39ee',
      },
      stroke: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
      },
      transparent: {
        light: 'rgb(211, 48, 121, 0.05)',
        dark: 'rgb(211, 48, 121, 0.05)',
      },
      pending: {
        light: 'rgb(211, 48, 121, 0.33)',
        dark: 'rgb(211, 48, 121, 0.33)',
      },
    },
    unit: 'DOT',
    units: 10,
    ss58: 0,
    brand: {
      icon: PolkadotIconSVG,
      token: PolkadotTokenSVG,
      logo: {
        svg: PolkadotLogoSVG,
        width: '7.2em',
      },
      inline: {
        svg: PolkadotInlineSVG,
        size: '1.05em',
      },
    },
    api: {
      unit: 'DOT',
      priceTicker: 'DOTUSDT',
    },
    defaultFeeReserve: 0.1,
    maxExposurePageSize: new BigNumber(512),
  },
  zenchain_testnet: {
    name: 'zenchain_testnet',
    chainId: 8408,
    endpoints: {
      lightClient: 'zenchain_testnet',
      defaultRpcEndpoint: 'onFinality',
      wsRpcEndpoints: {
        localhost: 'ws://localhost:9944',
        onFinality: `wss://node-7199424157743243264.gx.onfinality.io/ws?apikey=${import.meta.env.VITE_ON_FINALITY_API_KEY}`,
      },
      jsonRpcEndpoints: {
        localhost: `http://localhost:9944`,
        onFinality: `https://node-7199424157743243264.gx.onfinality.io/jsonrpc?apikey=${import.meta.env.VITE_ON_FINALITY_API_KEY}`,
      },
    },
    colors: {
      primary: {
        light: 'rgb(31, 41, 55)',
        dark: 'rgb(126, 131, 141)',
      },
      secondary: {
        light: 'rgb(31, 41, 55)',
        dark: 'rgb(141, 144, 150)',
      },
      stroke: {
        light: '#4c4b63',
        dark: '#d1d1db',
      },
      transparent: {
        light: 'rgb(51,51,51,0.05)',
        dark: 'rgb(102,102,102, 0.05)',
      },
      pending: {
        light: 'rgb(51,51,51,0.33)',
        dark: 'rgb(102,102,102, 0.33)',
      },
    },
    unit: 'ZCX',
    units: 18,
    ss58: 42,
    brand: {
      icon: KusamaIconSVG,
      token: KusamaTokenSVG,
      logo: {
        svg: KusamaLogoSVG,
        width: '7.2em',
      },
      inline: {
        svg: KusamaInlineSVG,
        size: '1.35em',
      },
    },
    api: {
      unit: 'ZCX',
      priceTicker: 'ZCXUSDT',
    },
    defaultFeeReserve: 0.05,
    maxExposurePageSize: new BigNumber(512),
  },
};
