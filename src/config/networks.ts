// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import KusamaIconSVG from 'img/kusama_icon.svg?react';
import KusamaInlineSVG from 'img/kusama_inline.svg?react';
import KusamaLogoSVG from 'img/kusama_logo.svg?react';
import KusamaTokenSVG from 'config/tokens/svg/KSM.svg?react';

import type { Networks } from 'types';
import BigNumber from 'bignumber.js';

export const crossChainJsonRpcEndpoints: Record<string, string> = {
  mainnet: 'https://mainnet.infura.io/v3/617baa5f9ce341899f31633fae9f6ce5',
};

export const NetworkList: Networks = {
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
      priceTicker: undefined, // 'unizen',
    },
    defaultFeeReserve: 0.05,
    maxExposurePageSize: new BigNumber(512),
  },
};
