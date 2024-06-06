import type { PublicClient } from 'viem';

export * from './multicall';
export * from './nativeStaking';
export * from './nativeFastUnstake';

export interface TxData {
  to: `0x${string}`;
  calldata: `0x${string}`;
}

export const estimateTxFee = async (
  client: PublicClient,
  txData: TxData
): Promise<bigint | undefined> => {
  try {
    const gas = await client.estimateGas({
      account: client.account,
      to: txData.to,
      data: txData.to,
    });
    const gasPrice = await client.getGasPrice();
    return gas * gasPrice;
  } catch (error) {
    console.error('Error estimating gas:', error);
    return undefined;
  }
};
