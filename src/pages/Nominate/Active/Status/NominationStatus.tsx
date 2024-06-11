// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBolt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useStaking } from 'contexts/Staking';
import { useNominationStatus } from 'hooks/useNominationStatus';
import { useUnstaking } from 'hooks/useUnstaking';
import { Stat } from 'library/Stat';
import { useOverlay } from 'kits/Overlay/Provider';
import { useSyncing } from 'hooks/useSyncing';
import { useAccount } from 'wagmi';

export const NominationStatus = ({
  showButtons = true,
  buttonType = 'primary',
}: {
  showButtons?: boolean;
  buttonType?: string;
}) => {
  const { t } = useTranslation('pages');
  const { inSetup } = useStaking();
  const { openModal } = useOverlay().modal;
  const { syncing } = useSyncing(['initialization', 'era-stakers', 'balances']);
  const {
    isReady,
    networkMetrics: { fastUnstakeErasToCheckPerBlock },
  } = useApi();
  const activeAccount = useAccount();
  const { checking, isExposed } = useFastUnstake();
  const { getNominationStatus } = useNominationStatus();
  const { getFastUnstakeText, isUnstaking } = useUnstaking();

  const fastUnstakeText = getFastUnstakeText();
  const nominationStatus = getNominationStatus(activeAccount.address);

  // Determine whether to display fast unstake button or regular unstake button.
  const unstakeButton =
    fastUnstakeErasToCheckPerBlock > 0 &&
    !nominationStatus.nominees.active.length &&
    (checking || !isExposed)
      ? {
          disabled: checking,
          title: fastUnstakeText,
          icon: faBolt,
          onClick: () => {
            openModal({ key: 'ManageFastUnstake', size: 'sm' });
          },
        }
      : {
          title: t('nominate.unstake'),
          icon: faSignOutAlt,
          disabled: !isReady || !activeAccount.address,
          onClick: () => openModal({ key: 'Unstake', size: 'sm' }),
        };

  return (
    <Stat
      label={t('nominate.status')}
      helpKey="Nomination Status"
      stat={nominationStatus.message}
      buttons={
        !showButtons || syncing
          ? []
          : !inSetup()
            ? !isUnstaking
              ? [unstakeButton]
              : []
            : []
      }
      buttonType={buttonType}
    />
  );
};
