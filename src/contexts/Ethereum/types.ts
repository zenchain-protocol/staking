import type { ethers } from 'ethers';
import type { ReactNode } from 'react';
import type { NetworkName } from '../../types';

export interface EthereumProviderProps {
  children: ReactNode;
  network: NetworkName;
}

export interface EthereumContextInterface {
  ethereum: ethers.Provider | null;
}
