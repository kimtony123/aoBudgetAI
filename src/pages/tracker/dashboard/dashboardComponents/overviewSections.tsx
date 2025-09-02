import React from "react";
import {
  Grid,
  Header,
  Segment,
  Button,
  Statistic,
  Dropdown,
} from "semantic-ui-react";
import type { OverviewSectionProps } from "../../../../types/index";

const OverviewSection: React.FC<OverviewSectionProps> = ({
  financialData,
  timeFilter,
  onFilterChange,
}) => {
  const timeOptions = [
    { key: "last7days", text: "Last 7 days", value: "last7days" },
    { key: "last30days", text: "Last 30 days", value: "last30days" },
    { key: "last35days", text: "Last 35 days", value: "last35days" },
    { key: "last90days", text: "Last 90 days", value: "last90days" },
  ];

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={8}>
          <Header>Overview</Header>
        </Grid.Column>
        <Grid.Column width={8} textAlign="right">
          <Dropdown
            selection
            options={timeOptions}
            value={timeFilter}
            onChange={onFilterChange}
          />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row columns={3}>
        <Grid.Column>
          <Segment textAlign="center">
            <Button
              color="green"
              content="Income"
              icon="line graph"
              labelPosition="left"
              fluid
            />
            <Statistic size="small">
              <Statistic.Value>
                {financialData[timeFilter].income.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Statistic.Value>
              <Statistic.Label>USDA</Statistic.Label>
            </Statistic>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center">
            <Button
              color="red"
              content="Expenses"
              icon="chart area"
              labelPosition="left"
              fluid
            />
            <Statistic size="small">
              <Statistic.Value>
                {financialData[timeFilter].expenses.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Statistic.Value>
              <Statistic.Label>USDA</Statistic.Label>
            </Statistic>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center">
            <Button
              content="Balance"
              icon="money bill alternate outline"
              labelPosition="left"
              fluid
            />
            <Statistic size="small">
              <Statistic.Value>
                {financialData[timeFilter].balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Statistic.Value>
              <Statistic.Label>USDA</Statistic.Label>
            </Statistic>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default OverviewSection;
