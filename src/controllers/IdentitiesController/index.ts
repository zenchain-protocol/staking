// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
import type { ethers } from 'ethers';

export class IdentitiesController {
  // Fetches identities for addresses.
  static fetch = async (provider: ethers.Provider, addresses: string[]) => {
    const ensAddresses = await Promise.all(
      addresses.map((address) => provider.resolveName(address))
    );

    return ensAddresses.reduce(
      (acc: Record<string, string>, ensAddress, index) => {
        if (ensAddress) {
          acc[addresses[index]] = ensAddress;
        }
        return acc;
      },
      {}
    );
  };
}
