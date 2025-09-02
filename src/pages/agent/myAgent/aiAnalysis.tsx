import { useState } from "react";
import {
  Container,
  Header,
  Dropdown,
  Button,
  Icon,
  Segment,
  Loader,
  Message,
  Card,
  List,
  Divider,
} from "semantic-ui-react";

import Navbar from "../../../components/Navbar";
import { useConnection } from "@arweave-wallet-kit/react";

// Mock transaction data (in a real app, this would come from your backend)
const mockTransactions = [
  {
    id: "1",
    category: "Salary",
    description: "Monthly salary",
    date: "2025-09-01",
    type: "income",
    amount: 2500.0,
  },
  {
    id: "2",
    category: "Rent",
    description: "Apartment rent",
    date: "2025-08-28",
    type: "expense",
    amount: -1200.0,
  },
  {
    id: "3",
    category: "Groceries",
    description: "Weekly groceries",
    date: "2025-08-30",
    type: "expense",
    amount: -150.0,
  },
  {
    id: "4",
    category: "Utilities",
    description: "Electricity bill",
    date: "2025-08-31",
    type: "expense",
    amount: -100.0,
  },
  {
    id: "5",
    category: "Entertainment",
    description: "Movie tickets",
    date: "2025-09-02",
    type: "expense",
    amount: -35.0,
  },
  {
    id: "6",
    category: "Freelance",
    description: "Web design project",
    date: "2023-09-20",
    type: "income",
    amount: 500.0,
  },
  {
    id: "7",
    category: "Dining",
    description: "Restaurant dinner",
    date: "2023-09-18",
    type: "expense",
    amount: -75.0,
  },
  {
    id: "8",
    category: "Transportation",
    description: "Gasoline",
    date: "2023-09-22",
    type: "expense",
    amount: -45.0,
  },
];

const AIAnalysisPage = () => {
  const { connected } = useConnection(); // Check wallet connection
  const [selectedPeriod, setSelectedPeriod] = useState("last30days");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState("");

  // Time period options
  const timeOptions = [
    { key: "last7days", text: "Last 7 days", value: "last7days" },
    { key: "last30days", text: "Last 30 days", value: "last30days" },
    { key: "last90days", text: "Last 90 days", value: "last90days" },
    { key: "last365days", text: "Last 365 days", value: "last365days" },
  ];

  // Filter transactions based on selected period
  const filterTransactionsByPeriod = () => {
    const today = new Date();
    const periodStart = new Date();

    switch (selectedPeriod) {
      case "last7days":
        periodStart.setDate(today.getDate() - 7);
        break;
      case "last30days":
        periodStart.setDate(today.getDate() - 30);
        break;
      case "last90days":
        periodStart.setDate(today.getDate() - 90);
        break;
      case "last365days":
        periodStart.setDate(today.getDate() - 365);
        break;
      default:
        periodStart.setDate(today.getDate() - 30);
    }

    return mockTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= periodStart && transactionDate <= today;
    });
  };

  // Simulate AI analysis (in a real app, this would call your backend API)
  const simulateAIAnalysis = async (transactions: any[]) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock analysis response
    return {
      summary: {
        totalIncome: transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
        netCashFlow: transactions.reduce((sum, t) => sum + t.amount, 0),
        topSpendingCategories: [
          { category: "Rent", amount: 1200, percentage: 68 },
          { category: "Groceries", amount: 150, percentage: 9 },
          { category: "Utilities", amount: 100, percentage: 6 },
        ],
      },
      insights: [
        "Your rent accounts for 68% of your expenses, which is above the recommended 30% of income.",
        "You're spending $150 on groceries monthly, which is reasonable for your income level.",
        "Consider setting aside 20% of your income for savings to build an emergency fund.",
      ],
      recommendations: [
        "Review your subscription services - you may have unused subscriptions costing you money.",
        "Consider refinancing your rent or looking for a more affordable housing option.",
        "Set up automatic transfers to savings accounts to ensure consistent saving habits.",
      ],
      trends: [
        "Your dining out expenses have increased by 15% compared to the previous period.",
        "Your freelance income has been growing steadily over the past 3 months.",
        "You've maintained a consistent savings rate of 10% of your income.",
      ],
    };
  };

  // Handle analysis request
  const handleAnalyze = async () => {
    // Don't proceed if wallet is not connected
    if (!connected) {
      setError("Please connect your wallet to analyze transactions.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const filteredTransactions = filterTransactionsByPeriod();

      if (filteredTransactions.length === 0) {
        setError("No transactions found for the selected period.");
        setIsLoading(false);
        return;
      }

      const analysisResult = await simulateAIAnalysis(filteredTransactions);
      setAnalysis(analysisResult);
    } catch (err) {
      setError("Failed to analyze transactions. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Container style={{ marginTop: "2em", maxWidth: "1000px" }}>
      <Navbar />
      <Header as="h1" textAlign="center">
        <Icon name="cog" />
        AI Financial Analysis
      </Header>

      {/* Wallet Connection Warning */}
      {!connected && (
        <Message warning>
          <Message.Header>Wallet Not Connected</Message.Header>
          <p>
            Please connect your wallet to analyze your financial transactions.
          </p>
        </Message>
      )}

      <p>
        Get intelligent insights and recommendations based on your transaction
        history. Our AI analyzes your spending patterns, income sources, and
        financial habits to provide personalized advice.
      </p>

      <Divider />

      <Segment>
        <Header as="h3">Select Analysis Period</Header>
        <Dropdown
          selection
          options={timeOptions}
          value={selectedPeriod}
          onChange={(_, { value }) => setSelectedPeriod(value as string)}
          style={{ marginBottom: "1rem" }}
          disabled={!connected}
        />

        <Button
          primary
          onClick={handleAnalyze}
          disabled={isLoading || !connected}
        >
          <Icon name="cloud" />
          {isLoading ? "Analyzing..." : "Analyze Transactions"}
        </Button>
      </Segment>

      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}

      {isLoading && (
        <Segment textAlign="center">
          <Loader active inline="centered" size="large">
            Analyzing your transactions...
          </Loader>
          <p>This may take a few moments</p>
        </Segment>
      )}

      {analysis && !isLoading && (
        <div>
          <Header as="h2">Financial Analysis Report</Header>

          <Header as="h3" dividing>
            <Icon name="chart pie" />
            Financial Summary
          </Header>

          <Card.Group itemsPerRow={3}>
            <Card color="green">
              <Card.Content>
                <Card.Header>Total Income</Card.Header>
                <Card.Description>
                  {formatCurrency(analysis.summary.totalIncome)}
                </Card.Description>
              </Card.Content>
            </Card>

            <Card color="red">
              <Card.Content>
                <Card.Header>Total Expenses</Card.Header>
                <Card.Description>
                  {formatCurrency(analysis.summary.totalExpenses)}
                </Card.Description>
              </Card.Content>
            </Card>

            <Card color={analysis.summary.netCashFlow >= 0 ? "green" : "red"}>
              <Card.Content>
                <Card.Header>Net Cash Flow</Card.Header>
                <Card.Description>
                  {formatCurrency(analysis.summary.netCashFlow)}
                </Card.Description>
              </Card.Content>
            </Card>
          </Card.Group>

          <Header as="h4">Top Spending Categories</Header>
          <List divided relaxed>
            {analysis.summary.topSpendingCategories.map(
              (category: any, index: number) => (
                <List.Item key={index}>
                  <List.Icon name="money bill alternate" />
                  <List.Content>
                    <List.Header>{category.category}</List.Header>
                    <List.Description>
                      {formatCurrency(category.amount)} ({category.percentage}%
                      of expenses)
                    </List.Description>
                  </List.Content>
                </List.Item>
              )
            )}
          </List>

          <Header as="h3" dividing>
            <Icon name="lightbulb" />
            Key Insights
          </Header>

          <List ordered>
            {analysis.insights.map((insight: string, index: number) => (
              <List.Item key={index}>{insight}</List.Item>
            ))}
          </List>

          <Header as="h3" dividing>
            <Icon name="rocket" />
            Actionable Recommendations
          </Header>

          <List ordered>
            {analysis.recommendations.map(
              (recommendation: string, index: number) => (
                <List.Item key={index}>{recommendation}</List.Item>
              )
            )}
          </List>

          <Header as="h3" dividing>
            <Icon name="rocket" />
            Trends & Patterns
          </Header>

          <List bulleted>
            {analysis.trends.map((trend: string, index: number) => (
              <List.Item key={index}>{trend}</List.Item>
            ))}
          </List>

          <Message info>
            <Message.Header>How this analysis works</Message.Header>
            <p>
              Our AI analyzes your transaction descriptions, amounts,
              categories, and timing to identify patterns and provide
              personalized recommendations. The more transactions you have, the
              more accurate the analysis becomes.
            </p>
          </Message>
        </div>
      )}

      {!analysis && !isLoading && connected && (
        <Segment placeholder>
          <Header icon>
            <Icon name="rocket" />
            No analysis yet
          </Header>
          <p>
            Select a time period and click "Analyze Transactions" to get
            started.
          </p>
        </Segment>
      )}

      {!connected && !isLoading && (
        <Segment placeholder>
          <Header icon>
            <Icon name="lock" />
            Wallet Not Connected
          </Header>
          <p>
            Please connect your wallet to analyze your financial transactions.
          </p>
        </Segment>
      )}
    </Container>
  );
};

export default AIAnalysisPage;
