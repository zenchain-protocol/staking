// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useStaking } from 'contexts/Staking';
import DefaultAccount from '../Account/DefaultAccount';
import { HeadingWrapper } from './Wrappers';
import { useSyncing } from 'hooks/useSyncing';
import { useAccount } from 'wagmi';

export const Connected = () => {
  const { isNominating } = useStaking();
  const { syncing } = useSyncing(['initialization']);
  const activeAccount = useAccount();

  return (
    activeAccount.address && (
      <>
        {/* Default account display / stash label if actively nominating. */}
        <HeadingWrapper>
          <DefaultAccount
            value={activeAccount.address}
            label={
              syncing ? undefined : isNominating() ? 'Nominator' : undefined
            }
          />
        </HeadingWrapper>
      </>
    )
  );
};
