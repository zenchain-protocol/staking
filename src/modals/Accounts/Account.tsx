// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, planckToUnit } from '@w3ux/utils';
import { useTranslation } from 'react-i18next';
import { Polkicon } from '@w3ux/react-polkicon';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { AccountWrapper } from './Wrappers';
import type { AccountItemProps } from './types';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import { useGetConnection } from '../../hooks/useGetConnection';

export const AccountButton = ({
  label,
  address,
  noBorder = false,
  transferrableBalance,
}: AccountItemProps) => {
  const { t } = useTranslation('modals');
  const { getConnection } = useGetConnection();
  const activeAccount = useAccount();
  const { setModalStatus } = useOverlay().modal;
  const { units, unit } = useNetwork().networkData;

  // Accumulate account data.
  const meta = getConnection(address || '');

  const imported = !!meta;

  // Determine account source icon.
  const Icon = meta?.connector.icon;

  // Determine if this account is active.
  const isActive = activeAccount.isConnected;

  // Handle account click.
  const handleClick = () => {
    if (!imported) {
      return;
    }
    setModalStatus('closing');
  };

  return (
    <AccountWrapper className={isActive ? 'active' : undefined}>
      <div className={noBorder ? 'noBorder' : undefined}>
        <section className="head">
          <button
            type="button"
            onClick={() => handleClick()}
            disabled={!imported}
          >
            <div className="identicon">
              <Polkicon address={address ?? ''} size={23} />
            </div>
            <span className="name">{ellipsisFn(address ?? '')}</span>
            <div className={label === undefined ? `` : label[0]}>
              {label !== undefined ? <h5>{label[1]}</h5> : null}
              {Icon !== undefined ? (
                <span className="icon">
                  <Icon />
                </span>
              ) : null}
            </div>
          </button>
        </section>
        <section className="foot">
          <span className="balance">
            {`${t('free')}: ${planckToUnit(
              transferrableBalance || new BigNumber(0),
              units
            )
              .decimalPlaces(3)
              .toFormat()} ${unit}`}
          </span>
        </section>
      </div>
    </AccountWrapper>
  );
};
