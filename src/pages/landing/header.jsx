import React, { Component } from "react";
import { InView } from "react-intersection-observer";
import {
  Button,
  Container,
  Menu,
  Segment,
  Icon,
  Sidebar,
  Header as SemanticHeader,
} from "semantic-ui-react";
import { Media } from "@artsy/fresnel";

const HomepageHeading = ({ mobile }) => (
  <Container text>
    <SemanticHeader
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
    <SemanticHeader
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
      Track your income and expenses, then let your personal AI agent invest the
      surplus based on your financial health. Your agent is completely sovereign
      and owned by you - deposit or withdraw anytime.
    </p>

    <Button primary size="huge">
      Go to App.
      <Icon name="right arrow" />
    </Button>
  </Container>
);

class DesktopHeader extends Component {
  state = {};

  toggleFixedMenu = (inView) => this.setState({ fixed: !inView });

  render() {
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
                <Menu.Item position="right">
                  <Button
                    as="a"
                    inverted={!fixed}
                    primary={fixed}
                    style={{ marginLeft: "0.5em" }}
                  >
                    Go to App
                  </Button>
                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </InView>
      </Media>
    );
  }
}

class MobileHeader extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { sidebarOpened } = this.state;

    return (
      <Media at="mobile">
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
            <Menu.Item as="a">Log in</Menu.Item>
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
                  <Menu.Item position="right">
                    <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
                      Go to App.
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>
              <HomepageHeading mobile />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    );
  }
}

const Header = () => (
  <>
    <DesktopHeader />
    <MobileHeader />
  </>
);

export default Header;
