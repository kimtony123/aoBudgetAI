import { useActiveAddress } from "arweave-wallet-kit";
import { Card, Placeholder } from "semantic-ui-react";

import { useAccountBalance } from "../../hooks/useAccountBalance";

export function AccBalance() {
  const address = useActiveAddress();
  const { balance, loading } = useAccountBalance();

  if (!address) return null;

  return (
    <Card>
      <Card.Content
        textAlign="center"
        style={{
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Placeholder>
            <Placeholder.Line length="medium" />
          </Placeholder>
        ) : (
          <div>{balance / 1} USD</div>
        )}
      </Card.Content>
    </Card>
  );
}
