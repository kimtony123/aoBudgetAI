import { useEffect, useState } from "react";
import {
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Menu,
  Button,
  Message,
  Modal,
} from "semantic-ui-react";

import Navbar from "../../../components/Navbar";
import OverviewSection from "./dashboardComponents/overviewSections";
import CategoryBreakdown from "./dashboardComponents/catergory";
import HistorySection from "./dashboardComponents/HistorySection";
import { useNavigation } from "../../../hooks/useNavigation";
import { useConnection, useActiveAddress } from "@arweave-wallet-kit/react";
import type {
  FinancialData,
  CategoryData,
  HistoryData,
  Transaction,
} from "../../../types";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";

const TrackerDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>("last35days");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddProject, setIsAddProject] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showMockModal, setShowMockModal] = useState<boolean>(false);
  const handleClick = useNavigation();

  const { connected } = useConnection();
  const address = useActiveAddress();

  const trackerProcess = "Ejr_9-PPwg9RV7FFilWIeap6Zm0CdmUEbevGzPwAOd0";

  // Calculate financial data from transactions
  const calculateFinancialData = (
    transactions: Transaction[]
  ): FinancialData => {
    const now = new Date();
    const periods = {
      last7days: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      last30days: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      last35days: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
      last90days: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    };

    const financialData: FinancialData = {
      last7days: { income: 0, expenses: 0, balance: 0 },
      last30days: { income: 0, expenses: 0, balance: 0 },
      last35days: { income: 0, expenses: 0, balance: 0 },
      last90days: { income: 0, expenses: 0, balance: 0 },
    };

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);

      Object.entries(periods).forEach(([period, startDate]) => {
        if (transactionDate >= startDate) {
          if (transaction.type === "income") {
            financialData[period as keyof FinancialData].income +=
              transaction.amount;
            financialData[period as keyof FinancialData].balance +=
              transaction.amount;
          } else {
            financialData[period as keyof FinancialData].expenses +=
              transaction.amount;
            financialData[period as keyof FinancialData].balance -=
              transaction.amount;
          }
        }
      });
    });

    return financialData;
  };

  // Calculate category data from transactions
  const calculateCategoryData = (
    transactions: Transaction[],
    type: "income" | "expense"
  ): CategoryData[] => {
    const categoryMap: Record<string, number> = {};
    const filteredTransactions = transactions.filter((t) => t.type === type);
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    filteredTransactions.forEach((transaction) => {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = 0;
      }
      categoryMap[transaction.category] += transaction.amount;
    });

    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      icon: getIconForCategory(category),
    }));
  };

  // Calculate history data from transactions
  const calculateHistoryData = (transactions: Transaction[]): HistoryData[] => {
    const monthMap: Record<string, { income: number; expenses: number }> = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { income: 0, expenses: 0 };
      }

      if (transaction.type === "income") {
        monthMap[monthKey].income += transaction.amount;
      } else {
        monthMap[monthKey].expenses += transaction.amount;
      }
    });

    return Object.entries(monthMap)
      .map(([key, data]) => {
        const [year, monthIndex] = key.split("-");
        return {
          month: monthNames[parseInt(monthIndex)],
          year: parseInt(year),
          income: data.income,
          expenses: data.expenses,
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
      });
  };

  // Helper function to get icons for categories
  const getIconForCategory = (category: string): string => {
    const iconMap: Record<string, string> = {
      Salary: "money",
      Investments: "line graph",
      Freelance: "laptop",
      Housing: "home",
      Healthcare: "heart",
      Food: "food",
      Transportation: "car",
      // Add more mappings as needed
    };

    return iconMap[category] || "money";
  };

  const fetchTransactions = async () => {
    if (!connected) return;

    setIsLoading(true);
    setError(null);

    try {
      const messageResponse = await message({
        process: trackerProcess,
        tags: [{ name: "Action", value: "FetchUserTransactions" }],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const resultResponse = await result({
        message: messageResponse,
        process: trackerProcess,
      });

      const { Messages, Error } = resultResponse;

      if (Error) {
        setError("Error fetching transactions: " + Error);
        return;
      }

      if (!Messages || Messages.length === 0) {
        setError("No transactions found");
        return;
      }

      const lastMessage = Messages[Messages.length - 1];
      const messageData = JSON.parse(lastMessage.Data);

      if (messageData && messageData.code === 200) {
        setTransactions(messageData.data);
      } else {
        setError(messageData.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addMockTransactions = async () => {
    setIsAddProject(true);
    setShowMockModal(false);

    try {
      const messageResponse = await message({
        process: trackerProcess,
        tags: [{ name: "Action", value: "AddMockTransactions" }],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const resultResponse = await result({
        message: messageResponse,
        process: trackerProcess,
      });

      const { Messages, Error } = resultResponse;

      if (Error) {
        setError("Error adding mock transactions: " + Error);
        return;
      }

      if (!Messages || Messages.length === 0) {
        throw new Error("No messages were returned from ao. Please try later.");
      }

      const lastMessage = Messages[Messages.length - 1];
      const messageData = JSON.parse(lastMessage.Data);

      if (messageData && messageData.code === 200) {
        // Refresh transactions after adding mock data
        await fetchTransactions();
      } else {
        setError(messageData.message || "Failed to add mock transactions");
      }
    } catch (error) {
      console.error("Error adding mock transactions:", error);
      setError("Failed to add mock transactions. Please try again.");
    } finally {
      setIsAddProject(false);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [connected]);

  // Calculate all derived data from transactions
  const financialData = connected
    ? calculateFinancialData(transactions)
    : {
        last7days: { income: 0, expenses: 0, balance: 0 },
        last30days: { income: 0, expenses: 0, balance: 0 },
        last35days: { income: 0, expenses: 0, balance: 0 },
        last90days: { income: 0, expenses: 0, balance: 0 },
      };

  const incomeData = connected
    ? calculateCategoryData(transactions, "income")
    : [];
  const expenseData = connected
    ? calculateCategoryData(transactions, "expense")
    : [];
  const historyData = connected ? calculateHistoryData(transactions) : [];

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);

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

      {/* Mock Transactions Modal */}
      <Modal
        open={showMockModal}
        onClose={() => setShowMockModal(false)}
        size="small"
      >
        <Modal.Header>Create Mock Transactions</Modal.Header>
        <Modal.Content>
          <p>
            Would you like to add sample transactions to test the application?
            This will create:
          </p>
          <ul>
            <li>5 income transactions (Salary, Freelance)</li>
            <li>15 expense transactions (Housing, Food, Transportation)</li>
          </ul>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowMockModal(false)}>Cancel</Button>
          <Button primary loading={isAddProject} onClick={addMockTransactions}>
            Create Mock Data
          </Button>
        </Modal.Actions>
      </Modal>

      {/* Wallet Connection Warning */}
      {!connected && (
        <Message warning>
          <Message.Header>Wallet Not Connected</Message.Header>
          <p>Please connect your wallet to view your financial data.</p>
        </Message>
      )}

      {/* Loading State */}
      {isLoading && (
        <Message info>
          <Message.Header>Loading Transactions</Message.Header>
          <p>Please wait while we fetch your financial data...</p>
        </Message>
      )}

      {/* No Transactions State */}
      {connected && !isLoading && transactions.length === 0 && (
        <Message info>
          <Message.Header>No Transactions Found</Message.Header>
          <p>
            You don't have any transactions yet. Would you like to create some
            mock data to test the app?
          </p>
          <Button
            primary
            loading={isAddProject}
            onClick={() => setShowMockModal(true)}
          >
            Create Mock Transactions
          </Button>
        </Message>
      )}

      {/* Error State */}
      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
          <Button onClick={() => setError(null)}>Dismiss</Button>
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
                <Menu.Item>
                  <Button
                    icon="refresh"
                    onClick={fetchTransactions}
                    disabled={!connected || isLoading}
                    loading={isLoading}
                  />
                </Menu.Item>
                {connected && transactions.length === 0 && (
                  <Menu.Item>
                    <Button
                      color="teal"
                      onClick={() => setShowMockModal(true)}
                      disabled={isAddProject}
                      loading={isAddProject}
                    >
                      <Icon name="magic" />
                      Mock Data
                    </Button>
                  </Menu.Item>
                )}
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
