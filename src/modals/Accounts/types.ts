// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { Proxy } from 'contexts/Proxies/types';
import type { MaybeAddress } from 'types';

export interface AccountItemProps {
  address: MaybeAddress;
  label?: string[];
  asElement?: boolean;
  delegator?: string;
  noBorder?: boolean;
  proxyType?: string;
  transferrableBalance?: BigNumber;
}

export interface DelegatesProps {
  delegator: string;
  delegates: Proxy | undefined;
}

export interface AccountNominating {
  address: MaybeAddress;
  stashImported: boolean;
  delegates?: Proxy;
}

export interface AccountNotStaking {
  address: string;
  delegates?: Proxy;
}
