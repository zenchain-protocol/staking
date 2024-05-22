// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
import type { ethers } from 'ethers';
import type { Identity } from '../../contexts/Validators/types';

export class IdentitiesController {
  // Fetches identities for addresses.
  static fetch = async (
    provider: ethers.Provider,
    addresses: string[]
  ): Promise<Record<string, Identity>> => {
    const ensAddresses = await Promise.all(
      addresses.map((address) => provider.resolveName(address))
    );

    return ensAddresses.reduce(
      (acc: Record<string, Identity>, ensAddress, index) => {
        if (ensAddress) {
          acc[addresses[index]] = {
            address: addresses[index],
            ens: ensAddress,
          };
        }
        return acc;
      },
      {}
    );
  };
}
