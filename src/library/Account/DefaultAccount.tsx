// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { remToUnit } from '@w3ux/utils';
import { useTranslation } from 'react-i18next';
import { Polkicon } from '@w3ux/react-polkicon';
import { memo } from 'react';
import { Wrapper } from './Wrapper';
import type { AccountProps } from './types';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const DefaultAccount = ({ value, label }: AccountProps) => {
  const { t } = useTranslation('library');
  const { data: ensName } = useEnsName({
    address: (value ?? undefined) as `0x${string}` | undefined,
    chainId: mainnet.id,
  });

  // Determine account display text. Title takes precedence over value.
  const text: string | null = ensName ? ensName : value ?? null;

  return (
    <Wrapper>
      {label !== undefined && <div className="account-label">{label} </div>}
      {text === null ? (
        <span className="title unassigned">{t('notStaking')}</span>
      ) : (
        <>
          <span className="identicon">
            <Polkicon address={value || ''} size={remToUnit('1.45rem')} />
          </span>
          <span className="title">{text}</span>
        </>
      )}
    </Wrapper>
  );
};

export default memo(DefaultAccount);
