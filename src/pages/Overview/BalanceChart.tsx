// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { Odometer } from '@w3ux/react-odometer';
import { greaterThanZero, minDecimalPlaces, planckToUnit } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useBalances } from 'contexts/Balances';
import { usePlugins } from 'contexts/Plugins';
import { useTransferOptions } from 'contexts/TransferOptions';
import { BarSegment } from 'library/BarChart/BarSegment';
import { LegendItem } from 'library/BarChart/LegendItem';
import { Bar, BarChartWrapper, Legend } from 'library/BarChart/Wrappers';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { usePrices } from 'hooks/usePrices';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { useSyncing } from 'hooks/useSyncing';
import { ButtonTertiary } from 'kits/Buttons/ButtonTertiary';
import { useAccount } from 'wagmi';

export const BalanceChart = () => {
  const { t } = useTranslation('pages');
  const {
    networkData: {
      units,
      unit,
      brand: { token: Token },
    },
  } = useNetwork();
  const prices = usePrices();
  const { plugins } = usePlugins();
  const { openModal } = useOverlay().modal;
  const activeAccount = useAccount();
  const { getBalance, getLocks } = useBalances();
  const { syncing } = useSyncing(['initialization']);
  const { feeReserve, getTransferOptions } = useTransferOptions();

  const balance = getBalance(activeAccount.address);
  const allTransferOptions = getTransferOptions(activeAccount.address);
  const { edReserved } = allTransferOptions;

  // User's total balance.
  const { free, frozen } = balance;
  const totalBalance = planckToUnit(free, units);
  // Convert balance to fiat value.
  const freeFiat = totalBalance.multipliedBy(
    new BigNumber(prices.lastPrice).decimalPlaces(2)
  );

  // Total funds nominating.
  const nominating = planckToUnit(
    allTransferOptions.nominate.active
      .plus(allTransferOptions.nominate.totalUnlocking)
      .plus(allTransferOptions.nominate.totalUnlocked),
    units
  );

  // Check account non-staking locks.
  const { locks } = getLocks(activeAccount.address);
  const locksStaking = locks.find(({ id }) => id === 'staking');
  const lockStakingAmount = locksStaking
    ? locksStaking.amount
    : new BigNumber(0);

  // Total funds available, including existential deposit, minus staking.
  const graphAvailable = planckToUnit(
    BigNumber.max(free.minus(lockStakingAmount), 0),
    units
  );
  const notStaking = graphAvailable;

  // Graph percentages.
  const graphTotal = nominating.plus(graphAvailable);
  const graphNominating = greaterThanZero(nominating)
    ? nominating.dividedBy(graphTotal.multipliedBy(0.01))
    : new BigNumber(0);

  const graphNotStaking = greaterThanZero(graphTotal)
    ? BigNumber.max(new BigNumber(100).minus(graphNominating), 0)
    : new BigNumber(0);

  // Available balance data.
  const fundsLockedPlank = BigNumber.max(frozen.minus(lockStakingAmount), 0);
  const fundsLocked = planckToUnit(fundsLockedPlank, units);
  let fundsReserved = planckToUnit(edReserved.plus(feeReserve), units);

  const fundsFree = planckToUnit(
    BigNumber.max(allTransferOptions.freeBalance.minus(fundsLockedPlank), 0),
    units
  );

  // Available balance percentages.
  const graphLocked = greaterThanZero(fundsLocked)
    ? fundsLocked.dividedBy(graphAvailable.multipliedBy(0.01))
    : new BigNumber(0);

  const graphFree = greaterThanZero(fundsFree)
    ? fundsFree.dividedBy(graphAvailable.multipliedBy(0.01))
    : new BigNumber(0);

  // Total available balance, including reserve and locks
  if (graphAvailable.isLessThan(fundsReserved)) {
    fundsReserved = graphAvailable;
  }

  // Formatter for price feed.
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const isNominating = greaterThanZero(nominating);

  return (
    <>
      <CardHeaderWrapper>
        <h4>{t('overview.balance')}</h4>
        <h2>
          <Token className="networkIcon" />
          <Odometer
            value={minDecimalPlaces(totalBalance.toFormat(), 2)}
            zeroDecimals={2}
          />
          <span className="note">
            {plugins.includes('coingecko') ? (
              <>&nbsp;{usdFormatter.format(freeFiat.toNumber())}</>
            ) : null}
          </span>
        </h2>
      </CardHeaderWrapper>

      <BarChartWrapper>
        <Legend>
          {isNominating ? (
            <LegendItem dataClass="d1" label={t('overview.nominating')} />
          ) : null}
          <LegendItem dataClass="d4" label={t('overview.notStaking')} />
        </Legend>
        <Bar>
          <BarSegment
            dataClass="d1"
            widthPercent={Number(graphNominating.toFixed(2))}
            flexGrow={!notStaking && isNominating ? 1 : 0}
            label={`${nominating.decimalPlaces(3).toFormat()} ${unit}`}
          />
          <BarSegment
            dataClass="d4"
            widthPercent={Number(graphNotStaking.toFixed(2))}
            flexGrow={!isNominating ? 1 : 0}
            label={`${notStaking.decimalPlaces(3).toFormat()} ${unit}`}
            forceShow={!isNominating}
          />
        </Bar>
        <section className="available">
          <div
            style={{
              flex: 1,
              minWidth: '8.5rem',
              flexBasis: `${
                greaterThanZero(graphFree) && greaterThanZero(graphLocked)
                  ? `${graphFree.toFixed(2)}%`
                  : 'auto'
              }`,
            }}
          >
            <Legend>
              <LegendItem label={t('overview.free')} helpKey="Your Balance" />
            </Legend>
            <Bar>
              <BarSegment
                dataClass="d4"
                widthPercent={100}
                flexGrow={1}
                label={`${fundsFree.decimalPlaces(3).toFormat()} ${unit}`}
              />
            </Bar>
          </div>
          {greaterThanZero(fundsLocked) ? (
            <div
              style={{
                flex: 1,
                minWidth: '8.5rem',
                flexBasis: `${graphLocked.toFixed(2)}%`,
              }}
            >
              <Legend>
                <LegendItem
                  label={t('overview.locked')}
                  helpKey="Reserve Balance"
                />
              </Legend>
              <Bar>
                <BarSegment
                  dataClass="d4"
                  widthPercent={100}
                  flexGrow={1}
                  label={`${fundsLocked.decimalPlaces(3).toFormat()} ${unit}`}
                />
              </Bar>
            </div>
          ) : null}
          <div
            style={{
              flex: 0,
              minWidth: '12.5rem',
              maxWidth: '12.5rem',
              flexBasis: '50%',
            }}
          >
            <Legend className="end">
              <LegendItem
                label=""
                button={
                  <ButtonTertiary
                    text={t('overview.reserveBalance')}
                    onClick={() =>
                      openModal({ key: 'UpdateReserve', size: 'sm' })
                    }
                    iconRight={
                      syncing
                        ? undefined
                        : !feeReserve.isZero() && !edReserved.isZero()
                          ? faCheckDouble
                          : feeReserve.isZero() && edReserved.isZero()
                            ? undefined
                            : faCheck
                    }
                    iconTransform="shrink-1"
                    disabled={!activeAccount.address || syncing}
                  />
                }
              />
            </Legend>
            <Bar>
              <BarSegment
                dataClass="d4"
                widthPercent={100}
                flexGrow={1}
                label={`${fundsReserved.decimalPlaces(3).toFormat()} ${unit}`}
              />
            </Bar>
          </div>
        </section>
      </BarChartWrapper>
    </>
  );
};
