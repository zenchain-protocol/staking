// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { stringToU8a } from '@polkadot/util';

/*
 * Global Constants
 */
export const DappName = 'Zenchain Staking Dashboard';
export const PolkadotUrl = 'https://polkadot.network/features/staking/';
export const STAKING_ADDRESS = '0x0000000000000000000000000000000000000800';
export const FAST_UNSTAKE_ADDRESS = '0x000000000000000000000000000000000000801';
// TODO: deploy multicall3 contract
export const MULTICALL3_ADDRESS = '0x';

/*
 * Byte Helpers
 */
export const EmptyH256 = new Uint8Array(32);
export const ModPrefix = stringToU8a('modl');
export const U32Opts = { bitLength: 32, isLe: true };

/*
 * Element Thresholds
 */

export const MaxPageWidth = 1450;
export const SideMenuMaximisedWidth = 185;
export const SideMenuMinimisedWidth = 75;
export const SectionFullWidthThreshold = 1000;
export const PageWidthSmallThreshold = 825;
export const PageWidthMediumThreshold = 1150;
export const SmallFontSizeMaxWidth = 600;

export const TipsThresholdSmall = 750;
export const TipsThresholdMedium = 1200;

/*
 * Misc Values
 */
export const MaxPayoutDays = 60;
export const MaxEraRewardPointsEras = 10;
