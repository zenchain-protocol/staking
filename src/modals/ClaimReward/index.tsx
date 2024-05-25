// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { useAccount } from 'wagmi';

export const ClaimReward = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { notEnoughFunds } = useTxMeta();
  const activeAccount = useAccount();
  const { getSignerWarnings } = useSignerWarnings();
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal;

  const { claimType } = options;

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!api) {
      return tx;
    }

    if (claimType === 'bond') {
      tx = api.tx.nominationPools.bondExtra('Rewards');
    } else {
      tx = api.tx.nominationPools.claimPayout();
    }
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount.address,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(activeAccount.address, false);

  useEffect(() => setModalResize(), [notEnoughFunds, warnings.length]);

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">
          {claimType === 'bond' ? t('compound') : t('withdraw')} {t('rewards')}
        </h2>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        {claimType === 'bond' ? (
          <p>{t('claimReward1')}</p>
        ) : (
          <p>{t('claimReward2')}</p>
        )}
      </ModalPadding>
      <SubmitTx valid={true} {...submitExtrinsic} />
    </>
  );
};
