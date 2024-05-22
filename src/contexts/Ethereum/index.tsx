import { useContext, createContext, useState, useEffect } from 'react';
import type { EthereumContextInterface, EthereumProviderProps } from './types';
import { defaultEthereumContext } from './defaults';
import { ethers } from 'ethers';
import { NetworkList } from '../../config/networks';

export const EthereumContext = createContext<EthereumContextInterface>(
  defaultEthereumContext
);

export const useEthereum = () => useContext(EthereumContext);

export const EthereumProvider = ({
  children,
  network,
}: EthereumProviderProps) => {
  const [ethereum, setEthereum] = useState<ethers.Provider | null>(null);

  useEffect(() => {
    if (network === 'polkadot') {
      setEthereum(null);
      return;
    }
    if (!ethereum) {
      const networkData = NetworkList[network];
      const defaultEndpointName = networkData.endpoints.defaultRpcEndpoint;
      const jsonRpcEndpoint =
        networkData.endpoints.jsonRpcEndpoints[defaultEndpointName];
      const ethProvider = new ethers.JsonRpcProvider(
        jsonRpcEndpoint,
        networkData.networkish
      );
      setEthereum(ethProvider);
    }
  }, [network]);

  return (
    <EthereumContext.Provider value={{ ethereum }}>
      {children}
    </EthereumContext.Provider>
  );
};
