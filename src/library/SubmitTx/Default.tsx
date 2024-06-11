// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import type { ReactNode } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import type { SubmitProps } from './types';
import { ButtonSubmit } from 'kits/Buttons/ButtonSubmit';
import { ButtonSubmitLarge } from './ButtonSubmitLarge';
import { appendOrEmpty } from '@w3ux/utils';

export const Default = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const { txFeesValid } = useTxMeta();

  const disabled = submitting || !valid || !txFeesValid;

  return (
    <>
      <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
        <div>
          <EstimatedTxFee />
        </div>
        <div>
          {buttons}
          {displayFor !== 'card' && (
            <ButtonSubmit
              lg={displayFor === 'canvas'}
              text={submitText || ''}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => onSubmit()}
              disabled={disabled}
              pulse={!disabled}
            />
          )}
        </div>
      </div>
      {displayFor === 'card' && (
        <ButtonSubmitLarge
          disabled={disabled}
          onSubmit={onSubmit}
          submitText={submitText || ''}
          icon={faArrowAltCircleUp}
          pulse={!disabled}
        />
      )}
    </>
  );
};
