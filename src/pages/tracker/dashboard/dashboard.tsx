import { useState } from "react";
import {
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Menu,
  Button,
  Message,
} from "semantic-ui-react";

import Navbar from "../../../components/Navbar";
import OverviewSection from "./dashboardComponents/overviewSections";
import CategoryBreakdown from "./dashboardComponents/catergory";
import HistorySection from "./dashboardComponents/HistorySection";
import { useNavigation } from "../../../hooks/useNavigation";
import { useConnection, useActiveAddress } from "@arweave-wallet-kit/react";
import type { FinancialData, CategoryData, HistoryData } from "../../../types";

const TrackerDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>("last35days");
  const handleClick = useNavigation();

  const { connected } = useConnection(); // Check if wallet is connected
  const address = useActiveAddress(); // Get the active address

  console.log("Wallet connected:", connected);
  console.log("Active address:", address);

  // Empty data templates
  const emptyFinancialData: FinancialData = {
    last7days: { income: 0, expenses: 0, balance: 0 },
    last30days: { income: 0, expenses: 0, balance: 0 },
    last35days: { income: 0, expenses: 0, balance: 0 },
    last90days: { income: 0, expenses: 0, balance: 0 },
  };

  // Use connected state to determine which data to pass
  const financialData = connected
    ? {
        last7days: { income: 2500.0, expenses: 1800.0, balance: 700.0 },
        last30days: { income: 8500.0, expenses: 6500.0, balance: 2000.0 },
        last35days: { income: 10000.0, expenses: 7500.0, balance: 2500.0 },
        last90days: { income: 25000.0, expenses: 20000.0, balance: 5000.0 },
      }
    : emptyFinancialData;

  const incomeData: CategoryData[] = connected
    ? [
        { category: "Salary", amount: 6000.0, percentage: 60, icon: "money" },
        {
          category: "Investments",
          amount: 3000.0,
          percentage: 30,
          icon: "line graph",
        },
        {
          category: "Freelance",
          amount: 1000.0,
          percentage: 10,
          icon: "laptop",
        },
      ]
    : [];

  const expenseData: CategoryData[] = connected
    ? [
        { category: "Housing", amount: 3000.0, percentage: 40, icon: "home" },
        {
          category: "Healthcare",
          amount: 2000.0,
          percentage: 27,
          icon: "heart",
        },
        { category: "Food", amount: 1500.0, percentage: 20, icon: "food" },
        {
          category: "Transportation",
          amount: 1000.0,
          percentage: 13,
          icon: "car",
        },
      ]
    : [];

  const historyData: HistoryData[] = connected
    ? [
        { month: "Jan", year: 2023, income: 8000.0, expenses: 5000.0 },
        { month: "Feb", year: 2023, income: 7000.0, expenses: 6000.0 },
        { month: "Mar", year: 2023, income: 9000.0, expenses: 4000.0 },
        { month: "Apr", year: 2023, income: 8500.0, expenses: 5500.0 },
        { month: "May", year: 2023, income: 7500.0, expenses: 6500.0 },
        { month: "Jun", year: 2023, income: 9500.0, expenses: 4500.0 },
        { month: "Jan", year: 2022, income: 7200.0, expenses: 4800.0 },
        { month: "Feb", year: 2022, income: 6800.0, expenses: 5200.0 },
        { month: "Mar", year: 2022, income: 8300.0, expenses: 4700.0 },
      ]
    : [];

  // Calculate totals based on connected state
  const totalIncome = connected
    ? incomeData.reduce((sum, item) => sum + item.amount, 0)
    : 0;
  const totalExpenses = connected
    ? expenseData.reduce((sum, item) => sum + item.amount, 0)
    : 0;

  const handleFilterChange = (
    _event: React.SyntheticEvent<HTMLElement>,
    data: any
  ) => {
    setTimeFilter(data.value as string);
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <Container
      style={{
        marginTop: "3em",
        backgroundColor: "white",
        padding: "2em",
        borderRadius: "8px",
      }}
    >
      <Navbar />
      <Divider />

      {/* Wallet Connection Warning */}
      {!connected && (
        <Message warning>
          <Message.Header>Wallet Not Connected</Message.Header>
          <p>Please connect your wallet to view your financial data.</p>
        </Message>
      )}

      <Grid stackable={true}>
        <Grid.Row>
          <Grid.Column>
            <Header>Welcome to aoBudgetAgent</Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Divider />

      {/* User Welcome Section */}
      <Grid stackable={true}>
        <Grid.Row>
          <Grid.Column>
            <Menu size="large">
              <Menu.Item>
                <Header>
                  Hello <Icon name="hand victory" />
                  {address && <p> {truncateAddress(address)}</p>}
                </Header>
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  <Button
                    primary
                    onClick={handleClick("/addIncomeTransaction")}
                    disabled={!connected}
                  >
                    New Income
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button
                    color="red"
                    onClick={handleClick("/addExpenseTransaction")}
                    disabled={!connected}
                  >
                    New Expense
                  </Button>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Divider />

      <OverviewSection
        financialData={financialData}
        timeFilter={timeFilter}
        onFilterChange={handleFilterChange}
      />

      <Divider />

      <CategoryBreakdown
        incomeData={incomeData}
        expenseData={expenseData}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        financialData={financialData}
        timeFilter={timeFilter}
      />

      <Divider />

      <HistorySection historyData={historyData} />
    </Container>
  );
};

export default TrackerDashboard;
