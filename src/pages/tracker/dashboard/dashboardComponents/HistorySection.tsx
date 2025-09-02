import React, { useState } from "react";
import { Grid, Header, Segment, Dropdown, Tab, Icon } from "semantic-ui-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { HistorySectionProps } from "../../../../types/index";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HistorySection: React.FC<HistorySectionProps> = ({ historyData }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedMonth, setSelectedMonth] = useState<string>("Jun");
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  // Year and month filter options
  const yearOptions = Array.from(new Set(historyData.map((item) => item.year)))
    .sort((a, b) => b - a)
    .map((year) => ({ key: year, text: year.toString(), value: year }));

  const monthOptions = [
    { key: "Jan", text: "January", value: "Jan" },
    { key: "Feb", text: "February", value: "Feb" },
    { key: "Mar", text: "March", value: "Mar" },
    { key: "Apr", text: "April", value: "Apr" },
    { key: "May", text: "May", value: "May" },
    { key: "Jun", text: "June", value: "Jun" },
    { key: "Jul", text: "July", value: "Jul" },
    { key: "Aug", text: "August", value: "Aug" },
    { key: "Sep", text: "September", value: "Sep" },
    { key: "Oct", text: "October", value: "Oct" },
    { key: "Nov", text: "November", value: "Nov" },
    { key: "Dec", text: "December", value: "Dec" },
  ];

  const handleYearChange = (
    _event: React.SyntheticEvent<HTMLElement>,
    data: any
  ) => {
    setSelectedYear(data.value as number);
  };

  const handleMonthChange = (
    _event: React.SyntheticEvent<HTMLElement>,
    data: any
  ) => {
    setSelectedMonth(data.value as string);
  };

  // Filter history data based on active tab and selections
  const filteredHistoryData = historyData.filter((item) => {
    if (activeTabIndex === 1) {
      // Month tab: filter by both year and month
      return item.year === selectedYear && item.month === selectedMonth;
    } else {
      // Year tab: filter by year only (show all months of selected year)
      return item.year === selectedYear;
    }
  });

  // Chart.js configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          activeTabIndex === 1
            ? `${selectedMonth} ${selectedYear} Income vs Expenses`
            : `${selectedYear} Monthly Income vs Expenses`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  const chartData = {
    labels: filteredHistoryData.map((data) => `${data.month} ${data.year}`),
    datasets: [
      {
        label: "Income",
        data: filteredHistoryData.map((data) => data.income),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: filteredHistoryData.map((data) => data.expenses),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Tab panes configuration
  const panes = [
    {
      menuItem: "Year",
      render: () => (
        <Tab.Pane>
          <Dropdown
            placeholder="Select Year"
            fluid
            selection
            options={yearOptions}
            value={selectedYear}
            onChange={handleYearChange}
            style={{ marginBottom: "1rem" }}
          />
          <Bar options={chartOptions} data={chartData} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Month",
      render: () => (
        <Tab.Pane>
          <Grid columns={2}>
            <Grid.Column>
              <Dropdown
                placeholder="Select Year"
                fluid
                selection
                options={yearOptions}
                value={selectedYear}
                onChange={handleYearChange}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                placeholder="Select Month"
                fluid
                selection
                options={monthOptions}
                value={selectedMonth}
                onChange={handleMonthChange}
              />
            </Grid.Column>
          </Grid>
          <Bar options={chartOptions} data={chartData} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Header as="h2">
            <Icon name="history" />
            History
          </Header>
          <Segment>
            <Tab
              panes={panes}
              onTabChange={(_e, { activeIndex }) =>
                setActiveTabIndex(Number(activeIndex))
              }
            />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default HistorySection;
