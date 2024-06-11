// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlug, faWallet } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';
import { ConnectedAccount, HeadingWrapper } from './Wrappers';
import { ButtonText } from 'kits/Buttons/ButtonText';
import { useConnections } from 'wagmi';

export const Connect = () => {
  const { t } = useTranslation('library');
  const { openModal } = useOverlay().modal;
  const connections = useConnections();
  const connectedAccounts = connections.flatMap((conn) => conn.accounts);

  return (
    <HeadingWrapper>
      <ConnectedAccount>
        {connectedAccounts.length ? (
          <>
            <ButtonText
              text={t('accounts')}
              iconLeft={faWallet}
              onClick={() => {
                openModal({ key: 'Accounts' });
              }}
              style={{ color: 'white', fontSize: '1.05rem' }}
            />
            <span />
            <ButtonText
              text=""
              iconRight={faPlug}
              iconTransform="grow-1"
              onClick={() => {
                openModal({ key: 'Connect' });
              }}
              style={{ color: 'white', fontSize: '1.05rem' }}
            />
          </>
        ) : (
          <ButtonText
            text={t('connect')}
            iconRight={faPlug}
            iconTransform="grow-1"
            onClick={() => {
              openModal({
                key: connectedAccounts.length ? 'Accounts' : 'Connect',
              });
            }}
            style={{ color: 'white', fontSize: '1.05rem' }}
          />
        )}
      </ConnectedAccount>
    </HeadingWrapper>
  );
};
