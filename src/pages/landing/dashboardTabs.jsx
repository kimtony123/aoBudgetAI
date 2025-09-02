import React from "react";
import {
  Header,
  Tab,
  Grid,
  Card,
  Statistic,
  Progress,
  List,
  Icon,
} from "semantic-ui-react";

const DashboardTabs = () => {
  const panes = [
    {
      menuItem: "Budget Overview",
      render: () => (
        <Tab.Pane attached={false}>
          <Header as="h3">Your Financial Dashboard</Header>
          <p>Track your income and expenses in one place:</p>

          <Grid columns={2} stackable>
            <Grid.Column>
              <Card>
                <Card.Content>
                  <Card.Header>Monthly Income</Card.Header>
                  <Card.Description>
                    <Statistic>
                      <Statistic.Value>$4,250</Statistic.Value>
                      <Statistic.Label>This Month</Statistic.Label>
                    </Statistic>
                    <Progress value={85} total={100} progress="percent" success>
                      85% of expected income
                    </Progress>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column>
              <Card>
                <Card.Content>
                  <Card.Header>Monthly Expenses</Card.Header>
                  <Card.Description>
                    <Statistic>
                      <Statistic.Value>$2,850</Statistic.Value>
                      <Statistic.Label>This Month</Statistic.Label>
                    </Statistic>
                    <Progress value={65} total={100} progress="percent" warning>
                      65% of budget used
                    </Progress>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>

          <Card style={{ marginTop: "2em" }}>
            <Card.Content>
              <Card.Header>Spending by Category</Card.Header>
              <Card.Description>
                <List>
                  <List.Item>
                    <Icon name="home" /> Housing: $1,200
                    <Progress
                      value={70}
                      total={100}
                      progress="percent"
                      style={{ marginTop: "0.5em" }}
                    />
                  </List.Item>
                  <List.Item>
                    <Icon name="food" /> Food: $450
                    <Progress
                      value={60}
                      total={100}
                      progress="percent"
                      style={{ marginTop: "0.5em" }}
                    />
                  </List.Item>
                  <List.Item>
                    <Icon name="car" /> Transportation: $300
                    <Progress
                      value={40}
                      total={100}
                      progress="percent"
                      style={{ marginTop: "0.5em" }}
                    />
                  </List.Item>
                  <List.Item>
                    <Icon name="shopping bag" /> Entertainment: $250
                    <Progress
                      value={80}
                      total={100}
                      progress="percent"
                      style={{ marginTop: "0.5em" }}
                    />
                  </List.Item>
                </List>
              </Card.Description>
            </Card.Content>
          </Card>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "AI Agent Performance",
      render: () => (
        <Tab.Pane attached={false}>
          <Header as="h3">Your AI Investment Agent</Header>
          <p>Performance based on your financial health and budget data:</p>

          <Grid columns={2} stackable>
            <Grid.Column>
              <Card>
                <Card.Content>
                  <Card.Header>Financial Health Score</Card.Header>
                  <Card.Description>
                    <Statistic>
                      <Statistic.Value>82/100</Statistic.Value>
                      <Statistic.Label>Excellent</Statistic.Label>
                    </Statistic>
                    <Progress percent={82} success>
                      Income/Expense Ratio: 3.2x
                    </Progress>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column>
              <Card>
                <Card.Content>
                  <Card.Header>Current Allocation</Card.Header>
                  <Card.Description>
                    <p>Based on your strong financial health:</p>
                    <List>
                      <List.Item>
                        <Icon name="arrow up" color="green" /> AR Token:{" "}
                        <strong>64%</strong>
                        <Progress percent={64} indicating />
                      </List.Item>
                      <List.Item>
                        <Icon name="shield" color="blue" /> PI Index:{" "}
                        <strong>36%</strong>
                        <Progress percent={36} indicating />
                      </List.Item>
                    </List>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>

          <Card style={{ marginTop: "2em" }}>
            <Card.Content>
              <Card.Header>Investment Performance</Card.Header>
              <Card.Description>
                <Grid columns={3} divided>
                  <Grid.Row>
                    <Grid.Column>
                      <Statistic>
                        <Statistic.Value>+12.7%</Statistic.Value>
                        <Statistic.Label>Portfolio Growth</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic>
                        <Statistic.Value>+8.3%</Statistic.Value>
                        <Statistic.Label>AR Performance</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic>
                        <Statistic.Value>+4.2%</Statistic.Value>
                        <Statistic.Label>PI Performance</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Description>
            </Card.Content>
          </Card>
        </Tab.Pane>
      ),
    },
  ];

  return <Tab menu={{ pointing: true }} panes={panes} />;
};

export default DashboardTabs;
