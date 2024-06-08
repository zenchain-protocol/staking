// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTxMeta } from 'contexts/TxMeta';
import type { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types';
import { NotificationsController } from 'controllers/NotificationsController';
import { useAccount, usePublicClient, useSendTransaction } from 'wagmi';
import type { TxData } from '../../model/transactions';
import { estimateTxFee } from '../../model/transactions';
import type { PublicClient } from 'viem';

export const useSubmitExtrinsic = ({
  tx,
  from,
  shouldSubmit,
  callbackSubmit,
  callbackInBlock,
}: UseSubmitExtrinsicProps): UseSubmitExtrinsic => {
  const { t } = useTranslation('library');
  const activeAccount = useAccount();
  const publicClient = usePublicClient() as PublicClient;
  const { sendTransactionAsync } = useSendTransaction();
  const { txFees, setTxFees, setSender, resetTxPayloads, incrementPayloadUid } =
    useTxMeta();

  // Store given tx as a ref.
  const txRef = useRef<TxData>(tx);

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
    const feeEstimate = await estimateTxFee(publicClient, txRef.current);
    const feeEstimateBN = new BigNumber(feeEstimate?.toString() ?? '0');

    // give tx fees to global useTxMeta context
    if (feeEstimateBN.toString() !== txFees.toString()) {
      setTxFees(feeEstimateBN);
    }
  };

  // Extrinsic submission handler.
  const onSubmit = async () => {
    if (submitting || !shouldSubmit) {
      return;
    }

    // if `activeAccount` is imported from an extension, ensure it is enabled.
    if (
      !activeAccount.isConnected ||
      activeAccount.address !== fromRef.current
    ) {
      throw new Error(`${t('walletNotFound')}`);
    }

    const onReady = () => {
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
      NotificationsController.emit({
        title: t('inBlock'),
        subtitle: t('transactionInBlock'),
      });
      if (callbackInBlock && typeof callbackInBlock === 'function') {
        callbackInBlock();
      }
    };

    const resetTx = () => {
      resetTxPayloads();
      setSubmitting(false);
    };

    const onError = () => {
      resetTx();
      NotificationsController.emit({
        title: t('cancelled'),
        subtitle: t('transactionCancelled'),
      });
    };

    // pre-submission state update
    setSubmitting(true);

    // handle unsigned transaction.
    let txHash: `0x${string}`;
    try {
      txHash = await sendTransactionAsync(
        {
          account: fromRef.current,
          to: txRef.current.to,
          data: txRef.current.calldata,
        },
        {
          onSuccess: () => {
            onReady();
            didTxReset.current = true;
            resetTx();
          },
          onError,
        }
      );
    } catch (e) {
      console.error(e);
      if (submitting) {
        onError();
      }
      return;
    }

    try {
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
      });
    } catch (e) {
      console.error(e);
      NotificationsController.emit({
        title: t('failed'),
        subtitle: t('errorWithTransaction'),
      });
      setSubmitting(false);
      return;
    }
    onInBlock();

    await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 6,
    });
    NotificationsController.emit({
      title: t('finalized'),
      subtitle: t('transactionSuccessful'),
    });
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
  }, [tx?.toString(), tx?.method?.args?.calls?.toString(), from]);

  return {
    uid,
    onSubmit,
    submitting,
    submitAddress: fromRef.current,
  };
};
