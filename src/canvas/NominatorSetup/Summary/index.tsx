// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, unitToPlanck } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { usePayeeConfig } from 'hooks/usePayeeConfig';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import type { SetupStepProps } from 'library/SetupSteps/types';
import { SubmitTx } from 'library/SubmitTx';
import { useNetwork } from 'contexts/Network';
import { SummaryWrapper } from './Wrapper';
import { useOverlay } from 'kits/Overlay/Provider';
import { useAccount } from 'wagmi';
import { createBatchCall, Staking } from '../../../model/transactions';

export const Summary = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { getPayeeItems } = usePayeeConfig();
  const { closeCanvas } = useOverlay().canvas;
  const activeAccount = useAccount();
  const { getNominatorSetup, removeSetupProgress } = useSetup();

  const setup = getNominatorSetup(activeAccount.address);
  const { progress } = setup;
  const { bond, nominations, payee } = progress;

  const getTxs = () => {
    if (!activeAccount.address) {
      return null;
    }

    const targetsToSubmit = nominations.map(
      ({ address }: { address: string }) => address
    );

    const payeeToSubmit =
      payee.destination === 'Account'
        ? {
            Account: payee.account,
          }
        : payee.destination;

    const bondToSubmit = unitToPlanck(bond || '0', units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();

    const txs = [
      Staking.bond(bondAsString, payeeToSubmit === 'Staked'),
      Staking.nominate(targetsToSubmit),
    ];
    return createBatchCall(txs);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTxs(),
    from: activeAccount.address,
    shouldSubmit: true,
    callbackInBlock: () => {
      // Close the canvas after the extrinsic is included in a block.
      closeCanvas();

      // Reset setup progress.
      removeSetupProgress(activeAccount.address);
    },
  });

  const payeeDisplay =
    getPayeeItems().find(({ value }) => value === payee.destination)?.title ||
    payee.destination;

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title={t('nominate.summary')}
        bondFor="nominator"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <SummaryWrapper>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('nominate.payoutDestination')}:
            </div>
            <div>
              {payee.destination === 'Account'
                ? `${payeeDisplay}: ${ellipsisFn(payee.account || '')}`
                : payeeDisplay}
            </div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('nominate.nominating')}:
            </div>
            <div>{t('nominate.validator', { count: nominations.length })}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('nominate.bondAmount')}:
            </div>
            <div>
              {new BigNumber(bond || 0).toFormat()} {unit}
            </div>
          </section>
        </SummaryWrapper>
        <div
          style={{
            flex: 1,
            width: '100%',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}
        >
          <SubmitTx
            submitText={t('nominate.startNominating')}
            valid
            {...submitExtrinsic}
            displayFor="canvas" /* Edge case: not canvas, but the larger button sizes suit this UI more. */
          />
        </div>
      </MotionContainer>
    </>
  );
};
