// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CallToActionWrapper } from 'library/CallToAction';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApi } from 'contexts/Api';
import type { NewNominatorProps } from '../types';
import { CallToActionLoader } from 'library/Loader/CallToAction';
import { useOverlay } from 'kits/Overlay/Provider';
import { useAccount } from 'wagmi';

export const NewNominator = ({ syncing }: NewNominatorProps) => {
  const { t } = useTranslation();
  const { isReady } = useApi();
  const navigate = useNavigate();
  const { openCanvas } = useOverlay().canvas;
  const activeAccount = useAccount();

  const nominateButtonDisabled = !isReady || !activeAccount.address;

  return (
    <CallToActionWrapper>
      <div className="inner">
        {syncing ? (
          <CallToActionLoader />
        ) : (
          <>
            <section className="standalone">
              <div className="buttons">
                <div
                  className={`button primary standalone${nominateButtonDisabled ? ` disabled` : ``}`}
                >
                  <button
                    onClick={() =>
                      openCanvas({
                        key: 'NominatorSetup',
                        options: {},
                        size: 'xl',
                      })
                    }
                    disabled={nominateButtonDisabled}
                  >
                    {t('nominate.startNominating', { ns: 'pages' })}
                  </button>
                </div>
              </div>
            </section>
            <section>
              <div className="buttons">
                <div className={`button secondary standalone`}>
                  <button onClick={() => navigate('/validators')}>
                    {t('browseValidators', { ns: 'library' })}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      transform="shrink-4"
                    />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </CallToActionWrapper>
  );
};
