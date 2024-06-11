// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import type { MaybeAddress } from 'types';
import * as defaults from './defaults';
import type { BalancesContextInterface } from './types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'controllers/utils';
import { BalancesController } from 'controllers/BalancesController';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { useBonded } from 'contexts/Bonded';
import { SyncController } from 'controllers/SyncController';
import { useAccount } from 'wagmi';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useApi } from '../Api';

export const BalancesContext = createContext<BalancesContextInterface>(
  defaults.defaultBalancesContext
);

export const useBalances = () => useContext(BalancesContext);

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
  const { getBondedAccount } = useBonded();
  const activeAccount = useAccount();
  const controller = getBondedAccount(activeAccount.address);
  const { isReady, api } = useApi();

  // Listen to balance updates for the active account and controller.
  const {
    activeBalances,
    getLocks,
    getBalance,
    getLedger,
    getPayee,
    getNominations,
  } = useActiveBalances({
    accounts: [activeAccount.address, controller],
  });

  // Check all accounts have been synced. App-wide syncing state for all accounts.
  const newAccountBalancesCallback = (e: Event) => {
    if (
      isCustomEvent(e) &&
      BalancesController.isValidNewAccountBalanceEvent(e)
    ) {
      // Update whether all account balances have been synced.
      checkBalancesSynced();
    }
  };

  // Check whether all accounts have been synced and update state accordingly.
  const checkBalancesSynced = () => {
    if (
      Object.keys(BalancesController.balances).length ===
      activeAccount.addresses?.length
    ) {
      SyncController.dispatch('balances', 'complete');
    }
  };

  // Gets an account's nonce directly from `BalanceController`. Used at the time of building a
  // payload.
  const getNonce = (address: MaybeAddress) => {
    if (address) {
      const maybeNonce = BalancesController.balances[address]?.nonce;
      if (maybeNonce) {
        return maybeNonce;
      }
    }
    return 0;
  };

  const documentRef = useRef<Document>(document);

  // Listen for new account balance events.
  useEventListener(
    'new-account-balance',
    newAccountBalancesCallback,
    documentRef
  );

  // If no accounts are imported, set balances synced to true.
  useEffect(() => {
    if (!activeAccount.addresses?.length) {
      SyncController.dispatch('balances', 'complete');
    }
  }, [activeAccount.addresses?.length]);

  // Keep accounts in sync with `BalancesController`.
  useEffectIgnoreInitial(() => {
    if (api && isReady && activeAccount.addresses) {
      BalancesController.syncAccounts(api, activeAccount.addresses as string[]);
    }
  }, [isReady, activeAccount.addresses]);

  return (
    <BalancesContext.Provider
      value={{
        activeBalances,
        getNonce,
        getLocks,
        getBalance,
        getLedger,
        getPayee,
        getNominations,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
