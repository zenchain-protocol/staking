// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

interface TipConfig {
  id: string;
  s: number;
  page?: string;
}

export const TipsConfig: TipConfig[] = [
  {
    id: 'connectExtensions',
    s: 1,
  },
  {
    id: 'recommendedNominator',
    s: 2,
    page: 'nominate',
  },
  {
    id: 'howToStake',
    s: 4,
  },
  {
    id: 'managingNominations',
    s: 5,
    page: 'nominate',
  },
  {
    id: 'reviewingPayouts',
    s: 8,
    page: 'payouts',
  },
  {
    id: 'understandingValidatorPerformance',
    s: 8,
    page: 'validators',
  },
];
