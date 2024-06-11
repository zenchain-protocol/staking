// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { NominatorProgress, SetupContextInterface } from './types';

export const defaultNominatorProgress: NominatorProgress = {
  payee: {
    destination: null,
    account: null,
  },
  nominations: [],
  bond: '',
};

export const defaultSetupContext: SetupContextInterface = {
  removeSetupProgress: (b) => {},
  getNominatorSetupPercent: (a) => 0,
  setActiveAccountSetup: (p) => {},
  setActiveAccountSetupSection: (s) => {},
  getNominatorSetup: (address) => ({
    section: 1,
    progress: defaultNominatorProgress,
  }),
};
