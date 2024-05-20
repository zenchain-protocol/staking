// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnySubscan } from 'types';
import type { ListFormat } from '../../library/List/types';

export interface PayoutListProps {
  allowMoreCols?: boolean;
  pagination?: boolean;
  title?: string | null;
  payoutsList?: AnySubscan;
  payouts?: AnySubscan;
}

export interface PayoutListContextInterface {
  setListFormat: (v: ListFormat) => void;
  listFormat: ListFormat;
}
