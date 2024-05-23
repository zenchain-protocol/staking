// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft, faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { AccountButton } from './Account';
import { AccountSeparator, AccountWrapper } from './Wrappers';
import type { AccountNominating, AccountNotStaking } from './types';
import { useActiveBalances } from 'hooks/useActiveBalances';
import type { MaybeAddress } from 'types';
import { useTransferOptions } from 'contexts/TransferOptions';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { ButtonText } from 'kits/Buttons/ButtonText';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalCustomHeader } from 'kits/Overlay/structure/ModalCustomHeader';
import { ActionItem } from 'library/ActionItem';

export const Accounts = () => {
  const { t } = useTranslation('modals');
  const {
    consts: { existentialDeposit },
  } = useApi();
  const {
    replaceModal,
    status: modalStatus,
    setModalResize,
  } = useOverlay().modal;
  const { accounts } = useImportedAccounts();
  const { getFeeReserve } = useTransferOptions();
  const { activeAccount, setActiveAccount } = useActiveAccounts();

  // Listen to balance updates for entire accounts list.
  const { getLocks, getBalance, getEdReserved } = useActiveBalances({
    accounts: accounts.map(({ address }) => address),
  });

  // Calculate transferrable balance of an address.
  const getTransferrableBalance = (address: MaybeAddress) => {
    // Get fee reserve from local storage.
    const feeReserve = getFeeReserve(address);
    // Get amount required for existential deposit.
    const edReserved = getEdReserved(address, existentialDeposit);
    // Gets actual balance numbers.
    const { free, frozen } = getBalance(address);
    // Minus reserves and frozen balance from free to get transferrable.
    return BigNumber.max(
      free.minus(edReserved).minus(feeReserve).minus(frozen),
      0
    );
  };

  const stashes: string[] = [];
  // accumulate imported stash accounts
  for (const { address } of accounts) {
    const { locks } = getLocks(address);

    // account is a stash if they have an active `staking` lock
    if (locks.find(({ id }) => id === 'staking')) {
      stashes.push(address);
    }
  }

  // construct account groupings
  const nominating: AccountNominating[] = [];
  const notStaking: AccountNotStaking[] = [];

  for (const { address } of accounts) {
    let isNominating = false;
    const isStash = stashes[stashes.indexOf(address)] ?? null;

    // Check if nominating.
    if (
      isStash &&
      nominating.find((a) => a.address === address) === undefined
    ) {
      isNominating = true;
    }

    // If not doing anything, add address to `notStaking`.
    if (!isStash && !notStaking.find((n) => n.address === address)) {
      notStaking.push({ address });
      continue;
    }

    // Nominating only.
    if (isNominating) {
      nominating.push({ address, stashImported: true });
    }
  }

  // Resize if modal open upon state changes.
  useEffect(() => {
    if (modalStatus === 'open') {
      setModalResize();
    }
  }, [
    accounts,
    activeAccount,
    JSON.stringify(nominating),
    JSON.stringify(notStaking),
  ]);

  return (
    <ModalPadding>
      <ModalCustomHeader>
        <div className="first">
          <h1>{t('accounts')}</h1>
          <ButtonPrimaryInvert
            text={t('goToConnect')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-3"
            onClick={() =>
              replaceModal({ key: 'Connect', options: { disableScroll: true } })
            }
            marginLeft
          />
        </div>
        <div>
          {activeAccount && (
            <ButtonText
              style={{
                color: 'var(--accent-color-primary)',
              }}
              text={t('disconnect')}
              iconRight={faLinkSlash}
              onClick={() => {
                setActiveAccount(null);
              }}
            />
          )}
        </div>
      </ModalCustomHeader>
      {!activeAccount && !accounts.length && (
        <AccountWrapper style={{ marginTop: '1.5rem' }}>
          <div>
            <div>
              <h4 style={{ padding: '0.75rem 1rem' }}>
                {t('noActiveAccount')}
              </h4>
            </div>
            <div />
          </div>
        </AccountWrapper>
      )}

      {nominating.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('nominating')} />
          {nominating.map(({ address }, i) => (
            <Fragment key={`acc_nominating_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
            </Fragment>
          ))}
        </>
      ) : null}

      {notStaking.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('notStaking')} />
          {notStaking.map(({ address }, i) => (
            <Fragment key={`acc_not_staking_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
            </Fragment>
          ))}
        </>
      ) : null}
    </ModalPadding>
  );
};
