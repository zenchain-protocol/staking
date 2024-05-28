// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
import type { Identity } from '../../contexts/Validators/types';

export class IdentitiesController {
  // Fetches identities for addresses.
  static fetch = async (
    addresses: `0x${string}`[]
  ): Promise<Record<string, Identity>> => {
    const ensAddresses = await Promise.all(
      addresses.map(async (address) => address + 'test')
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
