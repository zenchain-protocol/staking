// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useTxMeta } from 'contexts/TxMeta';
import type { MaybeAddress } from 'types';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';

export const useSignerWarnings = () => {
  const { t } = useTranslation('modals');
  const { accountHasSigner } = useImportedAccounts();
  const { controllerSignerAvailable } = useTxMeta();

  const getSignerWarnings = (account: MaybeAddress, controller = false) => {
    const warnings = [];

    if (controller) {
      switch (controllerSignerAvailable(account)) {
        case 'controller_not_imported':
          warnings.push(`${t('controllerImported')}`);
          break;
        case 'read_only':
          warnings.push(`${t('readOnlyCannotSign')}`);
          break;
        default:
          break;
      }
    } else if (!accountHasSigner(account)) {
      warnings.push(`${t('readOnlyCannotSign')}`);
    }

    return warnings;
  };

  return { getSignerWarnings };
};
