import React from "react";
import { Container, Header, Button } from "semantic-ui-react";

const CallToActionSection = () => (
  <Container textAlign="center">
    <Header as="h2" style={{ fontSize: "2.5em" }}>
      Start Tracking & Investing Today
    </Header>
    <p
      style={{
        fontSize: "1.33em",
        maxWidth: "800px",
        margin: "0 auto 2em",
      }}
    >
      Join the only budget tracker that turns your financial data into
      intelligent investments. Take control of your finances and watch your
      wealth grow automatically.
    </p>

    <Button primary size="huge">
      Start Tracking for Free
    </Button>

    <p style={{ marginTop: "1em" }}>
      <small>Connect your wallet and start in minutes</small>
    </p>
  </Container>
);

export default CallToActionSection;
