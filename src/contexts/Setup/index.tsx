// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  greaterThanZero,
  localStorageOrDefault,
  unitToPlanck,
} from '@w3ux/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { MaybeAddress } from 'types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { defaultNominatorProgress, defaultSetupContext } from './defaults';
import type {
  NominatorProgress,
  NominatorSetup,
  NominatorSetups,
  SetupContextInterface,
} from './types';

export const SetupContext =
  createContext<SetupContextInterface>(defaultSetupContext);

export const useSetup = () => useContext(SetupContext);

export const SetupProvider = ({ children }: { children: ReactNode }) => {
  const {
    network,
    networkData: { units },
  } = useNetwork();
  const { accounts } = useImportedAccounts();
  const { activeAccount } = useActiveAccounts();

  // Store all imported accounts nominator setups.
  const [nominatorSetups, setNominatorSetups] = useState<NominatorSetups>({});

  // Generates the default setup objects or the currently connected accounts. Refers to local
  // storage to hydrate state, falls back to defaults otherwise.
  const refreshSetups = () => {
    setNominatorSetups(localNominatorSetups());
  };

  // Utility to get the default progress based on type.
  const defaultProgress = (): NominatorProgress =>
    defaultNominatorProgress as NominatorProgress;

  // Utility to get the default setup based on type.
  // const defaultSetup = (type: BondFor): NominatorSetup => ({
  //   section: 1,
  //   progress: defaultProgress(type) as NominatorProgress,
  // });

  // Gets the setup progress for a connected account. Falls back to default setup if progress does
  // not yet exist.
  const getSetupProgress = (address: MaybeAddress): NominatorSetup => {
    const setup = Object.fromEntries(
      Object.entries(nominatorSetups).filter(([k]) => k === address)
    );
    return (
      setup[address || ''] || {
        progress: defaultProgress(),
        section: 1,
      }
    );
  };

  // Getter to ensure a nominator setup is returned.
  const getNominatorSetup = (address: MaybeAddress): NominatorSetup =>
    getSetupProgress(address);

  // Remove setup progress for an account.
  const removeSetupProgress = (address: MaybeAddress) => {
    const updatedSetups = Object.fromEntries(
      Object.entries(nominatorSetups).filter(([k]) => k !== address)
    );
    setSetups(updatedSetups);
  };

  // Sets setup progress for an address. Updates localStorage followed by app state.
  const setActiveAccountSetup = (progress: NominatorProgress) => {
    if (!activeAccount) {
      return;
    }

    const updatedSetups = updateSetups(assignSetups(), progress, activeAccount);
    setSetups(updatedSetups);
  };

  // Sets active setup section for an address.
  const setActiveAccountSetupSection = (section: number) => {
    if (!activeAccount) {
      return;
    }

    const setups = assignSetups();
    const updatedSetups = updateSetups(
      setups,
      setups[activeAccount]?.progress ?? defaultProgress(),
      activeAccount,
      section
    );
    setSetups(updatedSetups);
  };

  // Utility to update the progress item of either a nominator setup or pool setup,
  const updateSetups = <T extends NominatorSetups, U extends NominatorProgress>(
    all: T,
    newSetup: U,
    account: string,
    maybeSection?: number
  ) => {
    const current = Object.assign(all[account] || {});
    const section = maybeSection ?? current.section ?? 1;

    (all as Record<string, NominatorSetup>)[account] = {
      ...current,
      progress: newSetup,
      section,
    };

    return all;
  };

  // Gets the stake setup progress as a percentage for an address.
  const getNominatorSetupPercent = (address: MaybeAddress) => {
    if (!address) {
      return 0;
    }
    const setup = getSetupProgress(address) as NominatorSetup;
    const { progress } = setup;
    const bond = unitToPlanck(progress?.bond || '0', units);

    const p = 33;
    let percentage = 0;
    if (greaterThanZero(bond)) {
      percentage += p;
    }
    if (progress.nominations.length) {
      percentage += p;
    }
    if (progress.payee.destination !== null) {
      percentage += p;
    }
    return percentage;
  };

  // Utility to copy the current setup state based on setup type.
  const assignSetups = () => ({ ...nominatorSetups });

  // Utility to get nominator setups, type casted as NominatorSetups.
  const localNominatorSetups = () =>
    localStorageOrDefault('nominator_setups', {}, true) as NominatorSetups;

  // Utility to update setups state depending on type.
  const setSetups = (setups: NominatorSetups) => {
    setLocalSetups(setups);
    setNominatorSetups(setups as NominatorSetups);
  };

  // Utility to either update local setups or remove if empty.
  const setLocalSetups = (setups: NominatorSetups) => {
    const key = 'nominator_setups';
    const setupsStr = JSON.stringify(setups);

    if (setupsStr === '{}') {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, setupsStr);
    }
  };

  // Update setup state when activeAccount changes
  useEffectIgnoreInitial(() => {
    if (accounts.length) {
      refreshSetups();
    }
  }, [activeAccount, network, accounts]);

  return (
    <SetupContext.Provider
      value={{
        removeSetupProgress,
        getNominatorSetupPercent,
        setActiveAccountSetup,
        setActiveAccountSetupSection,
        getNominatorSetup,
      }}
    >
      {children}
    </SetupContext.Provider>
  );
};
