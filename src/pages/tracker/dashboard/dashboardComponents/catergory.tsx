import React from "react";
import {
  Grid,
  Header,
  Card,
  Icon,
  Statistic,
  Progress,
  List,
} from "semantic-ui-react";
import type { CategoryBreakdownProps } from "../../../../types/index";

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  incomeData,
  expenseData,
  totalIncome,
  totalExpenses,
  financialData,
  timeFilter,
}) => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Header as="h2">Category Breakdown</Header>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row columns={2} stackable>
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                <Icon name="money" color="green" />
                Total Income
              </Card.Header>
              <Card.Description>
                <Statistic size="small">
                  <Statistic.Value>
                    {totalIncome.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Statistic.Value>
                  <Statistic.Label>USDA</Statistic.Label>
                </Statistic>
                <Progress
                  value={financialData[timeFilter].income}
                  total={totalIncome}
                  progress="percent"
                  success
                  style={{ marginTop: "1em" }}
                >
                  {(
                    (financialData[timeFilter].income / totalIncome) *
                    100
                  ).toFixed(0)}
                  % of total income
                </Progress>
              </Card.Description>
            </Card.Content>
          </Card>

          <Card fluid style={{ marginTop: "2em" }}>
            <Card.Content>
              <Card.Header>Income by Category</Card.Header>
              <Card.Description>
                <List divided relaxed>
                  {incomeData.map((item, index) => (
                    <List.Item key={index}>
                      <Icon name={item.icon as any} color="green" />
                      {item.category}:{" "}
                      {item.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      USDA
                      <Progress
                        value={item.amount}
                        total={totalIncome}
                        progress="percent"
                        color="green"
                        style={{ marginTop: "0.5em" }}
                      >
                        {item.percentage}% of total income
                      </Progress>
                    </List.Item>
                  ))}
                </List>
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                <Icon name="credit card" color="red" />
                Total Expenses
              </Card.Header>
              <Card.Description>
                <Statistic size="small">
                  <Statistic.Value>
                    {totalExpenses.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Statistic.Value>
                  <Statistic.Label>USDA</Statistic.Label>
                </Statistic>
                <Progress
                  value={financialData[timeFilter].expenses}
                  total={totalExpenses}
                  progress="percent"
                  warning
                  style={{ marginTop: "1em" }}
                >
                  {(
                    (financialData[timeFilter].expenses / totalExpenses) *
                    100
                  ).toFixed(0)}
                  % of total expenses
                </Progress>
              </Card.Description>
            </Card.Content>
          </Card>

          <Card fluid style={{ marginTop: "2em" }}>
            <Card.Content>
              <Card.Header>Expenses by Category</Card.Header>
              <Card.Description>
                <List divided relaxed>
                  {expenseData.map((item, index) => (
                    <List.Item key={index}>
                      <Icon name={item.icon as any} color="red" />
                      {item.category}:{" "}
                      {item.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      USDA
                      <Progress
                        value={item.amount}
                        total={totalExpenses}
                        progress="percent"
                        color="red"
                        style={{ marginTop: "0.5em" }}
                      >
                        {item.percentage}% of total expenses
                      </Progress>
                    </List.Item>
                  ))}
                </List>
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default CategoryBreakdown;
