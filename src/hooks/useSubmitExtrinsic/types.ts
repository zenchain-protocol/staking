// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from 'types';
import type { TxData } from '../../model/transactions';

export interface UseSubmitExtrinsicProps {
  tx: TxData | null;
  from: MaybeAddress;
  shouldSubmit: boolean;
  callbackSubmit?: () => void;
  callbackInBlock?: () => void;
}

export interface UseSubmitExtrinsic {
  uid: number;
  onSubmit: () => void;
  submitting: boolean;
  submitAddress: MaybeAddress;
}
