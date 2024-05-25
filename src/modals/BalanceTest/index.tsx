// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils';
import { useApi } from 'contexts/Api';
import { useOverlay } from 'kits/Overlay/Provider';
import { useTxMeta } from 'contexts/TxMeta';
import { useBatchCall } from 'hooks/useBatchCall';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect } from 'react';
import { useNetwork } from 'contexts/Network';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { useAccount } from 'wagmi';

export const BalanceTest = () => {
  const { api } = useApi();
  const {
    networkData: { units },
  } = useNetwork();
  const activeAccount = useAccount();
  const { notEnoughFunds } = useTxMeta();
  const { newBatchCall } = useBatchCall();
  const { setModalStatus, setModalResize } = useOverlay().modal;

  // tx to submit
  const getTx = () => {
    const tx = null;
    if (!api || !activeAccount.address) {
      return tx;
    }

    const txs = [
      api.tx.balances.transfer(
        {
          id: '1554u1a67ApEt5xmjbZwjgDNaVckbzB6cjRHWAQ1SpNkNxTd',
        },
        unitToPlanck('0.1', units).toString()
      ),
      api.tx.balances.transfer(
        {
          id: '1554u1a67ApEt5xmjbZwjgDNaVckbzB6cjRHWAQ1SpNkNxTd',
        },
        unitToPlanck('0.05', units).toString()
      ),
    ];
    return newBatchCall(txs);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount.address,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  useEffect(() => setModalResize(), [notEnoughFunds]);

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">Balance Test</h2>
      </ModalPadding>
      <SubmitTx valid {...submitExtrinsic} />
    </>
  );
};
