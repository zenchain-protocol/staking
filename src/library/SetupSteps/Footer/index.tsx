// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { FooterProps } from '../types';
import { Wrapper } from './Wrapper';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';

export const Footer = ({ complete }: FooterProps) => {
  const { t } = useTranslation('library');
  const { activeAccount } = useActiveAccounts();
  const { getNominatorSetup, setActiveAccountSetupSection } = useSetup();

  const setup = getNominatorSetup(activeAccount);

  return (
    <Wrapper>
      <section>
        {complete ? (
          <ButtonPrimary
            lg
            text={t('continue')}
            onClick={() => setActiveAccountSetupSection(setup.section + 1)}
          />
        ) : (
          <div style={{ opacity: 0.5 }}>
            <ButtonPrimary text={t('continue')} disabled lg />
          </div>
        )}
      </section>
    </Wrapper>
  );
};
