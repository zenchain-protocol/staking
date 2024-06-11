// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Item } from './Item';
import { ActiveAccounsWrapper } from './Wrappers';
import { useAccount } from 'wagmi';

export const AccountControls = () => {
  const activeAccount = useAccount();

  return (
    <ActiveAccounsWrapper>
      <Item address={activeAccount.address} />
    </ActiveAccounsWrapper>
  );
};
