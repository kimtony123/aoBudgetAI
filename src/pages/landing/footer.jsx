import React from "react";
import {
  Segment,
  Container,
  Grid,
  Header,
  List,
  Button,
} from "semantic-ui-react";

const Footer = () => (
  <Segment inverted vertical style={{ padding: "5em 0em" }}>
    <Container>
      <Grid divided inverted stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <Header inverted as="h4" content="WealthAI" />
            <List link inverted>
              <List.Item as="a">About Us</List.Item>
              <List.Item as="a">Contact</List.Item>
              <List.Item as="a">Privacy Policy</List.Item>
              <List.Item as="a">Terms of Service</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header inverted as="h4" content="Features" />
            <List link inverted>
              <List.Item as="a">Budget Tracking</List.Item>
              <List.Item as="a">AI Agents</List.Item>
              <List.Item as="a">Investment Management</List.Item>
              <List.Item as="a">Financial Reports</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header inverted as="h4" content="Resources" />
            <List link inverted>
              <List.Item as="a">Documentation</List.Item>
              <List.Item as="a">API</List.Item>
              <List.Item as="a">Tutorials</List.Item>
              <List.Item as="a">Support</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={7}>
            <Header as="h4" inverted>
              The Budget Tracker That Invests For You
            </Header>
            <p>
              aoBudgetAI combines comprehensive budget tracking with AI-powered
              investment management. Track your income and expenses, then let
              your personal AI agent grow your wealth based on your financial
              health.
            </p>
            <Button primary size="large">
              Go to App.
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Segment>
);

export default Footer;
