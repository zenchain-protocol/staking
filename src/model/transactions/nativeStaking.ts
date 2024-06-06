import type { TxData } from './index';
import { encodeFunctionData } from 'viem';
import * as NativeStaking from '../../config/abis/NativeStaking.json';
import { STAKING_ADDRESS } from '../../consts';

enum StakingMethods {
  bond = 'bond',
  bondExtra = 'bondExtra',
  unbond = 'unbond',
  rebond = 'rebond',
  withdrawUnbonded = 'withdrawUnbonded',
  chill = 'chill',
  nominate = 'nominate',
  setPayee = 'setPayee',
  payoutStakersByPage = 'payoutStakersByPage',
}

const createTxData = (method: StakingMethods, args?: unknown[]): TxData => ({
  to: STAKING_ADDRESS,
  calldata: encodeFunctionData({
    abi: NativeStaking,
    functionName: method,
    args,
  }),
});

export const Staking = {
  bond: (value: string, restakeRewards: boolean): TxData =>
    createTxData(StakingMethods.bond, [value, restakeRewards]),

  bondExtra: (value: string): TxData =>
    createTxData(StakingMethods.bondExtra, [value]),

  unbond: (value: string): TxData =>
    createTxData(StakingMethods.unbond, [value]),

  rebond: (value: string): TxData =>
    createTxData(StakingMethods.rebond, [value]),

  withdrawUnbonded: (numSlashingSpans: number): TxData =>
    createTxData(StakingMethods.withdrawUnbonded, [numSlashingSpans]),

  chill: (): TxData => createTxData(StakingMethods.chill),

  nominate: (targets: string[]): TxData =>
    createTxData(StakingMethods.nominate, [targets]),

  setPayee: (restakeRewards: boolean): TxData =>
    createTxData(StakingMethods.setPayee, [restakeRewards]),

  payoutStakersByPage: (
    validatorStash: `0x${string}`,
    era: number,
    page: number
  ): TxData =>
    createTxData(StakingMethods.payoutStakersByPage, [
      validatorStash,
      era,
      page,
    ]),
};
