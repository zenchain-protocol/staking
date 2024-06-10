// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList } from 'config/networks';
import { useNetwork } from 'contexts/Network';

interface CoingeckoSimplePrice {
  unizen?: { usd: number; usd_24h_change: number };
}

export const useUnitPrice = () => {
  const { network } = useNetwork();

  const fetchUnitPrice = async () => {
    const endpoint =
      'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_24hr_change=true&ids=';

    const urls = [`${endpoint}${NetworkList[network].api.priceTicker}`];

    const responses = await Promise.all(
      urls.map((u) => fetch(u, { method: 'GET' }))
    );
    const texts = await Promise.all(
      responses.map((res) => res.json() as CoingeckoSimplePrice)
    );
    const newPrice = texts[0];

    if (newPrice.unizen) {
      const price: string = (
        Math.ceil(newPrice.unizen.usd * 100) / 100
      ).toFixed(2);

      return {
        lastPrice: price,
        change: (
          Math.round(newPrice.unizen.usd_24h_change * 100) / 100
        ).toFixed(2),
      };
    }
    return null;
  };

  return fetchUnitPrice;
};
