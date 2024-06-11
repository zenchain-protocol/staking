import { useCallback } from 'react';
import type { MaybeAddress } from '../../types';
import type { Connection } from 'wagmi';
import { useConnections } from 'wagmi';

export const useGetConnection = (): {
  getConnection: (who: MaybeAddress) => Connection | null;
} => {
  const connections = useConnections();
  return {
    getConnection: useCallback(
      (who: MaybeAddress) => {
        if (!who) {
          return null;
        }
        for (const connection of connections) {
          if (connection.accounts.includes(who as `0x${string}`)) {
            return connection;
          }
        }
        return null;
      },
      [connections]
    ),
  };
};
