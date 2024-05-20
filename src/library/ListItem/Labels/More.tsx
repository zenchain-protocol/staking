// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

export const More = ({
  disabled,
}: {
  setActiveTab: (t: number) => void;
  disabled: boolean;
}) => {
  const { t } = useTranslation('tips');

  return (
    <div className="label button-with-text">
      <button type="button" disabled={disabled}>
        {t('module.more')}
        <FontAwesomeIcon icon={faCaretRight} transform="shrink-2" />
      </button>
    </div>
  );
};
