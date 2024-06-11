// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBonded } from 'contexts/Bonded';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from 'kits/Overlay/Provider';
import { useBalances } from 'contexts/Balances';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ModalSeparator } from 'kits/Overlay/structure/ModalSeparator';
import { useAccount } from 'wagmi';
import { Staking } from '../../model/transactions';

export const StopNominations = () => {
  const { t } = useTranslation('modals');
  const { notEnoughFunds } = useTxMeta();
  const { getBondedAccount } = useBonded();
  const { getNominations } = useBalances();
  const activeAccount = useAccount();
  const { getSignerWarnings } = useSignerWarnings();
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal;

  const { bondFor } = options;
  const isStaking = bondFor === 'nominator';
  const signingAccount = getBondedAccount(activeAccount.address);

  const nominations = getNominations(activeAccount.address);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure selected key is valid
  useEffect(() => {
    setValid(nominations.length > 0);
  }, [nominations]);

  // ensure roles are valid
  const isValid = nominations.length > 0;

  // tx to submit
  const getTx = () => {
    if (valid && isStaking) {
      return Staking.chill();
    }
    return null;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(activeAccount.address, isStaking);

  if (!nominations.length) {
    warnings.push(`${t('noNominationsSet')}`);
  }

  useEffect(() => setModalResize(), [notEnoughFunds]);

  useEffect(() => setValid(isValid), [isValid]);

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">
          {t('stop')} {t('allNominations')}
        </h2>
        <ModalSeparator />
        {warnings.length ? (
          <ModalWarnings>
            {warnings.map((text, i) => (
              <Warning key={`warning_${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <p>{t('changeNomination')}</p>
      </ModalPadding>
      <SubmitTx fromController={isStaking} valid={valid} {...submitExtrinsic} />
    </>
  );
};
