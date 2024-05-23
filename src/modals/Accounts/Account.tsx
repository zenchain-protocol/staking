// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, planckToUnit } from '@w3ux/utils';
import { useTranslation } from 'react-i18next';
import { ExtensionIcons } from '@w3ux/extension-assets/util';
import LedgerSVG from '@w3ux/extension-assets/LedgerSquare.svg?react';
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react';
import { Polkicon } from '@w3ux/react-polkicon';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { AccountWrapper } from './Wrappers';
import type { AccountItemProps } from './types';
import BigNumber from 'bignumber.js';

export const AccountButton = ({
  label,
  address,
  noBorder = false,
  transferrableBalance,
}: AccountItemProps) => {
  const { t } = useTranslation('modals');
  const { getAccount } = useImportedAccounts();
  const { activeAccount, setActiveAccount } = useActiveAccounts();
  const { setModalStatus } = useOverlay().modal;
  const { units, unit } = useNetwork().networkData;

  // Accumulate account data.
  const meta = getAccount(address || '');

  const imported = !!meta;
  const connectTo = address || '';

  // Determine account source icon.
  const Icon =
    meta?.source === 'ledger'
      ? LedgerSVG
      : meta?.source === 'vault'
        ? PolkadotVaultSVG
        : ExtensionIcons[meta?.source || ''] || undefined;

  // Determine if this account is active.
  const isActive = connectTo === activeAccount && address === activeAccount;

  // Handle account click.
  const handleClick = () => {
    if (!imported) {
      return;
    }
    setActiveAccount(getAccount(connectTo)?.address || null);
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
            <span className="name">
              {meta?.name ?? ellipsisFn(address ?? '')}
            </span>
            {meta?.source === 'external' && (
              <div
                className="label warning"
                style={{ color: '#a17703', paddingLeft: '0.5rem' }}
              >
                {t('readOnly')}
              </div>
            )}
            <div className={label === undefined ? `` : label[0]}>
              {label !== undefined ? <h5>{label[1]}</h5> : null}
              {Icon !== undefined ? (
                <span className="icon">
                  <Icon />
                </span>
              ) : null}

              {meta?.source === 'external' && (
                <FontAwesomeIcon
                  icon={faGlasses}
                  className="icon"
                  style={{ opacity: 0.7 }}
                />
              )}
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
