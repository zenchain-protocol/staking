// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useAccount, usePublicClient } from 'wagmi';
import { estimateTxFee, Staking } from '../../model/transactions';
import type { PublicClient } from 'viem';

export const useBondGreatestFee = () => {
  const activeAccount = useAccount();
  const publicClient = usePublicClient();
  const { feeReserve, getTransferOptions } = useTransferOptions();
  const transferOptions = useMemo(
    () => getTransferOptions(activeAccount.address),
    [activeAccount]
  );
  const { transferrableBalance } = transferOptions;

  // store the largest possible tx fees for bonding.
  const [largestTxFee, setLargestTxFee] = useState<BigNumber>(new BigNumber(0));

  // update max tx fee on free balance change
  useEffect(() => {
    handleFetch();
  }, [transferOptions]);

  // handle fee fetching
  const handleFetch = async () => {
    const largestFee = await txLargestFee();
    setLargestTxFee(largestFee);
  };

  // estimate the largest possible tx fee based on users free balance.
  const txLargestFee = async () => {
    const bond = BigNumber.max(
      transferrableBalance.minus(feeReserve),
      0
    ).toString();

    const fee = await estimateTxFee(
      publicClient as PublicClient,
      Staking.bondExtra(bond)
    );

    return new BigNumber(fee?.toString() ?? '0');
  };

  return largestTxFee;
};
