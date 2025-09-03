import { useState, useCallback } from "react";
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
import { useConnection } from "@arweave-wallet-kit/react";

import Navbar from "../../../components/Navbar";
import { useTransactionFetcher } from "../../../hooks/aihooks/useTransactionFetcher";
import { useAIAnalyzer } from "../../../hooks/aihooks/useAIAnalyzer";

const AIAnalysisPage = () => {
  const { connected } = useConnection();
  const [days, setDays] = useState("30");
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const { fetchTransactions, isFetching } = useTransactionFetcher();
  const { analyzeTransactions, isAnalyzing, taskRef } = useAIAnalyzer();

  const userContext = {
    income: 50000,
    goals: "Save for retirement, buy a house",
    riskTolerance: "Medium",
  };

  const handleAnalyze = useCallback(async () => {
    if (!connected) {
      setError("Please connect your wallet to analyze transactions.");
      return;
    }

    setError("");
    setAnalysis(null);

    try {
      // Fetch transactions with CURRENT days value
      console.log(days);
      const transactions = await fetchTransactions(days);

      // Analyze with CURRENT days value
      const analysisResult = await analyzeTransactions(
        transactions,
        days,
        userContext
      );
      setAnalysis(analysisResult);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze transactions";
      setError(errorMessage);
    }
  }, [connected, days, fetchTransactions, analyzeTransactions]);

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
              disabled={!connected || isFetching || isAnalyzing}
            />
          </Form.Field>
        </Form>

        <Button
          primary
          onClick={handleAnalyze}
          disabled={!connected || isFetching || isAnalyzing}
          style={{ marginTop: "1rem" }}
        >
          <Icon name="cloud" />
          {isFetching
            ? "Fetching Transactions..."
            : isAnalyzing
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

      {(isFetching || isAnalyzing) && (
        <Segment textAlign="center">
          <Loader active inline="centered" size="large">
            {isFetching
              ? "Fetching your transactions..."
              : "Analyzing your transactions..."}
          </Loader>
          <p>
            {isFetching
              ? "Retrieving your financial data from the AO network"
              : "This may take a few moments as we process your data on the AO network"}
          </p>
          {isAnalyzing && (
            <Progress percent={45} indicating style={{ marginTop: "1rem" }}>
              Processing with AI Agent
            </Progress>
          )}
        </Segment>
      )}

      {analysis && (
        <div>
          <Header as="h2">Financial Analysis Report</Header>

          {/* Risk Assessment Section */}
          {analysis.riskAssessment && (
            <>
              <Header as="h3" dividing>
                <Icon name="shield" /> Risk Assessment
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
            <Icon name="chart pie" /> Financial Summary
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
                <Icon name="lightbulb" /> Key Insights
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
                <Icon name="rocket" /> Actionable Recommendations
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
                <Icon name="line graph" /> Trends & Patterns
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
              decentralized AO computer.
            </p>
          </Message>
        </div>
      )}

      {!analysis && !isFetching && !isAnalyzing && connected && (
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

      {!connected && !isFetching && !isAnalyzing && (
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
