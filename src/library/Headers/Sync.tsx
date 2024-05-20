// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { pageFromUri } from '@w3ux/utils';
import { useLocation } from 'react-router-dom';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { usePayouts } from 'contexts/Payouts';
import { Spinner } from './Spinner';
import { useTxMeta } from 'contexts/TxMeta';
import { useSyncing } from 'hooks/useSyncing';

export const Sync = () => {
  const { syncing } = useSyncing();
  const { pathname } = useLocation();
  const { pendingNonces } = useTxMeta();
  const { payoutsSynced } = usePayouts();
  const { validators } = useValidators();

  // Keep syncing if on nominate page and still fetching payouts.
  const onNominateSyncing = () =>
    pageFromUri(pathname, 'overview') === 'nominate' &&
    payoutsSynced !== 'synced';

  // Keep syncing if on validators page and still fetching.
  const onValidatorsSyncing = () =>
    pageFromUri(pathname, 'overview') === 'validators' && !validators.length;

  const isSyncing =
    syncing ||
    onNominateSyncing() ||
    onValidatorsSyncing() ||
    pendingNonces.length > 0;

  return isSyncing ? <Spinner /> : null;
};
