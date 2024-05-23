// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ActiveAccountsContextInterface } from './types';

export const defaultActiveAccountsContext: ActiveAccountsContextInterface = {
  activeAccount: null,
  getActiveAccount: () => null,
  setActiveAccount: (address, updateLocal) => {},
};
