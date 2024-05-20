// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCog, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useStaking } from 'contexts/Staking';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'hooks/useUnstaking';
import { ValidatorList } from 'library/ValidatorList';
import type { MaybeAddress } from 'types';
import { useOverlay } from 'kits/Overlay/Provider';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { ListStatusHeader } from 'library/List';
import { Wrapper } from './Wrapper';
import { useSyncing } from 'hooks/useSyncing';
import { useBalances } from 'contexts/Balances';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';

export const Nominations = ({
  bondFor,
  nominator,
}: {
  bondFor: 'nominator';
  nominator: MaybeAddress;
}) => {
  const { t } = useTranslation('pages');
  const { openHelp } = useHelp();
  const { inSetup } = useStaking();
  const {
    modal: { openModal },
    canvas: { openCanvas },
  } = useOverlay();
  const { syncing } = useSyncing(['balances', 'era-stakers']);
  const { getNominations } = useBalances();
  const { isFastUnstaking } = useUnstaking();
  const { formatWithPrefs } = useValidators();
  const { activeAccount } = useActiveAccounts();
  const { isReadOnlyAccount } = useImportedAccounts();

  // Derive nominations from `bondFor` type.
  const nominated =
    bondFor === 'nominator'
      ? formatWithPrefs(getNominations(activeAccount))
      : [];

  // Determine whether to display buttons.
  //
  // If regular staking and nominating, or if pool and account is nominator or root, display stop
  // button.
  const displayBtns = nominated.length;

  // Determine whether buttons are disabled.
  const btnsDisabled =
    inSetup() || syncing || isReadOnlyAccount(activeAccount) || isFastUnstaking;

  return (
    <Wrapper>
      <CardHeaderWrapper $withAction $withMargin>
        <h3>
          {t('nominate.nominations')}
          <ButtonHelp marginLeft onClick={() => openHelp('Nominations')} />
        </h3>
        <div>
          {displayBtns && (
            <>
              <ButtonPrimary
                text={t('nominate.stop')}
                iconLeft={faStopCircle}
                iconTransform="grow-1"
                disabled={btnsDisabled}
                onClick={() =>
                  openModal({
                    key: 'StopNominations',
                    options: {
                      nominations: [],
                      bondFor,
                    },
                    size: 'sm',
                  })
                }
              />
              <ButtonPrimary
                text={t('nominate.manage')}
                iconLeft={faCog}
                iconTransform="grow-1"
                disabled={btnsDisabled}
                marginLeft
                onClick={() =>
                  openCanvas({
                    key: 'ManageNominations',
                    scroll: false,
                    options: {
                      bondFor,
                      nominator,
                      nominated,
                    },
                    size: 'xl',
                  })
                }
              />
            </>
          )}
        </div>
      </CardHeaderWrapper>
      {syncing ? (
        <ListStatusHeader>{`${t('nominate.syncing')}...`}</ListStatusHeader>
      ) : !nominator ? (
        <ListStatusHeader>{t('nominate.notNominating')}.</ListStatusHeader>
      ) : (nominated?.length || 0) > 0 ? (
        <ValidatorList
          bondFor={bondFor}
          validators={nominated || []}
          nominator={nominator}
          format="nomination"
          refetchOnListUpdate
          allowMoreCols
          allowListFormat={false}
        />
      ) : (
        <ListStatusHeader>{t('nominate.notNominating')}.</ListStatusHeader>
      )}
    </Wrapper>
  );
};
