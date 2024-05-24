// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise, WsProvider } from '@polkadot/api';
import type { VoidFn } from '@polkadot/api/types';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import BigNumber from 'bignumber.js';
import { defaultActiveEra } from 'contexts/Api/defaults';
import type {
  APIActiveEra,
  APIConstants,
  APINetworkMetrics,
  APIStakingMetrics,
} from 'contexts/Api/types';
import { SyncController } from 'controllers/SyncController';
import type { AnyApi, NetworkName } from 'types';
import { NetworkList } from 'config/networks';
import { makeCancelable, rmCommas, stringToBigNumber } from '@w3ux/utils';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type {
  APIEventDetail,
  ConnectionType,
  EventApiStatus,
  SubstrateConnect,
} from './types';
import { WellKnownChain } from '@substrate/connect';
import * as ZenchainTestnetChainSpec from 'config/chain-specs/zenchain_testnet.json';

export class Api {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Network config fallback values.
  // TODO: Explore how these values can be removed.
  FALLBACK = {
    MAX_NOMINATIONS: new BigNumber(16),
    BONDING_DURATION: new BigNumber(28),
    SESSIONS_PER_ERA: new BigNumber(6),
    MAX_ELECTING_VOTERS: new BigNumber(22500),
    EXPECTED_BLOCK_TIME: new BigNumber(6000),
    EPOCH_DURATION: new BigNumber(2400),
  };

  // The network name associated with this Api instance.
  network: NetworkName;

  // API provider.
  #provider: WsProvider | ScProvider;

  // API instance.
  #api: ApiPromise;

  // The current RPC endpoint.
  #rpcEndpoint: string;

  // The current connection type.
  #connectionType: ConnectionType;

  // Unsubscribe objects.
  #unsubs: Record<string, VoidFn> = {};

  // Cancel function of dynamic substrate connect import.
  cancelFn: () => void;

  // Store the active era.
  activeEra: APIActiveEra = defaultActiveEra;

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  get api() {
    return this.#api;
  }

  get connectionType() {
    return this.#connectionType;
  }

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(network: NetworkName) {
    this.network = network;
  }

  // ------------------------------------------------------
  // Initialization.
  // ------------------------------------------------------

  // Class initialization. Sets the `provider` and `api` class members.
  async initialize(type: ConnectionType, rpcEndpoint: string) {
    // Add initial syncing items. Even though `initialization` is added by default, it is called
    // again here in case a new API is initialized.
    SyncController.dispatch('initialization', 'syncing');

    // Persist the network to local storage.
    localStorage.setItem('network', this.network);

    // Set connection metadata.
    this.#rpcEndpoint = rpcEndpoint;
    this.#connectionType = type;

    // Connect to api.
    await this.connect();
  }

  // Connect to Api instance.
  async connect() {
    try {
      // Initiate provider based on connection type.
      if (this.#connectionType === 'ws') {
        this.initWsProvider();
      } else {
        await this.initScProvider();
      }

      // Tell UI api is connecting.
      this.dispatchEvent(this.ensureEventStatus('connecting'));

      // Initialise api.
      this.#api = new ApiPromise({ provider: this.#provider });

      // Initialise api events.
      this.initApiEvents();

      // Wait for api to be ready.
      await this.#api.isReady;
    } catch (e) {
      // TODO: report a custom api status error that can flag to the UI the rpcEndpoint failed -
      // retry or select another one. Useful for custom endpoint configs.
      // this.dispatchEvent(this.ensureEventStatus('error'));
    }
  }

  // ------------------------------------------------------
  // Provider initialization.
  // ------------------------------------------------------

  // Initiate Websocket Provider.
  initWsProvider() {
    this.#provider = new WsProvider(
      NetworkList[this.network].endpoints.rpcEndpoints[this.#rpcEndpoint]
    );
  }

  // Dynamically load and connect to Substrate Connect.
  async initScProvider() {
    // Dynamically load Substrate Connect.
    const ScPromise = makeCancelable(import('@substrate/connect'));
    this.cancelFn = ScPromise.cancel;
    const Sc = (await ScPromise.promise) as SubstrateConnect;

    // Get chain spec
    const chainSpec =
      this.network === 'polkadot'
        ? WellKnownChain[
            NetworkList[this.network].endpoints.lightClient as WellKnownChain
          ]
        : JSON.stringify(ZenchainTestnetChainSpec);

    // Instantiate provider and connect
    this.#provider = new ScProvider(Sc, chainSpec);
    await this.#provider.connect();
  }

  // ------------------------------------------------------
  // Event handling.
  // ------------------------------------------------------

  // Set up API event listeners. Sends information to the UI.
  async initApiEvents() {
    this.#api.on('ready', async () => {
      this.dispatchEvent(this.ensureEventStatus('ready'));
    });

    this.#api.on('connected', () => {
      this.dispatchEvent(this.ensureEventStatus('connected'));
    });

    this.#api.on('disconnected', () => {
      this.dispatchEvent(this.ensureEventStatus('disconnected'));
    });

    this.#api.on('error', () => {
      this.dispatchEvent(this.ensureEventStatus('error'));
    });
  }

  // Handler for dispatching events.
  dispatchEvent(
    status: EventApiStatus,
    options?: {
      err?: string;
    }
  ) {
    const detail: APIEventDetail = {
      network: this.network,
      status,
      type: this.#connectionType,
      rpcEndpoint: this.#rpcEndpoint,
    };
    if (options?.err) {
      detail['err'] = options.err;
    }
    document.dispatchEvent(new CustomEvent('api-status', { detail }));
  }

  // ------------------------------------------------------
  // Bootstrap from network.
  // ------------------------------------------------------

  // Subscribe to block number.
  subscribeBlockNumber = async (): Promise<void> => {
    if (this.#unsubs['blockNumber'] === undefined) {
      // Get block numbers.
      const unsub = await this.api.query.system.number((num: BlockNumber) => {
        document.dispatchEvent(
          new CustomEvent(`new-block-number`, {
            detail: { blockNumber: num.toString() },
          })
        );
      });

      // Block number subscription now initialised. Store unsub.
      this.#unsubs['blockNumber'] = unsub as unknown as VoidFn;
    }
  };

  // Fetch network config to bootstrap UI state.
  bootstrapNetworkConfig = async (): Promise<{
    consts: APIConstants;
    networkMetrics: APINetworkMetrics;
    activeEra: APIActiveEra;
    stakingMetrics: APIStakingMetrics;
  }> => {
    // Fetch network constants.
    const allPromises = [
      this.api.consts.staking.bondingDuration,
      this.api.consts.staking.maxNominations,
      this.api.consts.staking.sessionsPerEra,
      this.api.consts.electionProviderMultiPhase.maxElectingVoters,
      this.api.consts.babe.expectedBlockTime,
      this.api.consts.babe.epochDuration,
      this.api.consts.balances.existentialDeposit,
      this.api.consts.staking.historyDepth,
      this.api.consts.fastUnstake.deposit,
      this.api.consts.staking.maxExposurePageSize,
    ];

    const consts = await Promise.all(allPromises);

    // Fetch the active era. Needed for previous era and for queries below.
    const activeEra = JSON.parse(
      ((await this.api.query.staking.activeEra()) as AnyApi)
        .unwrapOrDefault()
        .toString()
    );
    // Store active era.
    this.activeEra = {
      index: new BigNumber(activeEra.index),
      start: new BigNumber(activeEra.start),
    };
    // Get previous era.
    const previousEra = BigNumber.max(
      0,
      new BigNumber(activeEra.index).minus(1)
    );

    // Fetch network configuration.
    const networkMetrics = await this.api.queryMulti([
      // Network metrics.
      this.api.query.balances.totalIssuance,
      this.api.query.fastUnstake.erasToCheckPerBlock,
      this.api.query.staking.minimumActiveStake,
      // Staking metrics.
      this.api.query.staking.counterForNominators,
      this.api.query.staking.counterForValidators,
      this.api.query.staking.maxValidatorsCount,
      this.api.query.staking.validatorCount,
      [this.api.query.staking.erasValidatorReward, previousEra.toString()],
      [this.api.query.staking.erasTotalStake, previousEra.toString()],
      this.api.query.staking.minNominatorBond,
      [this.api.query.staking.erasTotalStake, activeEra.index.toString()],
    ]);

    return {
      consts: {
        bondDuration: consts[0]
          ? stringToBigNumber(consts[0].toString())
          : this.FALLBACK.BONDING_DURATION,
        maxNominations: consts[1]
          ? stringToBigNumber(consts[1].toString())
          : this.FALLBACK.MAX_NOMINATIONS,
        sessionsPerEra: consts[2]
          ? stringToBigNumber(consts[2].toString())
          : this.FALLBACK.SESSIONS_PER_ERA,
        maxElectingVoters: consts[3]
          ? stringToBigNumber(consts[3].toString())
          : this.FALLBACK.MAX_ELECTING_VOTERS,
        expectedBlockTime: consts[4]
          ? stringToBigNumber(consts[4].toString())
          : this.FALLBACK.EXPECTED_BLOCK_TIME,
        epochDuration: consts[5]
          ? stringToBigNumber(consts[5].toString())
          : this.FALLBACK.EPOCH_DURATION,
        existentialDeposit: consts[6]
          ? stringToBigNumber(consts[6].toString())
          : new BigNumber(0),
        historyDepth: consts[7]
          ? stringToBigNumber(consts[7].toString())
          : new BigNumber(0),
        fastUnstakeDeposit: consts[8]
          ? stringToBigNumber(consts[8].toString())
          : new BigNumber(0),
        maxExposurePageSize: consts[9]
          ? stringToBigNumber(consts[9].toString())
          : NetworkList[this.network].maxExposurePageSize,
      },
      networkMetrics: {
        totalIssuance: new BigNumber(networkMetrics[0].toString()),
        fastUnstakeErasToCheckPerBlock: Number(
          rmCommas(networkMetrics[1].toString())
        ),
        minimumActiveStake: new BigNumber(networkMetrics[2].toString()),
      },
      activeEra,
      stakingMetrics: {
        totalNominators: stringToBigNumber(networkMetrics[3].toString()),
        totalValidators: stringToBigNumber(networkMetrics[4].toString()),
        maxValidatorsCount: stringToBigNumber(networkMetrics[5].toString()),
        validatorCount: stringToBigNumber(networkMetrics[6].toString()),
        lastReward: stringToBigNumber(networkMetrics[7].toString()),
        lastTotalStake: stringToBigNumber(networkMetrics[8].toString()),
        minNominatorBond: stringToBigNumber(networkMetrics[9].toString()),
        totalStaked: stringToBigNumber(networkMetrics[10].toString()),
      },
    };
  };

  // ------------------------------------------------------
  // Subscription handling.
  // ------------------------------------------------------

  // Subscribe to network metrics.
  subscribeNetworkMetrics = async (): Promise<void> => {
    if (this.#unsubs['networkMetrics'] === undefined) {
      const unsub = await this.api.queryMulti(
        [
          this.api.query.balances.totalIssuance,
          this.api.query.fastUnstake.erasToCheckPerBlock,
          this.api.query.staking.minimumActiveStake,
        ],
        (result) => {
          const networkMetrics = {
            totalIssuance: new BigNumber(result[0].toString()),
            fastUnstakeErasToCheckPerBlock: Number(
              rmCommas(result[1].toString())
            ),
            minimumActiveStake: new BigNumber(result[2].toString()),
          };

          document.dispatchEvent(
            new CustomEvent(`new-network-metrics`, {
              detail: { networkMetrics },
            })
          );
        }
      );
      this.#unsubs['networkMetrics'] = unsub as unknown as VoidFn;
    }
  };

  // Subscribe to active era.
  //
  // Also handles (re)subscribing to subscriptions that depend on active era.
  subscribeActiveEra = async (): Promise<void> => {
    const unsub = await this.api.query.staking.activeEra((result: AnyApi) => {
      // determine activeEra: toString used as alternative to `toHuman`, that puts commas in
      // numbers
      const activeEra = JSON.parse(result.unwrapOrDefault().toString());
      // Store active era.
      this.activeEra = {
        index: new BigNumber(activeEra.index),
        start: new BigNumber(activeEra.start),
      };

      // (Re)Subscribe to staking metrics `activeEra` has updated.
      if (this.#unsubs['stakingMetrics']) {
        this.#unsubs['stakingMetrics']();
        delete this.#unsubs['stakingMetrics'];
      }
      this.subscribeStakingMetrics();

      // NOTE: Sending `activeEra` to document as a strings. UI needs to parse values into
      // BigNumber.
      document.dispatchEvent(
        new CustomEvent(`new-active-era`, {
          detail: { activeEra },
        })
      );
    });
    this.#unsubs['activeEra'] = unsub as unknown as VoidFn;
  };

  // Subscribe to staking metrics.
  subscribeStakingMetrics = async (): Promise<void> => {
    if (this.#unsubs['stakingMetrics'] === undefined) {
      const previousEra = BigNumber.max(
        0,
        new BigNumber(this.activeEra.index).minus(1)
      );

      const unsub = await this.api.queryMulti(
        [
          this.api.query.staking.counterForNominators,
          this.api.query.staking.counterForValidators,
          this.api.query.staking.maxValidatorsCount,
          this.api.query.staking.validatorCount,
          [this.api.query.staking.erasValidatorReward, previousEra.toString()],
          [this.api.query.staking.erasTotalStake, previousEra.toString()],
          this.api.query.staking.minNominatorBond,
          [
            this.api.query.staking.erasTotalStake,
            this.activeEra.index.toString(),
          ],
        ],
        (result) => {
          const stakingMetrics = {
            totalNominators: stringToBigNumber(result[0].toString()),
            totalValidators: stringToBigNumber(result[1].toString()),
            maxValidatorsCount: stringToBigNumber(result[2].toString()),
            validatorCount: stringToBigNumber(result[3].toString()),
            lastReward: stringToBigNumber(result[4].toString()),
            lastTotalStake: stringToBigNumber(result[5].toString()),
            minNominatorBond: stringToBigNumber(result[6].toString()),
            totalStaked: stringToBigNumber(result[7].toString()),
          };

          document.dispatchEvent(
            new CustomEvent(`new-staking-metrics`, {
              detail: { stakingMetrics },
            })
          );
        }
      );
      this.#unsubs['stakingMetrics'] = unsub as unknown as VoidFn;
    }
  };

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Ensures the provided status is a valid `EventStatus` being passed, or falls back to `error`.
  ensureEventStatus = (status: string | EventApiStatus): EventApiStatus => {
    const eventStatus: string[] = [
      'connecting',
      'connected',
      'disconnected',
      'ready',
      'error',
      'destroyed',
    ];
    if (eventStatus.includes(status)) {
      return status as EventApiStatus;
    }
    return 'error' as EventApiStatus;
  };

  // Unsubscribe from all active subscriptions.
  unsubscribe = () => {
    Object.values(this.#unsubs).forEach((unsub) => {
      unsub();
    });
    this.#unsubs = {};
  };

  // ------------------------------------------------------
  // Disconnect.
  // ------------------------------------------------------

  // Disconnect gracefully from API and provider.
  async disconnect(destroy = false) {
    this.unsubscribe();

    // Disconnect provider and api.
    await this.#provider?.disconnect();
    await this.#api?.disconnect();

    // Tell UI Api is destroyed.
    if (destroy) {
      // NOTE: destroyed event is not currently in use.
      this.dispatchEvent(this.ensureEventStatus('destroyed'));
    }
  }
}
