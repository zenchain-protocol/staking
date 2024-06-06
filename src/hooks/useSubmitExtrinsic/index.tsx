// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useTxMeta } from 'contexts/TxMeta';
import type { AnyApi } from 'types';
import { useBuildPayload } from '../useBuildPayload';
import type { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types';
import { NotificationsController } from 'controllers/NotificationsController';
import { useAccount } from 'wagmi';
import { web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

export const useSubmitExtrinsic = ({
  tx,
  from,
  shouldSubmit,
  callbackSubmit,
  callbackInBlock,
}: UseSubmitExtrinsicProps): UseSubmitExtrinsic => {
  const { t } = useTranslation('library');
  const { api } = useApi();
  const { buildPayload } = useBuildPayload();
  const { addPendingNonce, removePendingNonce } = useTxMeta();
  const activeAccount = useAccount();
  const {
    txFees,
    setTxFees,
    setSender,
    getTxPayload,
    resetTxPayloads,
    incrementPayloadUid,
  } = useTxMeta();

  // Store given tx as a ref.
  const txRef = useRef<AnyApi>(tx);

  // Store given submit address as a ref.
  const fromRef = useRef<string>(from || '');

  // Store whether the transaction is in progress.
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Store the uid of the extrinsic.
  const [uid] = useState<number>(incrementPayloadUid());

  // Track for one-shot transaction reset after submission.
  const didTxReset = useRef<boolean>(false);

  // Calculate the estimated tx fee of the transaction.
  const calculateEstimatedFee = async () => {
    if (txRef.current === null) {
      return;
    }
    // get payment info
    const { partialFee } = await txRef.current.paymentInfo(fromRef.current);
    const partialFeeBn = new BigNumber(partialFee.toString());

    // give tx fees to global useTxMeta context
    if (partialFeeBn.toString() !== txFees.toString()) {
      setTxFees(partialFeeBn);
    }
  };

  // Extrinsic submission handler.
  const onSubmit = async () => {
    if (submitting || !shouldSubmit || !api) {
      return;
    }

    // if `activeAccount` is imported from an extension, ensure it is enabled.
    if (
      !activeAccount.isConnected ||
      activeAccount.address !== fromRef.current
    ) {
      throw new Error(`${t('walletNotFound')}`);
    }

    const nonce = (
      await api.rpc.system.accountNextIndex(fromRef.current)
    ).toHuman();

    const onReady = () => {
      addPendingNonce(nonce);
      NotificationsController.emit({
        title: t('pending'),
        subtitle: t('transactionInitiated'),
      });
      if (callbackSubmit && typeof callbackSubmit === 'function') {
        callbackSubmit();
      }
    };

    const onInBlock = () => {
      setSubmitting(false);
      removePendingNonce(nonce);
      NotificationsController.emit({
        title: t('inBlock'),
        subtitle: t('transactionInBlock'),
      });
      if (callbackInBlock && typeof callbackInBlock === 'function') {
        callbackInBlock();
      }
    };

    const onFinalizedEvent = (method: string) => {
      if (method === 'ExtrinsicSuccess') {
        NotificationsController.emit({
          title: t('finalized'),
          subtitle: t('transactionSuccessful'),
        });
      } else if (method === 'ExtrinsicFailed') {
        NotificationsController.emit({
          title: t('failed'),
          subtitle: t('errorWithTransaction'),
        });
        setSubmitting(false);
        removePendingNonce(nonce);
      }
    };

    const resetTx = () => {
      resetTxPayloads();
      setSubmitting(false);
    };

    const onError = () => {
      resetTx();
      removePendingNonce(nonce);
      NotificationsController.emit({
        title: t('cancelled'),
        subtitle: t('transactionCancelled'),
      });
    };

    const handleStatus = (status: AnyApi) => {
      if (status.isReady) {
        onReady();
      }
      if (status.isInBlock) {
        onInBlock();
      }
    };

    const unsubEvents = ['ExtrinsicSuccess', 'ExtrinsicFailed'];

    // pre-submission state update
    setSubmitting(true);

    // handle unsigned transaction.
    try {
      await web3Enable('Zenchain Staking');
      const injector = await web3FromAddress(fromRef.current);
      const unsub = await txRef.current.signAndSend(
        fromRef.current,
        { signer: injector.signer },
        ({ status, events = [] }: AnyApi) => {
          if (!didTxReset.current) {
            didTxReset.current = true;
            resetTx();
          }

          handleStatus(status);
          if (status.isFinalized) {
            events.forEach(({ event: { method } }: AnyApi) => {
              onFinalizedEvent(method);
              if (unsubEvents?.includes(method)) {
                unsub();
              }
            });
          }
        }
      );
    } catch (e) {
      console.error(e);
      onError();
    }
  };

  // Refresh state upon `tx` updates.
  useEffect(() => {
    // update txRef to latest tx.
    txRef.current = tx;
    // update submit address to latest from.
    fromRef.current = from || '';
    // ensure sender is up to date.
    setSender(fromRef.current);
    // re-calculate estimated tx fee.
    calculateEstimatedFee();
    // rebuild tx payload.
    buildPayload(txRef.current, fromRef.current, uid);
  }, [tx?.toString(), tx?.method?.args?.calls?.toString(), from]);

  return {
    uid,
    onSubmit,
    submitting,
    submitAddress: fromRef.current,
  };
};
