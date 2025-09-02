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
  Progress,
} from "semantic-ui-react";
import { message, dryrun, createDataItemSigner } from "@permaweb/aoconnect";
import { useConnection } from "@arweave-wallet-kit/react";

import Navbar from "../../../components/Navbar";
import {
  createAnalysisPrompt,
  enrichTransactions,
} from "../../../utils/promptUtils";

// Your AO Process ID for the AI agent
const YOUR_AO_PROCESS_ID = "CAqAjfPkvBJqtog9OrxUaS3iIVEcGzNkVlDwDM-e-dA";

const AIAnalysisPage = () => {
  const { connected } = useConnection();
  const [selectedPeriod, setSelectedPeriod] = useState("last30days");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState("");

  const [taskRef, setTaskRef] = useState("");
  const [userContext, setUserContext] = useState({
    income: 50000,
    goals: "Save for retirement, buy a house",
    riskTolerance: "Medium",
  });

  // Time period options
  const timeOptions = [
    { key: "last7days", text: "Last 7 days", value: "last7days" },
    { key: "last30days", text: "Last 30 days", value: "last30days" },
    { key: "last90days", text: "Last 90 days", value: "last90days" },
    { key: "last365days", text: "Last 365 days", value: "last365days" },
  ];

  // Mock transaction data (replace with real data from your app)
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

  // Send transactions to AI agent for analysis
  const sendToAIAgent = async (transactions: any[]) => {
    if (!connected) {
      throw new Error("Wallet not connected");
    }

    const ref = Date.now().toString();
    setTaskRef(ref);

    // Enrich transactions with additional data
    const enrichedTransactions = enrichTransactions(transactions);

    // Create the optimized prompt
    const prompt = createAnalysisPrompt(
      enrichedTransactions,
      selectedPeriod,
      userContext
    );

    try {
      // Send message to AO process
      const messageId = await message({
        process: YOUR_AO_PROCESS_ID,
        tags: [
          { name: "Action", value: "SendRequest" },
          { name: "X-Prompt", value: prompt },
          {
            name: "X-Options",
            value: JSON.stringify({
              reference: ref,
              max_tokens: 300,
              temperature: 0.7,
            }),
          },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Message sent with ID:", messageId);
      return ref;
    } catch (error) {
      console.error("Failed to send to AI agent:", error);
      throw new Error("Failed to send data to AI agent");
    }
  };

  // Fetch results from AI agent
  const fetchAIResult = async (reference: string) => {
    try {
      const result = await dryrun({
        process: YOUR_AO_PROCESS_ID,
        data: "",
        tags: [
          { name: "Action", value: "GetResult" },
          { name: "Taskref", value: reference },
        ],
      });

      if (result.Messages && result.Messages.length > 0) {
        const aiResult = result.Messages[0].Data;

        try {
          // Parse the JSON result
          const parsedResult = JSON.parse(aiResult);

          // Format the result to match your UI expectations
          return formatAIResponse(parsedResult);
        } catch (parseError) {
          console.error("Failed to parse JSON result:", parseError);
          // If it's not JSON, return as is
          return { insights: [aiResult], recommendations: [] };
        }
      } else {
        throw new Error("No result found from AI agent");
      }
    } catch (error) {
      console.error("Failed to fetch result:", error);
      throw new Error("Failed to fetch analysis results");
    }
  };

  // Format AI response to match your UI structure
  const formatAIResponse = (aiData: any) => {
    // Ensure all required fields are present
    return {
      summary: aiData.summary || {
        totalIncome: 0,
        totalExpenses: 0,
        netCashFlow: 0,
        topSpendingCategories: [],
        savingsRate: 0,
      },
      insights: aiData.insights || ["No insights generated"],
      recommendations: aiData.recommendations || [
        "Connect real data for specific recommendations",
      ],
      trends: aiData.trends || ["Analysis based on sample data"],
      riskAssessment: aiData.riskAssessment || {
        level: "unknown",
        concerns: ["Insufficient data for risk assessment"],
        positiveSigns: ["Insufficient data for risk assessment"],
      },
    };
  };

  // Handle analysis request
  const handleAnalyze = async () => {
    if (!connected) {
      setError("Please connect your wallet to analyze transactions.");
      return;
    }

    setIsLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const filteredTransactions = filterTransactionsByPeriod();

      if (filteredTransactions.length === 0) {
        setError("No transactions found for the selected period.");
        setIsLoading(false);
        return;
      }

      // Send to AI agent and get reference
      const reference = await sendToAIAgent(filteredTransactions);

      // Wait a moment for processing, then fetch results
      setTimeout(async () => {
        try {
          const analysisResult = await fetchAIResult(reference);
          setAnalysis(analysisResult);
        } catch (err) {
          setError("Failed to get analysis results. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 5000); // Wait 5 seconds for processing
    } catch (err) {
      setError("Failed to analyze transactions. Please try again.");
      console.error(err);
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

  // Get color for risk level
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "green";
      case "medium":
        return "yellow";
      case "high":
        return "red";
      default:
        return "grey";
    }
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

        {taskRef && (
          <Message info style={{ marginTop: "1rem" }}>
            <Message.Header>Request ID</Message.Header>
            <p>Task Reference: {taskRef}</p>
          </Message>
        )}
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
          <p>
            This may take a few moments as we process your data on the AO
            network
          </p>
          <Progress percent={45} indicating style={{ marginTop: "1rem" }}>
            Processing with AI Agent
          </Progress>
        </Segment>
      )}

      {analysis && !isLoading && (
        <div>
          <Header as="h2">Financial Analysis Report</Header>

          {/* Risk Assessment Section */}
          {analysis.riskAssessment && (
            <>
              <Header as="h3" dividing>
                <Icon name="shield" />
                Risk Assessment
              </Header>

              <Message
                positive={analysis.riskAssessment.level === "low"}
                warning={analysis.riskAssessment.level === "medium"}
                negative={analysis.riskAssessment.level === "high"}
                style={{ marginBottom: "2rem" }}
              >
                <Message.Header>
                  Financial Health:{" "}
                  {analysis.riskAssessment.level.toUpperCase()}
                </Message.Header>

                {analysis.riskAssessment.concerns &&
                  analysis.riskAssessment.concerns.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                      <Header as="h4">Areas of Concern:</Header>
                      <List bulleted>
                        {analysis.riskAssessment.concerns.map(
                          (concern: string, index: number) => (
                            <List.Item key={index}>{concern}</List.Item>
                          )
                        )}
                      </List>
                    </div>
                  )}

                {analysis.riskAssessment.positiveSigns &&
                  analysis.riskAssessment.positiveSigns.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                      <Header as="h4">Positive Indicators:</Header>
                      <List bulleted>
                        {analysis.riskAssessment.positiveSigns.map(
                          (positive: string, index: number) => (
                            <List.Item key={index}>{positive}</List.Item>
                          )
                        )}
                      </List>
                    </div>
                  )}
              </Message>
            </>
          )}

          <Header as="h3" dividing>
            <Icon name="chart pie" />
            Financial Summary
          </Header>

          {analysis.summary && (
            <>
              <Card.Group itemsPerRow={3}>
                <Card color="green">
                  <Card.Content>
                    <Card.Header>Total Income</Card.Header>
                    <Card.Description>
                      {formatCurrency(analysis.summary.totalIncome || 0)}
                    </Card.Description>
                  </Card.Content>
                </Card>

                <Card color="red">
                  <Card.Content>
                    <Card.Header>Total Expenses</Card.Header>
                    <Card.Description>
                      {formatCurrency(analysis.summary.totalExpenses || 0)}
                    </Card.Description>
                  </Card.Content>
                </Card>

                <Card
                  color={
                    (analysis.summary.netCashFlow || 0) >= 0 ? "green" : "red"
                  }
                >
                  <Card.Content>
                    <Card.Header>Net Cash Flow</Card.Header>
                    <Card.Description>
                      {formatCurrency(analysis.summary.netCashFlow || 0)}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Card.Group>

              {analysis.summary.savingsRate !== undefined && (
                <Segment>
                  <Header as="h4">Savings Rate</Header>
                  <Progress
                    percent={Math.round(analysis.summary.savingsRate * 100)}
                    indicating
                    progress
                    success={analysis.summary.savingsRate >= 0.2}
                    warning={
                      analysis.summary.savingsRate >= 0.1 &&
                      analysis.summary.savingsRate < 0.2
                    }
                    error={analysis.summary.savingsRate < 0.1}
                  >
                    {Math.round(analysis.summary.savingsRate * 100)}% Savings
                    Rate
                  </Progress>
                </Segment>
              )}
            </>
          )}

          {analysis.summary &&
            analysis.summary.topSpendingCategories &&
            analysis.summary.topSpendingCategories.length > 0 && (
              <>
                <Header as="h4">Top Spending Categories</Header>
                <List divided relaxed>
                  {analysis.summary.topSpendingCategories.map(
                    (category: any, index: number) => (
                      <List.Item key={index}>
                        <List.Icon name="money bill alternate" />
                        <List.Content>
                          <List.Header>{category.category}</List.Header>
                          <List.Description>
                            {formatCurrency(category.amount)} (
                            {category.percentage}% of expenses)
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    )
                  )}
                </List>
              </>
            )}

          {analysis.insights && analysis.insights.length > 0 && (
            <>
              <Header as="h3" dividing>
                <Icon name="lightbulb" />
                Key Insights
              </Header>

              <List ordered>
                {analysis.insights.map((insight: string, index: number) => (
                  <List.Item key={index}>{insight}</List.Item>
                ))}
              </List>
            </>
          )}

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <>
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
            </>
          )}

          {analysis.trends && analysis.trends.length > 0 && (
            <>
              <Header as="h3" dividing>
                <Icon name="line graph" />
                Trends & Patterns
              </Header>

              <List bulleted>
                {analysis.trends.map((trend: string, index: number) => (
                  <List.Item key={index}>{trend}</List.Item>
                ))}
              </List>
            </>
          )}

          <Message info>
            <Message.Header>Powered by AO Computer</Message.Header>
            <p>
              This analysis was generated by our AI agent running on the
              decentralized AO computer. Your financial data remains private and
              under your control throughout the process.
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
            Select a time period and click "Analyze Transactions" to get started
            with our AI financial analysis.
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
