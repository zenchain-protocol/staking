// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useTxMeta } from 'contexts/TxMeta';
import type { MaybeAddress } from 'types';

export const useSignerWarnings = () => {
  const { t } = useTranslation('modals');
  const { controllerSignerAvailable } = useTxMeta();

  const getSignerWarnings = (account: MaybeAddress, controller = false) => {
    const warnings = [];

    if (
      controller &&
      controllerSignerAvailable(account) === 'controller_not_imported'
    ) {
      warnings.push(`${t('controllerImported')}`);
    }

    return warnings;
  };

  return { getSignerWarnings };
};
