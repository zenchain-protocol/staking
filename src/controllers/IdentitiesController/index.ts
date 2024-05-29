// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
import type { Identity } from '../../contexts/Validators/types';
import { normalize } from 'viem/ens';
import type { PublicClient } from 'viem';
import type { ViemCall } from './types';
import { ensResolverAbi, ensRegistryAbi } from './types';

// TODO: need to test this implementation
export class IdentitiesController {
  // Fetches identities for addresses.
  static fetch = async (
    client: PublicClient,
    addresses: `0x${string}`[]
  ): Promise<Record<string, Identity>> => {
    const ensRegistryContract = client.chain?.contracts?.ensRegistry;
    if (!ensRegistryContract) {
      return {};
    }

    const resolverCalls: ViemCall[] = addresses.map((address) => ({
      address: ensRegistryContract.address,
      abi: ensRegistryAbi,
      functionName: 'resolver',
      args: [normalize(address)],
    }));

    const resolverAddresses = await client.multicall({
      contracts: resolverCalls,
      allowFailure: true,
    });

    const nameCalls: ViemCall[] = resolverAddresses
      .map((result, i) => {
        if (
          result.error ||
          result.result === '0x0000000000000000000000000000000000000000'
        ) {
          return null;
        }
        return {
          address: result.result as `0x${string}`, // Resolver address
          abi: ensResolverAbi,
          functionName: 'name',
          args: [normalize(addresses[i])],
        };
      })
      .filter((result) => result !== null) as ViemCall[];

    const ensNames = await client.multicall({
      contracts: nameCalls,
      allowFailure: true,
    });

    return ensNames.reduce((acc: Record<string, Identity>, result, index) => {
      if (!result.error && result.result) {
        acc[addresses[index]] = {
          address: addresses[index],
          ens: result.result as string,
        };
      }
      return acc;
    }, {});
  };
}
