import type { Abi } from 'viem';
import { encodeFunctionData, parseAbi } from 'viem';
import { MULTICALL3_ADDRESS } from '../../consts';
import type { TxData } from './index';

const multicall3Abi: Abi = parseAbi([
  'function aggregate3(Call3[] calldata calls) public payable returns (Result[] memory returnData)',
]);

interface Call3 {
  target: `0x${string}`;
  allowFailure: boolean;
  callData: `0x${string}`;
}

export const createBatchCall = (transactions: TxData[]): TxData => {
  if (transactions.length === 1) {
    return transactions[0];
  }
  const calls: Call3[] = transactions.map((txData) => ({
    target: txData.to,
    callData: txData.calldata,
    allowFailure: false,
  }));
  return {
    to: MULTICALL3_ADDRESS,
    calldata: encodeFunctionData({
      abi: multicall3Abi,
      functionName: 'aggregate3',
      args: [calls],
    }),
  };
};
