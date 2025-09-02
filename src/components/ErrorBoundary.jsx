// src/components/ErrorBoundary.jsx
import React from "react";
import { Message, Icon, Container, Header } from "semantic-ui-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container style={{ padding: "2em" }}>
          <Message negative size="large">
            <Icon name="exclamation circle" />
            <Message.Content>
              <Message.Header>Something went wrong</Message.Header>
              <p>
                This component encountered an unexpected error. Our team has
                been notified.
              </p>

              {this.props.showDetails && (
                <details style={{ marginTop: "1em", color: "#666" }}>
                  <summary>Error Details</summary>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo &&
                      this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </Message.Content>
          </Message>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Default props
ErrorBoundary.defaultProps = {
  showDetails: process.env.NODE_ENV === "development",
};

export default ErrorBoundary;
