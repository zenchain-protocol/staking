// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useStaking } from 'contexts/Staking';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import DefaultAccount from '../Account/DefaultAccount';
import { HeadingWrapper } from './Wrappers';
import { useSyncing } from 'hooks/useSyncing';

export const Connected = () => {
  const { isNominating } = useStaking();
  const { syncing } = useSyncing(['initialization']);
  const { accountHasSigner } = useImportedAccounts();
  const { activeAccount } = useActiveAccounts();

  return (
    activeAccount && (
      <>
        {/* Default account display / stash label if actively nominating. */}
        <HeadingWrapper>
          <DefaultAccount
            value={activeAccount}
            label={
              syncing ? undefined : isNominating() ? 'Nominator' : undefined
            }
            readOnly={!accountHasSigner(activeAccount)}
          />
        </HeadingWrapper>
      </>
    )
  );
};
