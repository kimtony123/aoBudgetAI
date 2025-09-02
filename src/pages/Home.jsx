import { createMedia } from "@artsy/fresnel";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { InView } from "react-intersection-observer";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
  Card,
  Statistic,
  Progress,
  Label,
  Tab,
} from "semantic-ui-react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

// Custom hook for navigation
const useNavigation = () => {
  const navigate = useNavigate();

  // Function that returns a click handler for a specific route
  const createClickHandler = (path) => () => {
    navigate(path);
  };

  return createClickHandler;
};

const HomepageHeading = ({ mobile }) => {
  const handleClick = useNavigation();

  return (
    <Container text>
      <Header
        as="h1"
        content="aoBudgetAI"
        inverted
        style={{
          fontSize: mobile ? "2em" : "4em",
          fontWeight: "normal",
          marginBottom: 0,
          marginTop: mobile ? "1.5em" : "3em",
        }}
      />
      <Header
        as="h2"
        content="The Budget Tracker That Invests For You"
        inverted
        style={{
          fontSize: mobile ? "1.5em" : "1.7em",
          fontWeight: "normal",
          marginTop: mobile ? "0.5em" : "1.5em",
        }}
      />
      <p
        style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: mobile ? "1.2em" : "1.3em",
          marginBottom: "1.5em",
        }}
      >
        Track your income and expenses, then let your personal AI agent invest
        the surplus based on your financial health. Your agent is completely
        sovereign and owned by you - deposit or withdraw anytime.
      </p>

      <Button primary size="large" onClick={handleClick("/trackerdashboard")}>
        Go to App.
      </Button>
    </Container>
  );
};

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
};

class DesktopContainer extends Component {
  state = {};

  toggleFixedMenu = (inView) => this.setState({ fixed: !inView });

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return (
      <Media greaterThan="mobile">
        <InView onChange={this.toggleFixedMenu}>
          <Segment
            inverted
            textAlign="center"
            style={{
              minHeight: 700,
              padding: "1em 0em",
              background: "linear-gradient(135deg, #0f2f3f 0%, #1a202c 100%)",
            }}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item as="a" active>
                  Home
                </Menu.Item>
                <Menu.Item as="a">Budget</Menu.Item>
                <Menu.Item as="a">AI Agents</Menu.Item>
                <Menu.Item as="a">Investments</Menu.Item>
                <Menu.Item as="a">Reports</Menu.Item>
                <Menu.Item position="right"></Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </InView>

        {children}
      </Media>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Media as={Sidebar.Pushable} at="mobile">
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item as="a" active>
              Home
            </Menu.Item>
            <Menu.Item as="a">Budget</Menu.Item>
            <Menu.Item as="a">AI Agents</Menu.Item>
            <Menu.Item as="a">Investments</Menu.Item>
            <Menu.Item as="a">Reports</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign="center"
              style={{
                minHeight: 350,
                padding: "1em 0em",
                background: "linear-gradient(135deg, #0f2f3f 0%, #1a202c 100%)",
              }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size="large">
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                  <Menu.Item position="right"></Menu.Item>
                </Menu>
              </Container>
              <HomepageHeading mobile />
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveContainer = ({ children }) => (
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const BudgetTrackingSection = () => (
  <Container text>
    <Header
      as="h2"
      textAlign="center"
      style={{ fontSize: "2.5em", marginBottom: "1em" }}
    >
      Comprehensive Budget Tracking
    </Header>

    <Grid stackable columns={2}>
      <Grid.Column>
        <Header as="h3" icon>
          <Icon name="money bill alternate" />
          Income Tracking
        </Header>
        <p>
          Easily track all your income sources with automatic categorization and
          recurring income detection.
        </p>

        <List>
          <List.Item>
            <Icon name="check" color="green" />
            Multiple income streams support
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Automatic categorization
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Recurring income detection
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Income forecasting
          </List.Item>
        </List>
      </Grid.Column>

      <Grid.Column>
        <Header as="h3" icon>
          <Icon name="shopping cart" />
          Expense Tracking
        </Header>
        <p>
          Monitor your spending with detailed categorization and identify areas
          where you can save more.
        </p>

        <List>
          <List.Item>
            <Icon name="check" color="green" />
            Smart expense categorization
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Spending limit alerts
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Recurring bill tracking
          </List.Item>
          <List.Item>
            <Icon name="check" color="green" />
            Custom budget categories
          </List.Item>
        </List>
      </Grid.Column>
    </Grid>

    <Divider hidden />

    <Header as="h3" textAlign="center">
      Your Financial Data Powers Your AI Investment Agent
    </Header>
    <p style={{ textAlign: "center", fontSize: "1.2em" }}>
      The more accurately you track your finances, the better your AI agent can
      optimize your investments. Your budget data directly informs your agent's
      investment strategy.
    </p>
  </Container>
);

const AIIntegrationSection = () => (
  <Container text>
    <Header
      as="h2"
      textAlign="center"
      style={{ fontSize: "2.5em", marginBottom: "1em" }}
    >
      From Budgeting to Investing with AI
    </Header>

    <Grid stackable columns={4} className="process-steps">
      <Grid.Column>
        <div className="step-item">
          <Icon name="edit" size="big" className="step-icon" />
          <div className="step-content">
            <h4>Track Finances</h4>
            <p>Record income and expenses</p>
          </div>
        </div>
      </Grid.Column>

      <Grid.Column>
        <div className="step-item">
          <Icon name="chart pie" size="big" className="step-icon" />
          <div className="step-content">
            <h4>Analyze Patterns</h4>
            <p>WealthAI calculates your financial health</p>
          </div>
        </div>
      </Grid.Column>

      <Grid.Column>
        <div className="step-item">
          <Icon name="cogs" size="big" className="step-icon" />
          <div className="step-content">
            <h4>AI Agent Acts</h4>
            <p>Your agent invests based on your finances</p>
          </div>
        </div>
      </Grid.Column>

      <Grid.Column>
        <div className="step-item">
          <Icon name="chart line" size="big" className="step-icon" />
          <div className="step-content">
            <h4>Grow Wealth</h4>
            <p>Watch your investments grow automatically</p>
          </div>
        </div>
      </Grid.Column>
    </Grid>

    <Divider hidden />

    <Header as="h3">How Your Budget Data Guides Investments</Header>

    <Card.Group itemsPerRow={2} stackable>
      <Card>
        <Card.Content>
          <Card.Header>
            <Icon name="calculator" /> Financial Health Score
          </Card.Header>
          <Card.Description>
            <p>
              Based on your income and expense tracking, WealthAI calculates a
              financial health score that determines your investment strategy:
            </p>

            <List>
              <List.Item>
                <Label color="green" horizontal>
                  ≥ 3.0
                </Label>{" "}
                Strong - Growth focus (AR assets)
              </List.Item>
              <List.Item>
                <Label color="yellow" horizontal>
                  2.0-3.0
                </Label>{" "}
                Stable - Balanced approach
              </List.Item>
              <List.Item>
                <Label color="red" horizontal>
                  &lt; 2.0
                </Label>{" "}
                Conservative - Stability focus (PI assets)
              </List.Item>
            </List>
          </Card.Description>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Card.Header>
            <Icon name="user cog" /> Your Sovereign AI Agent
          </Card.Header>
          <Card.Description>
            <p>Your personal AI agent that you fully control:</p>

            <List>
              <List.Item>
                <Icon name="key" color="blue" />
                Completely sovereign and owned by you
              </List.Item>
              <List.Item>
                <Icon name="money bill wave" color="green" />
                Deposit and withdraw funds anytime
              </List.Item>
              <List.Item>
                <Icon name="sliders horizontal" color="orange" />
                Adjust investment parameters as needed
              </List.Item>
              <List.Item>
                <Icon name="shield" color="purple" />
                Operates based on your budget data
              </List.Item>
            </List>
          </Card.Description>
        </Card.Content>
      </Card>
    </Card.Group>
  </Container>
);

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

              <Card style={{ marginTop: "2em" }}>
                <Card.Content>
                  <Card.Header>Income by Category</Card.Header>
                  <Card.Description>
                    <List>
                      <List.Item>
                        <Icon name="money" /> Salary: $12,000
                        <Progress
                          value={70}
                          total={100}
                          progress="percent"
                          style={{ marginTop: "0.5em" }}
                        />
                      </List.Item>
                      <List.Item>
                        <Icon name="line graph" /> Investments: $1450
                        <Progress
                          value={60}
                          total={100}
                          progress="percent"
                          style={{ marginTop: "0.5em" }}
                        />
                      </List.Item>
                      <List.Item>
                        <Icon name="book" /> Dividends: $1200
                        <Progress
                          value={40}
                          total={100}
                          progress="percent"
                          style={{ marginTop: "0.5em" }}
                        />
                      </List.Item>
                    </List>
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
            </Grid.Column>
          </Grid>
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
                <Grid>
                  <Grid.Row>
                    <Statistic>
                      <Statistic.Value>+12.7%</Statistic.Value>
                      <Statistic.Label>Portfolio Growth</Statistic.Label>
                    </Statistic>
                  </Grid.Row>
                  <Grid.Row>
                    <Statistic>
                      <Statistic.Value>+8.3%</Statistic.Value>
                      <Statistic.Label>AR Performance</Statistic.Label>
                    </Statistic>
                  </Grid.Row>
                  <Grid.Row>
                    <Statistic>
                      <Statistic.Value>+4.2%</Statistic.Value>
                      <Statistic.Label>PI Performance</Statistic.Label>
                    </Statistic>
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

const HomepageLayout = () => {
  const handleClick = useNavigation();

  return (
    <ResponsiveContainer>
      {/* Budget Tracking Section */}
      <Segment style={{ padding: "8em 0em" }} vertical>
        <BudgetTrackingSection />
      </Segment>

      {/* AI Integration Section */}
      <Segment style={{ padding: "8em 0em", background: "#f9f9f9" }} vertical>
        <AIIntegrationSection />
      </Segment>

      {/* Dashboard Preview */}
      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container>
          <Header
            as="h2"
            textAlign="center"
            style={{ fontSize: "2.5em", marginBottom: "2em" }}
          >
            Your All-in-One Financial Dashboard
          </Header>
          <DashboardTabs />
        </Container>
      </Segment>

      {/* Features Section */}
      <Segment style={{ padding: "8em 0em", background: "#f9f9f9" }} vertical>
        <Container>
          <Header
            as="h2"
            textAlign="center"
            style={{ fontSize: "2.5em", marginBottom: "2em" }}
          >
            Why aoBudgetAI Stands Out
          </Header>

          <Grid columns={2} stackable>
            <Grid.Row>
              <Grid.Column>
                <Header as="h3">
                  <Icon name="chart line" />
                  Complete Budget Tracking
                </Header>
                <p>
                  aoBudgetAI provides comprehensive tools to track all your
                  income and expenses, giving you a clear picture of your
                  financial health. Unlike other budget trackers, we use this
                  data to power your investments.
                </p>
              </Grid.Column>
              <Grid.Column>
                <Header as="h3">
                  <Icon name="robot" />
                  AI-Powered Investing
                </Header>
                <p>
                  Our unique AI agents analyze your budget data and
                  automatically invest your surplus funds. The better you track
                  your finances, the smarter your investments become.
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as="h3">
                  <Icon name="user shield" />
                  Sovereign Agents
                </Header>
                <p>
                  Your AI agents are completely owned and controlled by you.
                  Deposit or withdraw funds anytime, and adjust your investment
                  strategy based on changes in your financial situation.
                </p>
              </Grid.Column>
              <Grid.Column>
                <Header as="h3">
                  <Icon name="sync" />
                  Adaptive Strategy
                </Header>
                <p>
                  As your financial health changes, your AI agent automatically
                  adjusts its investment strategy between growth-focused assets
                  (AR) and stability-focused assets (PI).
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>

      {/* CTA Section */}
      <Segment style={{ padding: "8em 0em" }} vertical textAlign="center">
        <Container>
          <Header as="h2" style={{ fontSize: "2.5em" }}>
            Start Tracking & Investing Today
          </Header>
          <p
            style={{
              fontSize: "1.33em",
              maxWidth: "800px",
              margin: "0 auto 2em",
            }}
          >
            Join the only budget tracker that turns your financial data into
            intelligent investments. Take control of your finances and watch
            your wealth grow automatically.
          </p>

          <Button
            primary
            size="large"
            onClick={handleClick("/trackerdashboard")}
          >
            Go to App.
          </Button>
          <p style={{ marginTop: "1em" }}>
            <small>Connect your wallet and start in minutes</small>
          </p>
        </Container>
      </Segment>

      {/* Footer */}
      <Segment inverted vertical style={{ padding: "5em 0em" }}>
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="WealthAI" />
                <List link inverted>
                  <List.Item as="a">About Us</List.Item>
                  <List.Item as="a">Contact</List.Item>
                  <List.Item as="a">Privacy Policy</List.Item>
                  <List.Item as="a">Terms of Service</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Features" />
                <List link inverted>
                  <List.Item as="a">Budget Tracking</List.Item>
                  <List.Item as="a">AI Agents</List.Item>
                  <List.Item as="a">Investment Management</List.Item>
                  <List.Item as="a">Financial Reports</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Resources" />
                <List link inverted>
                  <List.Item as="a">Documentation</List.Item>
                  <List.Item as="a">API</List.Item>
                  <List.Item as="a">Tutorials</List.Item>
                  <List.Item as="a">Support</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header as="h4" inverted>
                  The Budget Tracker That Invests For You
                </Header>
                <p>
                  aoBudgetAI combines comprehensive budget tracking with
                  AI-powered investment management. Track your income and
                  expenses, then let your personal AI agent grow your wealth
                  based on your financial health.
                </p>

                <Button
                  primary
                  size="large"
                  onClick={handleClick("/trackerdashboard")}
                >
                  Go to App.
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </ResponsiveContainer>
  );
};

export default HomepageLayout;
