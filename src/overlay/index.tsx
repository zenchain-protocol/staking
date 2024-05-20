// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { ClaimPayouts } from 'modals/ClaimPayouts';
import { Accounts } from '../modals/Accounts';
import { Bio } from '../modals/Bio';
import { Bond } from '../modals/Bond';
import { StopNominations } from '../modals/StopNominations';
import { ChooseLanguage } from '../modals/ChooseLanguage';
import { ClaimReward } from '../modals/ClaimReward';
import { Connect } from '../modals/Connect';
import { GoToFeedback } from '../modals/GoToFeedback';
import { ImportLedger } from '../modals/ImportLedger';
import { ImportVault } from '../modals/ImportVault';
import { ManageFastUnstake } from '../modals/ManageFastUnstake';
import { Networks } from '../modals/Networks';
import { Settings } from '../modals/Settings';
import { Unbond } from '../modals/Unbond';
import { UnlockChunks } from '../modals/UnlockChunks';
import { Unstake } from '../modals/Unstake';
import { UpdatePayee } from '../modals/UpdatePayee';
import { UpdateReserve } from '../modals/UpdateReserve';
import { ValidatorMetrics } from '../modals/ValidatorMetrics';
import { ValidatorGeo } from '../modals/ValidatorGeo';
import { ManageNominations } from '../canvas/ManageNominations';
import { NominatorSetup } from 'canvas/NominatorSetup';
import { Overlay } from 'kits/Overlay';

export const Overlays = () => {
  const { status } = useHelp();
  return (
    <Overlay
      fallback={ErrorFallbackModal}
      externalOverlayStatus={status}
      modals={{
        Bio,
        Bond,
        StopNominations,
        ChooseLanguage,
        ClaimPayouts,
        ClaimReward,
        Connect,
        Accounts,
        GoToFeedback,
        ImportLedger,
        ImportVault,
        ManageFastUnstake,
        Networks,
        Settings,
        ValidatorMetrics,
        ValidatorGeo,
        UnlockChunks,
        Unstake,
        Unbond,
        UpdatePayee,
        UpdateReserve,
      }}
      canvas={{
        ManageNominations,
        NominatorSetup,
      }}
    />
  );
};
