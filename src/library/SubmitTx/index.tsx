// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBonded } from 'contexts/Bonded';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { Default } from './Default';
import type { SubmitTxProps } from './types';
import { Tx } from 'kits/Structure/Tx';
import { useAccount } from 'wagmi';
import type { MaybeAddress } from '../../types';

export const SubmitTx = ({
  onSubmit,
  submitText,
  buttons = [],
  submitAddress,
  valid = false,
  noMargin = false,
  submitting = false,
  displayFor = 'default',
  fromController = false,
}: SubmitTxProps) => {
  const { t } = useTranslation();
  const { getBondedAccount } = useBonded();
  const { unit } = useNetwork().networkData;
  const { setModalResize } = useOverlay().modal;
  const activeAccount = useAccount();
  const { notEnoughFunds } = useTxMeta();
  const controller = getBondedAccount(activeAccount.address);

  // Default to active account
  let signingOpts: { label: string; who: MaybeAddress } = {
    label: t('signer', { ns: 'library' }),
    who: activeAccount.address,
  };

  if (fromController) {
    signingOpts = {
      label: t('signedByController', { ns: 'library' }),
      who: controller,
    };
  }

  submitText =
    submitText ||
    `${
      submitting
        ? t('submitting', { ns: 'modals' })
        : t('submit', { ns: 'modals' })
    }`;

  // Set resize on not enough funds.
  useEffect(() => {
    setModalResize();
  }, [notEnoughFunds, fromController]);

  return (
    <Tx
      displayFor={displayFor}
      margin={!noMargin}
      label={signingOpts.label}
      name={signingOpts.who || ''}
      notEnoughFunds={notEnoughFunds}
      dangerMessage={`${t('notEnough', { ns: 'library' })} ${unit}`}
      SignerComponent={
        <Default
          onSubmit={onSubmit}
          submitting={submitting}
          valid={valid}
          submitText={submitText}
          buttons={buttons}
          submitAddress={submitAddress}
          displayFor={displayFor}
        />
      }
    />
  );
};
