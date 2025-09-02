import { ArweaveWalletKit } from "arweave-wallet-kit";

export function ArweaveProvider({ children }: { children: React.ReactNode }) {
  return (
    <ArweaveWalletKit
      config={{
        appInfo: {
          name: "aoBudgetAI",
        },
        permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
        ensurePermissions: true,
      }}
    >
      {children}
    </ArweaveWalletKit>
  );
}
