import { useState, useCallback } from "react";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import { useConnection } from "@arweave-wallet-kit/react";

const trackerProcess = "Ejr_9-PPwg9RV7FFilWIeap6Zm0CdmUEbevGzPwAOd0";

export const useTransactionFetcher = () => {
  const { connected } = useConnection();
  const [isFetching, setIsFetching] = useState(false);

  const fetchTransactions = useCallback(
    async (days: string) => {
      if (!connected) {
        throw new Error("Wallet not connected");
      }

      console.log(days);

      setIsFetching(true);

      try {
        const messageResponse = await message({
          process: trackerProcess,
          tags: [
            { name: "Action", value: "FetchUserTransactionsDays" },
            { name: "days", value: days },
          ],
          signer: createDataItemSigner(window.arweaveWallet),
        });

        const resultResponse = await result({
          message: messageResponse,
          process: trackerProcess,
        });

        const { Messages, Error: errorMessage } = resultResponse;

        if (errorMessage) {
          throw new Error(`Error fetching transactions: ${errorMessage}`);
        }

        if (!Messages || Messages.length === 0) {
          throw new Error("No transactions found");
        }

        const lastMessage = Messages[Messages.length - 1];
        console.log(lastMessage);
        let messageData;
        try {
          messageData = JSON.parse(lastMessage.Data);
        } catch (parseError) {
          console.error("Failed to parse message ", parseError);
          throw new Error("Invalid response format from AO process");
        }

        if (messageData && messageData.code === 200) {
          return messageData.data;
        } else {
          throw new Error(
            messageData.message || "Failed to fetch transactions"
          );
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      } finally {
        setIsFetching(false);
      }
    },
    [connected]
  );

  return {
    fetchTransactions,
    isFetching,
  };
};
