import React from "react";
import {
  Container,
  Header,
  Grid,
  Icon,
  List,
  Divider,
} from "semantic-ui-react";

const BudgetTrackingSection = () => (
  <Container text>
    <Header
      as="h2"
      textAlign="center"
      style={{ fontSize: "2.5em", marginBottom: "1em" }}
    >
      Comprehensive Budget Tracking
    </Header>

    <Grid stackable columns={2}>
      <Grid.Column>
        <Header as="h3" icon>
          <Icon name="money bill alternate" />
          Income Tracking
        </Header>
        <p>
          Easily track all your income sources with automatic categorization and
          recurring income detection.
        </p>

        <List>
          <List.Item>
            <Icon name="check" color="green" />
            Multiple income streams support
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Automatic categorization
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Recurring income detection
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Income forecasting
          </List.Item>
        </List>
      </Grid.Column>

      <Grid.Column>
        <Header as="h3" icon>
          <Icon name="shopping cart" />
          Expense Tracking
        </Header>
        <p>
          Monitor your spending with detailed categorization and identify areas
          where you can save more.
        </p>

        <List>
          <List.Item>
            <Icon name="check" color="green" />
            Smart expense categorization
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Spending limit alerts
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Recurring bill tracking
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Custom budget categories
          </List.Item>
        </List>
      </Grid.Column>
    </Grid>

    <Divider hidden />

    <Header as="h3" textAlign="center">
      Your Financial Data Powers Your AI Investment Agent
    </Header>
    <p style={{ textAlign: "center", fontSize: "1.2em" }}>
      The more accurately you track your finances, the better your AI agent can
      optimize your investments. Your budget data directly informs your agent's
      investment strategy.
    </p>
  </Container>
);

export default BudgetTrackingSection;
