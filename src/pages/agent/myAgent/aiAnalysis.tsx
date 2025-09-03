import { useState } from "react";
import {
  Container,
  Header,
  Button,
  Icon,
  Segment,
  Loader,
  Message,
  Card,
  List,
  Divider,
  Progress,
  Form,
  Input,
} from "semantic-ui-react";
import {
  message,
  dryrun,
  createDataItemSigner,
  result,
} from "@permaweb/aoconnect";
import { useConnection } from "@arweave-wallet-kit/react";

import Navbar from "../../../components/Navbar";
import {
  createAnalysisPrompt,
  enrichTransactions,
} from "../../../utils/promptUtils";

// Your AO Process ID for the AI agent
const YOUR_AO_PROCESS_ID = "CAqAjfPkvBJqtog9OrxUaS3iIVEcGzNkVlDwDM-e-dA";
const trackerProcess = "Ejr_9-PPwg9RV7FFilWIeap6Zm0CdmUEbevGzPwAOd0";

const AIAnalysisPage = () => {
  const { connected } = useConnection();
  const [days, setDays] = useState("30");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState("");
  const [taskRef, setTaskRef] = useState("");
  const [userContext, setUserContext] = useState({
    income: 50000,
    goals: "Save for retirement, buy a house",
    riskTolerance: "Medium",
  });

  // Fetch transactions from AO process
  const fetchTransactions = async () => {
    if (!connected) {
      throw new Error("Wallet not connected");
    }

    setIsFetching(true);
    setError("");

    try {
      const messageResponse = await message({
        process: trackerProcess,
        tags: [
          { name: "Action", value: "FetchUserTransactionsDays" },
          { name: "days", value: days },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const resultResponse = await result({
        message: messageResponse,
        process: trackerProcess,
      });

      const { Messages, Error } = resultResponse;

      if (Error) {
        throw new Error("Error fetching transactions: " + Error);
      }

      if (!Messages || Messages.length === 0) {
        throw new Error("No transactions found");
      }

      const lastMessage = Messages[Messages.length - 1];
      const messageData = JSON.parse(lastMessage.Data);

      if (messageData && messageData.code === 200) {
        return messageData.data;
      } else {
        throw new Error(messageData.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

  // Send transactions to AI agent for analysis
  const sendToAIAgent = async (transactions: any[]) => {
    if (transactions.length === 0) {
      throw new Error("No transactions to analyze");
    }

    const ref = Date.now().toString();
    setTaskRef(ref);

    // Enrich transactions with additional data
    const enrichedTransactions = enrichTransactions(transactions);

    // Create the optimized prompt
    const prompt = createAnalysisPrompt(
      enrichedTransactions,
      `last${days}days`,
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
      // Step 1: Fetch transactions
      const transactions = await fetchTransactions();

      // Check if we have transactions
      if (!transactions || transactions.length === 0) {
        setError("No transactions found for the selected period.");
        setIsLoading(false);
        return;
      }

      // Step 2: Send to AI agent
      const reference = await sendToAIAgent(transactions);

      // Step 3: Wait a moment for processing, then fetch results
      setTimeout(async () => {
        try {
          const analysisResult = await fetchAIResult(reference);
          setAnalysis(analysisResult);
        } catch (err) {
          // Fix: Properly handle the unknown error type
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to get analysis results. Please try again.";
          setError(errorMessage);
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 30000); // Wait 5 seconds for processing
    } catch (err) {
      // Fix: Properly handle the unknown error type
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get analysis results. Please try again.";
      setError(errorMessage);
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
        <Form>
          <Form.Field>
            <label>Number of days to analyze</label>
            <Input
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Enter days (1-365)"
              disabled={!connected || isFetching}
            />
          </Form.Field>
        </Form>

        <Button
          primary
          onClick={handleAnalyze}
          disabled={isLoading || !connected || isFetching}
          style={{ marginTop: "1rem" }}
        >
          <Icon name="cloud" />
          {isFetching
            ? "Fetching Transactions..."
            : isLoading
            ? "Analyzing..."
            : "Analyze Transactions"}
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

      {isFetching && (
        <Segment textAlign="center">
          <Loader active inline="centered" size="large">
            Fetching your transactions...
          </Loader>
          <p>Retrieving your financial data from the AO network</p>
        </Segment>
      )}

      {isLoading && !isFetching && (
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
            Enter the number of days and click "Analyze Transactions" to get
            started with our AI financial analysis.
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
