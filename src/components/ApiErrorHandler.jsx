// src/components/ApiErrorHandler.jsx
import React from "react";
import { Message, Icon, Button, Container } from "semantic-ui-react";

const ApiErrorHandler = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  const getErrorContent = () => {
    switch (error.code) {
      case 404:
        return {
          header: "Resource Not Found",
          content:
            "The requested resource could not be found. It may have been moved or deleted.",
          icon: "search",
        };
      case 500:
        return {
          header: "Server Error",
          content:
            "Our servers are experiencing issues. Please try again later.",
          icon: "server",
        };
      case 403:
        return {
          header: "Access Denied",
          content: "You do not have permission to access this resource.",
          icon: "ban",
        };
      default:
        return {
          header: "Something Went Wrong",
          content: "An unexpected error occurred. Please try again.",
          icon: "exclamation triangle",
        };
    }
  };

  const { header, content, icon } = getErrorContent();

  return (
    <Container style={{ marginBottom: "1em" }}>
      <Message
        negative={error.code >= 400 && error.code < 500}
        warning={error.code >= 500}
        onDismiss={onDismiss}
      >
        <Icon name={icon} />
        <Message.Content>
          <Message.Header>{header}</Message.Header>
          <p>{content}</p>
          {error.message && process.env.NODE_ENV === "development" && (
            <p style={{ color: "#666", fontSize: "0.9em" }}>
              Details: {error.message}
            </p>
          )}
          {onRetry && (
            <Button
              primary
              size="small"
              onClick={onRetry}
              style={{ marginTop: "0.5em" }}
            >
              <Icon name="refresh" />
              Try Again
            </Button>
          )}
        </Message.Content>
      </Message>
    </Container>
  );
};

export default ApiErrorHandler;
