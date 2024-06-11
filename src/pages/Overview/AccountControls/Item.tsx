// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, remToUnit } from '@w3ux/utils';
import { useTranslation } from 'react-i18next';
import type { NotificationText } from 'controllers/NotificationsController/types';
import { Polkicon } from '@w3ux/react-polkicon';
import { ItemWrapper } from './Wrappers';
import type { ActiveAccountProps } from './types';
import { NotificationsController } from 'controllers/NotificationsController';

export const Item = ({ address }: ActiveAccountProps) => {
  const { t } = useTranslation('pages');
  const primaryAddress = address || '';

  // click to copy notification
  let notification: NotificationText | null = null;
  if (primaryAddress) {
    notification = {
      title: t('overview.addressCopied'),
      subtitle: primaryAddress,
    };
  }

  return (
    <ItemWrapper>
      <div className="title">
        <h4>
          {address && (
            <>
              <div className="icon">
                <Polkicon address={primaryAddress} size={remToUnit('1.7rem')} />
              </div>
              {ellipsisFn(primaryAddress)}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(primaryAddress);
                  if (notification) {
                    NotificationsController.emit(notification);
                  }
                }}
              >
                <FontAwesomeIcon
                  className="copy"
                  icon={faCopy}
                  transform="shrink-4"
                />
              </button>
            </>
          )}

          {!address ? t('overview.noActiveaddress') : null}
        </h4>
      </div>
    </ItemWrapper>
  );
};
