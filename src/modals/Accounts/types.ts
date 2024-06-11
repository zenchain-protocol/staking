// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { MaybeAddress } from 'types';

export interface AccountItemProps {
  address: MaybeAddress;
  label?: string[];
  asElement?: boolean;
  noBorder?: boolean;
  transferrableBalance?: BigNumber;
}

export interface AccountNominating {
  address: MaybeAddress;
  stashImported: boolean;
}

export interface AccountNotStaking {
  address: string;
}
