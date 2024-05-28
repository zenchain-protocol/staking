export const ENS_REGISTRY_ADDRESS_MAINNET =
  '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

export const ensRegistryAbi = [
  'function resolver(bytes32 node) external view returns (address)',
];

export const ensResolverAbi = [
  'function name(bytes32 node) external view returns (string)',
];
