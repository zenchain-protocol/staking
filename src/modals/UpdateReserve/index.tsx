// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { planckToUnit, unitToPlanck } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useTransferOptions } from 'contexts/TransferOptions';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { Close } from 'library/Modal/Close';
import { Title } from 'library/Modal/Title';
import { SliderWrapper } from 'modals/UpdateReserve/Wrappers';
import 'rc-slider/assets/index.css';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { StyledSlider } from 'library/StyledSlider';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { useAccount } from 'wagmi';

export const UpdateReserve = () => {
  const { t } = useTranslation('modals');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { openHelp } = useHelp();
  const { setModalStatus } = useOverlay().modal;
  const activeAccount = useAccount();
  const { feeReserve, setFeeReserveBalance, getTransferOptions } =
    useTransferOptions();

  const { edReserved } = getTransferOptions(activeAccount.address);
  const minReserve = planckToUnit(edReserved, units);
  const maxReserve = minReserve.plus(3);

  const [sliderReserve, setSliderReserve] = useState<number>(
    planckToUnit(feeReserve, units).plus(minReserve).decimalPlaces(3).toNumber()
  );

  const handleChange = (val: BigNumber) => {
    // deduct ED from reserve amount.
    val = val.decimalPlaces(3);
    const actualReserve = BigNumber.max(val.minus(minReserve), 0).toNumber();
    const actualReservePlanck = unitToPlanck(actualReserve.toString(), units);
    setSliderReserve(val.decimalPlaces(3).toNumber());
    setFeeReserveBalance(actualReservePlanck);
  };

  return (
    <>
      <Close />
      <ModalPadding>
        <Title
          title={t('reserveBalance')}
          helpKey="Reserve Balance"
          style={{ padding: '0.5rem 0 0 0' }}
        />
        <SliderWrapper style={{ marginTop: '1rem' }}>
          <p>{t('reserveText', { unit })}</p>
          <div>
            <StyledSlider
              classNaame="no-padding"
              min={0}
              max={maxReserve.toNumber()}
              value={sliderReserve}
              step={0.01}
              onChange={(val) => {
                if (typeof val === 'number' && val >= minReserve.toNumber()) {
                  handleChange(new BigNumber(val));
                }
              }}
            />
          </div>

          <div className="stats">
            <CardHeaderWrapper>
              <h4>
                {t('reserveForExistentialDeposit')}
                <FontAwesomeIcon
                  icon={faLock}
                  transform="shrink-3"
                  style={{ marginLeft: '0.5rem' }}
                />
              </h4>
              <h2>
                {minReserve.isZero() ? (
                  <>
                    {t('none')}
                    <ButtonHelp
                      onClick={() =>
                        openHelp('Reserve Balance For Existential Deposit')
                      }
                      style={{ marginLeft: '0.65rem' }}
                    />
                  </>
                ) : (
                  `${minReserve.decimalPlaces(4).toString()} ${unit}`
                )}
              </h2>
            </CardHeaderWrapper>

            <CardHeaderWrapper>
              <h4>{t('reserveForTxFees')}</h4>
              <h2>
                {BigNumber.max(
                  new BigNumber(sliderReserve)
                    .minus(minReserve)
                    .decimalPlaces(4)
                    .toString(),
                  0
                ).toString()}
                &nbsp;
                {unit}
              </h2>
            </CardHeaderWrapper>
          </div>

          <div className="done">
            <ButtonPrimaryInvert
              text={t('done')}
              onClick={() => setModalStatus('closing')}
              disabled={!activeAccount.address}
            />
          </div>
        </SliderWrapper>
      </ModalPadding>
    </>
  );
};
