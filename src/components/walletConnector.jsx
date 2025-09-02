// src/components/WalletConnector.js
import React from "react";
import { useConnection, useActiveAddress } from "@arweave-wallet-kit/react";
import { ConnectButton } from "@arweave-wallet-kit/react"; // Import the button

export default function WalletConnector() {
  const { connected } = useConnection();
  const activeAddress = useActiveAddress();

  const truncateAddress = (address) => {
    return `${address.substring(0, 4)}...${address.substring(
      address.length - 4
    )}`;
  };
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "2px",
        borderRadius: "0.5px",
        maxWidth: "50px",
      }}
    >
      <ConnectButton profileModal={true} showBalance={false} />
    </div>
  );
}
