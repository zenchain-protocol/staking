// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { HeaderProps } from '../types';
import { Wrapper } from './Wrapper';
import { useHelp } from 'contexts/Help';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { ButtonSecondary } from 'kits/Buttons/ButtonSecondary';

export const Header = ({
  title,
  helpKey,
  complete,
  thisSection,
}: HeaderProps) => {
  const { t } = useTranslation('library');
  const { openHelp } = useHelp();
  const { activeAccount } = useActiveAccounts();
  const { getNominatorSetup, setActiveAccountSetupSection } = useSetup();

  const setup = getNominatorSetup(activeAccount);

  return (
    <Wrapper>
      <section>
        <h2>
          {title}
          {helpKey !== undefined ? (
            <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
          ) : null}
        </h2>
      </section>
      <section>
        {complete && (
          <>
            {setup.section !== thisSection && thisSection < setup.section && (
              <span>
                <ButtonSecondary
                  text={t('update')}
                  onClick={() => {
                    setActiveAccountSetupSection(thisSection);
                  }}
                />
              </span>
            )}
            <h4 className="complete">{t('complete')}</h4>
          </>
        )}
      </section>
    </Wrapper>
  );
};
