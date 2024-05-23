// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api';
import type { AnyApi } from 'types';

export const useBatchCall = () => {
  const { api } = useApi();

  const newBatchCall = (txs: AnyApi[]) => api?.tx.utility.batch(txs);

  return {
    newBatchCall,
  };
};
