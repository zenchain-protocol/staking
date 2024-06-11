import type { TxData } from './index';
import { encodeFunctionData } from 'viem';
import NativeFastUnstake from '../../config/abis/NativeFastUnstake.json';
import { FAST_UNSTAKE_ADDRESS } from '../../consts';

enum FastUnstakeMethods {
  registerFastUnstake = 'registerFastUnstake',
  deregister = 'deregister',
}

const createTxData = (
  method: FastUnstakeMethods,
  args?: unknown[]
): TxData => ({
  to: FAST_UNSTAKE_ADDRESS,
  calldata: encodeFunctionData({
    abi: NativeFastUnstake,
    functionName: method,
    args,
  }),
});

export const FastUnstake = {
  registerFastUnstake: (): TxData =>
    createTxData(FastUnstakeMethods.registerFastUnstake),

  deregister: (): TxData => createTxData(FastUnstakeMethods.deregister),
};
