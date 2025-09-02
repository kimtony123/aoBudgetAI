// src/components/LoadingWithError.jsx
import React from "react";
import { Dimmer, Loader, Message, Icon } from "semantic-ui-react";

const LoadingWithError = ({ loading, error, onRetry, children }) => {
  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader size="large">Loading...</Loader>
      </Dimmer>
    );
  }

  if (error) {
    return (
      <Message warning>
        <Icon name="warning circle" />
        <Message.Content>
          <Message.Header>Loading Failed</Message.Header>
          <p>Failed to load content. Please try again.</p>
          {onRetry && (
            <Button primary size="small" onClick={onRetry}>
              Retry
            </Button>
          )}
        </Message.Content>
      </Message>
    );
  }

  return children;
};

export default LoadingWithError;
