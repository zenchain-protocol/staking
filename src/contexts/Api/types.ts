// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import type { AnyJson, NetworkName } from '../../types';
import type { ApiStatus, ConnectionType } from 'model/Api/types';

export interface APIProviderProps {
  children: ReactNode;
  network: NetworkName;
}

export interface APIChainState {
  chain: string | null;
  version: AnyJson;
  ss58Prefix: number;
}

export interface APIConstants {
  bondDuration: BigNumber;
  maxNominations: BigNumber;
  sessionsPerEra: BigNumber;
  maxExposurePageSize: BigNumber;
  historyDepth: BigNumber;
  maxElectingVoters: BigNumber;
  expectedBlockTime: BigNumber;
  epochDuration: BigNumber;
  existentialDeposit: BigNumber;
  fastUnstakeDeposit: BigNumber;
}

export interface APINetworkMetrics {
  totalIssuance: BigNumber;
  fastUnstakeErasToCheckPerBlock: number;
  minimumActiveStake: BigNumber;
}

export interface APIActiveEra {
  index: BigNumber;
  start: BigNumber;
}

export interface APIStakingMetrics {
  totalNominators: BigNumber;
  totalValidators: BigNumber;
  lastReward: BigNumber;
  lastTotalStake: BigNumber;
  validatorCount: BigNumber;
  maxValidatorsCount: BigNumber;
  minNominatorBond: BigNumber;
  totalStaked: BigNumber;
}

export interface APIContextInterface {
  api: ApiPromise | null;
  chainState: APIChainState;
  isReady: boolean;
  apiStatus: ApiStatus;
  connectionType: ConnectionType;
  setConnectionType: (connectionType: ConnectionType) => void;
  rpcEndpoint: string;
  setRpcEndpoint: (key: string) => void;
  consts: APIConstants;
  networkMetrics: APINetworkMetrics;
  activeEra: APIActiveEra;
  stakingMetrics: APIStakingMetrics;
}
