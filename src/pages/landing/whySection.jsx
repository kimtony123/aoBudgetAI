import React from "react";
import { Container, Header, Grid, Icon } from "semantic-ui-react";

const WhySection = () => (
  <Container>
    <Header
      as="h2"
      textAlign="center"
      style={{ fontSize: "2.5em", marginBottom: "2em" }}
    >
      Why aoBudgetAI Stands Out
    </Header>

    <Grid columns={2} stackable>
      <Grid.Row>
        <Grid.Column>
          <Header as="h3">
            <Icon name="chart line" />
            Complete Budget Tracking
          </Header>
          <p>
            aoBudgetAI provides comprehensive tools to track all your income and
            expenses, giving you a clear picture of your financial health.
            Unlike other budget trackers, we use this data to power your
            investments.
          </p>
        </Grid.Column>
        <Grid.Column>
          <Header as="h3">
            <Icon name="book" />
            AI-Powered Investing
          </Header>
          <p>
            Our unique AI agents analyze your budget data and automatically
            invest your surplus funds. The better you track your finances, the
            smarter your investments become.
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Header as="h3">
            <Icon name="shield" />
            Sovereign Agents
          </Header>
          <p>
            Your AI agents are completely owned and controlled by you. Deposit
            or withdraw funds anytime, and adjust your investment strategy based
            on changes in your financial situation.
          </p>
        </Grid.Column>
        <Grid.Column>
          <Header as="h3">
            <Icon name="sync" />
            Adaptive Strategy
          </Header>
          <p>
            As your financial health changes, your AI agent automatically
            adjusts its investment strategy between growth-focused assets (AR)
            and stability-focused assets (PI).
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

export default WhySection;
