// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
import type { Identity } from '../../contexts/Validators/types';
import { ethers } from 'ethers';
import {
  ensResolverAbi,
  ensRegistryAbi,
  ENS_REGISTRY_ADDRESS_MAINNET,
} from './types';
import { crossChainJsonRpcEndpoints } from '../../config/networks';
import { MulticallWrapper } from 'ethers-multicall-provider';

// TODO: test identities controller batch call
export class IdentitiesController {
  // Fetches identities for addresses.
  static async fetch(addresses: string[]): Promise<Record<string, Identity>> {
    const provider = MulticallWrapper.wrap(
      new ethers.JsonRpcProvider(crossChainJsonRpcEndpoints.mainnet)
    );

    // get ens resolvers
    const ensRegistry = new ethers.Contract(
      ENS_REGISTRY_ADDRESS_MAINNET,
      ensRegistryAbi,
      provider
    );
    const resolverAddresses: string[] = await Promise.all(
      addresses.map((address) => ensRegistry.resolver(ethers.namehash(address)))
    );

    // handle resolvers being at different addresses
    const resolvers = new Map<string, ethers.Contract>();
    const getResolver = (address: string): ethers.Contract => {
      let resolver = resolvers.get(address);
      if (!resolver) {
        resolver = new ethers.Contract(address, ensResolverAbi, provider);
        resolvers.set(address, resolver);
      }
      return resolver;
    };

    // fetch ens names
    const ensNamePromises = resolverAddresses
      .filter(
        (result) => result !== '0x0000000000000000000000000000000000000000'
      )
      .map((result, i) => {
        const resolver = getResolver(result);
        return resolver.name(ethers.namehash(addresses[i])) as Promise<string>;
      });
    const ensNames = await Promise.all(ensNamePromises);

    // transform
    return ensNames.reduce((acc: Record<string, Identity>, result, index) => {
      acc[addresses[index]] = {
        address: addresses[index],
        ens: result as string,
      };
      return acc;
    }, {});
  }
}
