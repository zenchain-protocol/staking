// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOverlay } from 'kits/Overlay/Provider';
import { GenerateNominations } from 'library/GenerateNominations';
import { useEffect, useState } from 'react';
import { Subheading } from 'pages/Nominate/Wrappers';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { usePrompt } from 'contexts/Prompt';
import { useHelp } from 'contexts/Help';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useBonded } from 'contexts/Bonded';
import { SubmitTx } from 'library/SubmitTx';
import type {
  NominationSelection,
  NominationSelectionWithResetCounter,
} from 'library/GenerateNominations/types';
import { RevertPrompt } from './Prompts/RevertPrompt';
import { CanvasFullScreenWrapper, CanvasSubmitTxFooter } from '../Wrappers';
import { NotificationsController } from 'controllers/NotificationsController';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { useAccount } from 'wagmi';

import { Staking } from '../../model/transactions';

export const ManageNominations = () => {
  const { t } = useTranslation('library');
  const {
    closeCanvas,
    setCanvasStatus,
    config: { options },
  } = useOverlay().canvas;
  const { openHelp } = useHelp();
  const { consts } = useApi();
  const { getBondedAccount } = useBonded();
  const activeAccount = useAccount();
  const { openPromptWith, closePrompt } = usePrompt();

  const { maxNominations } = consts;
  const signingAccount = getBondedAccount(activeAccount.address);

  // Valid to submit transaction.
  const [valid, setValid] = useState<boolean>(false);

  // Default nominators, from canvas options.
  const [defaultNominations, setDefaultNominations] =
    useState<NominationSelectionWithResetCounter>({
      nominations: [...(options?.nominated || [])],
      reset: 0,
    });

  // Current nominator selection, defaults to defaultNominations.
  const [newNominations, setNewNominations] = useState<NominationSelection>({
    nominations: options?.nominated || [],
  });

  // Handler for updating setup.
  const handleSetupUpdate = (value: NominationSelection) => {
    setNewNominations(value);
  };

  // Handler for reverting nomination updates.
  const handleRevertChanges = () => {
    setNewNominations({ nominations: [...defaultNominations.nominations] });
    setDefaultNominations({
      nominations: defaultNominations.nominations,
      reset: defaultNominations.reset + 1,
    });
    NotificationsController.emit({
      title: t('nominationsReverted'),
      subtitle: t('revertedToActiveSelection'),
    });
    closePrompt();
  };

  // Check if default nominations match new ones.
  const nominationsMatch = () =>
    newNominations.nominations.every((n) =>
      defaultNominations.nominations.find((d) => d.address === n.address)
    ) &&
    newNominations.nominations.length > 0 &&
    newNominations.nominations.length === defaultNominations.nominations.length;

  // Tx to submit.
  const getTx = () => {
    if (!valid) {
      return null;
    }

    // Note: `targets` structure differs between staking and pools.
    const targetsToSubmit = newNominations.nominations.map(
      (nominee) => nominee.address
    );

    return Staking.nominate(targetsToSubmit);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setCanvasStatus('closing');
    },
  });

  // Valid if there are between 1 and `maxNominations` nominations.
  useEffect(() => {
    setValid(
      maxNominations.isGreaterThanOrEqualTo(
        newNominations.nominations.length
      ) &&
        newNominations.nominations.length > 0 &&
        !nominationsMatch()
    );
  }, [newNominations]);

  return (
    <>
      <CanvasFullScreenWrapper>
        <div className="head">
          <ButtonPrimaryInvert
            text={t('revertChanges', { ns: 'modals' })}
            lg
            onClick={() => {
              openPromptWith(<RevertPrompt onRevert={handleRevertChanges} />);
            }}
            disabled={
              newNominations.nominations === defaultNominations.nominations
            }
          />
          <ButtonPrimary
            text={t('cancel', { ns: 'library' })}
            lg
            onClick={() => closeCanvas()}
            iconLeft={faTimes}
            style={{ marginLeft: '1.1rem' }}
          />
        </div>
        <h1>{t('manageNominations', { ns: 'modals' })}</h1>

        <Subheading>
          <h3 style={{ marginBottom: '1.5rem' }}>
            {t('chooseValidators', {
              ns: 'library',
              maxNominations: maxNominations.toString(),
            })}
            <ButtonHelp
              onClick={() => openHelp('Nominations')}
              background="none"
              outline
            />
          </h3>
        </Subheading>

        <GenerateNominations
          displayFor="canvas"
          setters={[
            {
              current: {
                callable: true,
                fn: () => newNominations,
              },
              set: handleSetupUpdate,
            },
          ]}
          nominations={newNominations}
        />
      </CanvasFullScreenWrapper>
      <CanvasSubmitTxFooter>
        <SubmitTx
          noMargin
          fromController={true}
          valid={valid}
          displayFor="canvas"
          {...submitExtrinsic}
        />
      </CanvasSubmitTxFooter>
    </>
  );
};
