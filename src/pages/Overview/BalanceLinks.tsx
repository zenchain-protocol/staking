// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useNetwork } from 'contexts/Network';
import { MoreWrapper } from './Wrappers';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { Separator } from 'kits/Structure/Separator';
import { useAccount } from 'wagmi';

export const BalanceLinks = () => {
  const { t } = useTranslation('pages');
  const { network } = useNetwork();
  const activeAccount = useAccount();

  return (
    <MoreWrapper>
      <Separator />
      <h4>{t('overview.moreResources')}</h4>
      <section>
        <ButtonPrimaryInvert
          lg
          onClick={() =>
            window.open(
              `https://${network}.subscan.io/account/${activeAccount.address}`,
              '_blank'
            )
          }
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Subscan"
          marginRight
          disabled={!activeAccount.address}
        />
      </section>
    </MoreWrapper>
  );
};
