// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { MaybeAddress } from 'types';
import { setStateWithRef } from '@w3ux/utils';
import { useNetwork } from 'contexts/Network';
import type { ActiveAccountsContextInterface } from './types';
import { defaultActiveAccountsContext } from './defaults';

export const ActiveAccountsContext =
  createContext<ActiveAccountsContextInterface>(defaultActiveAccountsContext);

export const useActiveAccounts = () => useContext(ActiveAccountsContext);

export const ActiveAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { network } = useNetwork();

  // Store the currently active account.
  const [activeAccount, setActiveAccountState] = useState<MaybeAddress>(null);
  const activeAccountRef = useRef<string | null>(activeAccount);

  // Setter for the active account.
  const setActiveAccount = (
    newActiveAccount: MaybeAddress,
    updateLocalStorage = true
  ) => {
    if (updateLocalStorage) {
      if (newActiveAccount === null) {
        localStorage.removeItem(`${network}_active_account`);
      } else {
        localStorage.setItem(`${network}_active_account`, newActiveAccount);
      }
    }

    setStateWithRef(newActiveAccount, setActiveAccountState, activeAccountRef);
  };

  // Getter for the active account.
  const getActiveAccount = () => activeAccountRef.current;

  return (
    <ActiveAccountsContext.Provider
      value={{
        activeAccount: activeAccountRef.current,
        setActiveAccount,
        getActiveAccount,
      }}
    >
      {children}
    </ActiveAccountsContext.Provider>
  );
};
