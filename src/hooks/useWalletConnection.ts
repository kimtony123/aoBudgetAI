// hooks/useWalletConnection.ts
import { useActiveAddress } from "@arweave-wallet-kit/react";

export const useWalletConnection = () => {
  const activeAddress = useActiveAddress();
  const isConnected = !!activeAddress; // Convert to boolean: true if address exists, false if null/undefined

  return {
    isConnected,
    activeAddress,
  };
};
