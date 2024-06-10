// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList } from 'config/networks';
import { useNetwork } from 'contexts/Network';

const endpoint =
  'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_24hr_change=true&ids=';

export const useUnitPrice = () => {
  const { network } = useNetwork();

  const fetchUnitPrice = async () => {
    const ticker = NetworkList[network].api.priceTicker;
    if (!ticker) {
      return {
        lastPrice: 0,
        change: 0,
      };
    }
    const urls = [`${endpoint}${ticker}`];

    const responses = await Promise.all(
      urls.map((u) => fetch(u, { method: 'GET' }))
    );
    const texts = await Promise.all(responses.map((res) => res.json()));
    const newPrice = texts[0];

    if (newPrice[ticker]) {
      const price: string = (
        Math.ceil(newPrice[ticker].usd * 100) / 100
      ).toFixed(2);

      return {
        lastPrice: price,
        change: (
          Math.round(newPrice[ticker].usd_24h_change * 100) / 100
        ).toFixed(2),
      };
    }
    return null;
  };

  return fetchUnitPrice;
};
