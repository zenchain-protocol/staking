// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { SubscanPayoutData } from 'controllers/SubscanController/types';
import type { AnySubscan } from 'types';

export interface BondedProps {
  active: BigNumber;
  free: BigNumber;
  unlocking: BigNumber;
  unlocked: BigNumber;
  inactive: boolean;
}

export interface EraPointsProps {
  items: AnySubscan;
  height: number;
}

export interface PayoutBarProps {
  days: number;
  height: string;
  data: SubscanPayoutData;
}

export interface PayoutLineProps {
  days: number;
  average: number;
  height: string;
  background?: string;
  data: SubscanPayoutData;
}

export interface CardHeaderWrapperProps {
  $withAction?: boolean;
  $withMargin?: boolean;
}

export interface CardWrapperProps {
  height?: string | number;
}

export interface PayoutDayCursor {
  amount: BigNumber;
  event_id: string;
}
