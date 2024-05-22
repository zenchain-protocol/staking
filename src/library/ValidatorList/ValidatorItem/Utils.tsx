// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import { MaxEraRewardPointsEras } from 'consts';
import type { AnyJson } from 'types';

export const getIdentityDisplay = (_identity: AnyJson) => {
  const identityDisplay = _identity?.ens ?? null;

  if (!identityDisplay) {
    return null;
  }

  return (
    <>
      {identityDisplay}
      <span>/ {_identity.address}</span>
    </>
  );
};

// Normalise era points between 0 and 1 relative to the highest recorded value.
export const normaliseEraPoints = (
  eraPoints: Record<string, BigNumber>,
  high: BigNumber
): Record<string, number> => {
  const percentile = high.dividedBy(100);

  return Object.fromEntries(
    Object.entries(eraPoints).map(([era, points]) => [
      era,
      Math.min(points.dividedBy(percentile).multipliedBy(0.01).toNumber(), 1),
    ])
  );
};

// Prefill low values where no points are recorded.
export const prefillEraPoints = (eraPoints: number[]): number[] => {
  const missing = Math.max(MaxEraRewardPointsEras - eraPoints.length, 0);

  if (!missing) {
    return eraPoints;
  }

  return Array(missing).fill(0).concat(eraPoints);
};
