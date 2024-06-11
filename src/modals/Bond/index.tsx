// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useTransferOptions } from 'contexts/TransferOptions';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { useBondGreatestFee } from 'hooks/useBondGreatestFee';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { useAccount } from 'wagmi';
import { Staking } from '../../model/transactions';

export const Bond = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const {
    networkData: { units },
  } = useNetwork();
  const { notEnoughFunds } = useTxMeta();
  const activeAccount = useAccount();
  const { getSignerWarnings } = useSignerWarnings();
  const { feeReserve, getTransferOptions } = useTransferOptions();
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal;

  const { bondFor } = options;
  const { nominate, transferrableBalance } = getTransferOptions(
    activeAccount.address
  );

  const freeToBond = planckToUnit(
    (bondFor === 'nominator'
      ? nominate.totalAdditionalBond
      : transferrableBalance
    ).minus(feeReserve),
    units
  );

  const largestTxFee = useBondGreatestFee();

  // local bond value.
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToBond.toString(),
  });

  // bond valid.
  const [bondValid, setBondValid] = useState<boolean>(false);

  // feedback errors to trigger modal resize
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([]);

  // handler to set bond as a string
  const handleSetBond = (newBond: { bond: BigNumber }) => {
    setBond({ bond: newBond.bond.toString() });
  };

  // bond minus tx fees.
  const enoughToCoverTxFees: boolean = freeToBond
    .minus(bond.bond)
    .isGreaterThan(planckToUnit(largestTxFee, units));

  // bond value after max tx fees have been deducated.
  let bondAfterTxFees: BigNumber;

  if (enoughToCoverTxFees) {
    bondAfterTxFees = unitToPlanck(String(bond.bond), units);
  } else {
    bondAfterTxFees = BigNumber.max(
      unitToPlanck(String(bond.bond), units).minus(largestTxFee),
      0
    );
  }

  // the actual bond tx to submit
  const getTx = (bondToSubmit: BigNumber) => {
    if (!api || !activeAccount.address) {
      return null;
    }
    const bondAsString = !bondValid
      ? '0'
      : bondToSubmit.isNaN()
        ? '0'
        : bondToSubmit.toString();

    return Staking.bondExtra(bondAsString);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(bondAfterTxFees),
    from: activeAccount.address,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(activeAccount.address, false);

  // update bond value on task change.
  useEffect(() => {
    handleSetBond({ bond: freeToBond });
  }, [freeToBond.toString()]);

  // modal resize on form update
  useEffect(
    () => setModalResize(),
    [bond, bondValid, notEnoughFunds, feedbackErrors.length, warnings.length]
  );

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('addToBond')}</h2>
        <BondFeedback
          syncing={largestTxFee.isZero()}
          bondFor={bondFor}
          listenIsValid={(valid, errors) => {
            setBondValid(valid);
            setFeedbackErrors(errors);
          }}
          defaultBond={null}
          setters={[handleSetBond]}
          parentErrors={warnings}
          txFees={largestTxFee}
        />
        <p>{t('newlyBondedFunds')}</p>
      </ModalPadding>
      <SubmitTx valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
