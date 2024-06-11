// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHelp } from 'contexts/Help';
import { usePlugins } from 'contexts/Plugins';
import { useStaking } from 'contexts/Staking';
import { Wrapper } from './Wrapper';
import type { StatusLabelProps } from './types';
import { useSyncing } from 'hooks/useSyncing';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';

export const StatusLabel = ({
  title,
  helpKey,
  hideIcon,
  statusFor,
  topOffset = '40%',
  status = 'sync_or_setup',
}: StatusLabelProps) => {
  const { openHelp } = useHelp();
  const { syncing } = useSyncing();
  const { plugins } = usePlugins();
  const { inSetup } = useStaking();

  // syncing or not staking
  if (status === 'sync_or_setup') {
    if (syncing || !inSetup()) {
      return null;
    }
  }

  if (status === 'active_service' && statusFor) {
    if (plugins.includes(statusFor)) {
      return null;
    }
  }

  return (
    <Wrapper $topOffset={topOffset}>
      <div>
        {hideIcon !== true && <FontAwesomeIcon icon={faExclamationTriangle} />}
        <h2>
          &nbsp;&nbsp;
          {title}
          {helpKey ? (
            <span>
              <ButtonHelp
                marginLeft
                onClick={() => openHelp(helpKey)}
                background="secondary"
              />
            </span>
          ) : null}
        </h2>
      </div>
    </Wrapper>
  );
};
