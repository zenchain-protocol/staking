// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { TxMetaContextInterface } from './types';

export const defaultTxMeta: TxMetaContextInterface = {
  controllerSignerAvailable: (a) => 'ok',
  txFees: new BigNumber(0),
  notEnoughFunds: false,
  setTxFees: (f) => {},
  resetTxFees: () => {},
  sender: null,
  setSender: (s) => {},
  txFeesValid: false,
  incrementPayloadUid: () => 0,
  getPayloadUid: () => 0,
  getTxPayload: () => {},
  setTxPayload: (p, u) => {},
  resetTxPayloads: () => {},
  addPendingNonce: (nonce) => {},
  removePendingNonce: (nonce) => {},
  pendingNonces: [],
};
