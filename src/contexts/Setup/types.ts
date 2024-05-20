// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson, MaybeAddress, MaybeString } from 'types';

export type PayeeOptions =
  | 'Staked'
  | 'Stash'
  | 'Controller'
  | 'Account'
  | 'None';

export type NominatorSetups = Record<string, NominatorSetup>;

export interface NominatorSetup {
  section: number;
  progress: NominatorProgress;
}

export interface NominatorProgress {
  payee: PayeeConfig;
  nominations: AnyJson[];
  bond: MaybeString;
}

export interface PayeeConfig {
  destination: PayeeOptions | null;
  account: MaybeAddress;
}

export interface SetupContextInterface {
  removeSetupProgress: (a: MaybeAddress) => void;
  getNominatorSetupPercent: (a: MaybeAddress) => number;
  setActiveAccountSetup: (p: NominatorProgress) => void;
  setActiveAccountSetupSection: (s: number) => void;
  getNominatorSetup: (address: MaybeAddress) => NominatorSetup;
}
