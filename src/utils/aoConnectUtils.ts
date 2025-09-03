// utils/aoConnectUtils.ts
import { message, createDataItemSigner } from "@permaweb/aoconnect";

// Get the result cache URL for a specific process and reference
export const getResultCacheUrl = (processId: string, reference: string) => {
  return `https://g8way.io/${processId}~process@1.0/now/cache/results/${processId}-${reference}/serialize~json@1.0`;
};

// Send a message to an AO process
export const sendMessage = async (
  processId: string,
  tags: { name: string; value: string }[],
  data: string = ""
) => {
  try {
    return await message({
      process: processId,
      tags,
      data,
      signer: createDataItemSigner(window.arweaveWallet),
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    throw new Error("Failed to communicate with AO process");
  }
};
