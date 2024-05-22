// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ethers } from 'ethers';
import type { ReactNode } from 'react';
import type { NetworkName } from '../../types';

export interface EthereumProviderProps {
  children: ReactNode;
  network: NetworkName;
}

export interface EthereumContextInterface {
  provider: ethers.Provider | null;
}
