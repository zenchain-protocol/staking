// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { useBonded } from 'contexts/Bonded';
import type { AnyJson, MaybeAddress } from 'types';
import * as defaults from './defaults';
import type { TxMetaContextInterface } from './types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { useApi } from 'contexts/Api';

export const TxMetaContext = createContext<TxMetaContextInterface>(
  defaults.defaultTxMeta
);

export const useTxMeta = () => useContext(TxMetaContext);

export const TxMetaProvider = ({ children }: { children: ReactNode }) => {
  const {
    consts: { existentialDeposit },
  } = useApi();
  const { getBondedAccount } = useBonded();

  // Store the transaction fees for the transaction.
  const [txFees, setTxFees] = useState<BigNumber>(new BigNumber(0));

  // Store the sender of the transaction.
  const [sender, setSender] = useState<MaybeAddress>(null);

  // Store whether the sender does not have enough funds.
  const [notEnoughFunds, setNotEnoughFunds] = useState<boolean>(false);

  // Store the payloads of transactions if extrinsics require manual signing (e.g. Ledger). payloads
  // are calculated asynchronously and extrinsic associated with them may be cancelled. For this
  // reason we give every payload a uid, and check whether this uid matches the active extrinsic
  // before submitting it.
  const [txPayload, setTxPayloadState] = useState<{
    payload: AnyJson;
    uid: number;
  } | null>(null);
  const txPayloadRef = useRef(txPayload);

  // Store the pending nonces of transactions. NOTE: Ref is required as `pendingNonces` is read in
  // callbacks.
  const [pendingNonces, setPendingNonces] = useState<string[]>([]);
  const pendingNoncesRef = useRef(pendingNonces);

  // Listen to balance updates for the tx sender.
  const { getBalance, getEdReserved } = useActiveBalances({
    accounts: [sender],
  });

  const senderBalances = getBalance(sender);

  const resetTxFees = () => {
    setTxFees(new BigNumber(0));
  };

  const getPayloadUid = () => txPayloadRef.current?.uid || 1;

  const incrementPayloadUid = () => (txPayloadRef.current?.uid || 0) + 1;

  const getTxPayload = () => txPayloadRef.current?.payload || null;

  const setTxPayload = (p: AnyJson, uid: number) => {
    setStateWithRef(
      {
        payload: p,
        uid,
      },
      setTxPayloadState,
      txPayloadRef
    );
  };

  const resetTxPayloads = () => {
    setStateWithRef(null, setTxPayloadState, txPayloadRef);
  };

  const txFeesValid = (() => !(txFees.isZero() || notEnoughFunds))();

  const controllerSignerAvailable = (stash: MaybeAddress) => {
    const controller = getBondedAccount(stash);

    if (controller !== stash) {
      return 'controller_not_imported';
    }
    return 'ok';
  };

  const addPendingNonce = (nonce: string) => {
    setStateWithRef(
      [...pendingNoncesRef.current].concat(nonce),
      setPendingNonces,
      pendingNoncesRef
    );
  };

  const removePendingNonce = (nonce: string) => {
    setStateWithRef(
      pendingNoncesRef.current.filter((n) => n !== nonce),
      setPendingNonces,
      pendingNoncesRef
    );
  };

  // Refresh not enough fee status when txfees or sender changes.
  useEffectIgnoreInitial(() => {
    const edReserved = getEdReserved(sender, existentialDeposit);
    const { free, frozen } = senderBalances;
    const balanceforTxFees = free.minus(edReserved).minus(frozen);

    setNotEnoughFunds(balanceforTxFees.minus(txFees).isLessThan(0));
  }, [txFees, sender, senderBalances]);

  return (
    <TxMetaContext.Provider
      value={{
        controllerSignerAvailable,
        txFees,
        notEnoughFunds,
        setTxFees,
        resetTxFees,
        txFeesValid,
        sender,
        setSender,
        incrementPayloadUid,
        getPayloadUid,
        getTxPayload,
        setTxPayload,
        resetTxPayloads,
        addPendingNonce,
        removePendingNonce,
        pendingNonces,
      }}
    >
      {children}
    </TxMetaContext.Provider>
  );
};
