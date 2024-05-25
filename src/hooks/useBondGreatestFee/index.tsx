// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useApi } from 'contexts/Api';
import { useTransferOptions } from 'contexts/TransferOptions';
import type { BondFor } from 'types';
import { useAccount } from 'wagmi';

interface Props {
  bondFor: BondFor;
}

export const useBondGreatestFee = ({ bondFor }: Props) => {
  const { api } = useApi();
  const activeAccount = useAccount();
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

    let tx = null;
    if (!api) {
      return new BigNumber(0);
    }

    if (bondFor === 'nominator') {
      tx = api.tx.staking.bondExtra(bond);
    }

    if (tx) {
      const { partialFee } = await tx.paymentInfo(activeAccount.address || '');
      return new BigNumber(partialFee.toString());
    }
    return new BigNumber(0);
  };

  return largestTxFee;
};
