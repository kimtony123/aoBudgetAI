import React from "react";
import {
  Container,
  Header,
  Grid,
  Icon,
  List,
  Divider,
  Card,
  Label,
} from "semantic-ui-react";

const AIIntegrationSection = () => (
  <Container text>
    <Header
      as="h2"
      textAlign="center"
      style={{ fontSize: "2.5em", marginBottom: "1em" }}
    >
      From Budgeting to Investing with AI
    </Header>

    <Grid stackable columns={4} className="process-steps">
      <Grid.Column>
        <div className="step-item" style={{ textAlign: "center" }}>
          <Icon name="edit" size="big" style={{ marginBottom: "10px" }} />
          <div className="step-content">
            <h4>Track Finances</h4>
            <p>Record income and expenses</p>
          </div>
        </div>
      </Grid.Column>

      <Grid.Column>
        <div className="step-item" style={{ textAlign: "center" }}>
          <Icon name="chart pie" size="big" style={{ marginBottom: "10px" }} />
          <div className="step-content">
            <h4>Analyze Patterns</h4>
            <p>WealthAI calculates your financial health</p>
          </div>
        </div>
      </Grid.Column>

      <Grid.Column>
        <div className="step-item" style={{ textAlign: "center" }}>
          <Icon name="cogs" size="big" style={{ marginBottom: "10px" }} />
          <div className="step-content">
            <h4>AI Agent Acts</h4>
            <p>Your agent invests based on your finances</p>
          </div>
        </div>
      </Grid.Column>

      <Grid.Column>
        <div className="step-item" style={{ textAlign: "center" }}>
          <Icon name="chart line" size="big" style={{ marginBottom: "10px" }} />
          <div className="step-content">
            <h4>Grow Wealth</h4>
            <p>Watch your investments grow automatically</p>
          </div>
        </div>
      </Grid.Column>
    </Grid>

    <Divider hidden />

    <Header as="h3">How Your Budget Data Guides Investments</Header>

    <Card.Group itemsPerRow={2} stackable>
      <Card>
        <Card.Content>
          <Card.Header>
            <Icon name="calculator" /> Financial Health Score
          </Card.Header>
          <Card.Description>
            <p>
              Based on your income and expense tracking, WealthAI calculates a
              financial health score that determines your investment strategy:
            </p>

            <List>
              <List.Item>
                <Label color="green" horizontal>
                  ≥ 3.0
                </Label>{" "}
                Strong - Growth focus (AR assets)
              </List.Item>
              <List.Item>
                <Label color="yellow" horizontal>
                  2.0-3.0
                </Label>{" "}
                Stable - Balanced approach
              </List.Item>
              <List.Item>
                <Label color="red" horizontal>
                  &lt; 2.0
                </Label>{" "}
                Conservative - Stability focus (PI assets)
              </List.Item>
            </List>
          </Card.Description>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Card.Header>
            <Icon name="book" /> Your Sovereign AI Agent
          </Card.Header>
          <Card.Description>
            <p>Your personal AI agent that you fully control:</p>

            <List>
              <List.Item>
                <Icon name="key" color="blue" />
                Completely sovereign and owned by you
              </List.Item>
              <List.Item>
                <Icon name="money" color="green" />
                Deposit and withdraw funds anytime
              </List.Item>
              <List.Item>
                <Icon name="sliders horizontal" color="orange" />
                Adjust investment parameters as needed
              </List.Item>
              <List.Item>
                <Icon name="shield" color="purple" />
                Operates based on your budget data
              </List.Item>
            </List>
          </Card.Description>
        </Card.Content>
      </Card>
    </Card.Group>
  </Container>
);

export default AIIntegrationSection;
