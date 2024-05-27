import type { Abi } from 'viem';
import { parseAbi } from 'viem';

export interface ViemCall {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args: string[];
}

export const ensRegistryAbi = parseAbi([
  'function resolver(bytes32 node) external view returns (address)',
]);

export const ensResolverAbi = parseAbi([
  'function name(bytes32 node) external view returns (string)',
]);
