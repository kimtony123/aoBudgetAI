import React, { useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Header,
  Message,
  Icon,
  Grid,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useConnection } from "@arweave-wallet-kit/react";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";

const AddCategory = () => {
  const { connected } = useConnection();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trackerProcess = "Ejr_9-PPwg9RV7FFilWIeap6Zm0CdmUEbevGzPwAOd0";

  // Type options for dropdown
  const typeOptions = [
    {
      key: "expense",
      text: "Expense",
      value: "expense",
      icon: "money bill alternate outline",
    },
    {
      key: "income",
      text: "Income",
      value: "income",
      icon: "dollar sign",
    },
  ];

  // Common icons for categories
  const commonIcons = [
    "food",
    "home",
    "car",
    "shopping bag",
    "heart",
    "laptop",
    "phone",
    "game",
    "book",
    "gift",
    "travel",
    "education",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!name || !icon || !type) {
      setError("Please fill in all required fields");
      return;
    }

    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Send category to AO process with individual tags (best practice)
      const messageResponse = await message({
        process: trackerProcess,
        tags: [
          { name: "Action", value: "AddCategory" },
          { name: "name", value: name },
          { name: "icon", value: icon },
          { name: "type", value: type },
          { name: "description", value: description },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const resultResponse = await result({
        message: messageResponse,
        process: trackerProcess,
      });

      const { Messages, Error: errorMessage } = resultResponse;

      if (errorMessage) {
        setError("Error creating category: " + errorMessage);
        return;
      }

      if (!Messages || Messages.length === 0) {
        setError("No response from server");
        return;
      }

      const lastMessage = Messages[Messages.length - 1];
      const messageData = JSON.parse(lastMessage.Data);

      if (messageData && messageData.code === 200) {
        // Show success message
        setSuccess(true);

        // Reset form
        setName("");
        setIcon("");
        setType("");
        setDescription("");

        // Redirect after success
        setTimeout(() => {
          navigate("/trackerdashboard");
        }, 1500);
      } else {
        setError(messageData.message || "Failed to create category");
      }
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container style={{ marginTop: "2em", maxWidth: "600px" }}>
      <Header as="h1">Create Category</Header>

      <Header as="h4" color="grey">
        Categories are used to group your transactions and track spending
        patterns.
      </Header>

      {/* Wallet Connection Warning */}
      {!connected && (
        <Message warning>
          <Message.Header>Wallet Not Connected</Message.Header>
          <p>Please connect your wallet to create categories.</p>
        </Message>
      )}

      {success && (
        <Message positive>
          <Message.Header>Success!</Message.Header>
          <p>Your category has been created successfully.</p>
        </Message>
      )}

      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Name</label>
          <input
            placeholder="e.g., Groceries, Salary, Rent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!connected}
          />
        </Form.Field>

        <Form.Field>
          <label>Icon</label>
          <Dropdown
            placeholder="Select an icon"
            fluid
            selection
            options={commonIcons.map((icon) => ({
              key: icon,
              text: icon.charAt(0).toUpperCase() + icon.slice(1),
              value: icon,
              icon: icon,
            }))}
            value={icon}
            onChange={(_e, { value }) => setIcon(value as string)}
            disabled={!connected}
          />
        </Form.Field>

        <Form.Field>
          <label>Description</label>
          <input
            placeholder="It will help with AI analysis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!connected}
          />
        </Form.Field>

        <Form.Field>
          <label>Type</label>
          <Dropdown
            placeholder="Select type"
            fluid
            selection
            options={typeOptions}
            value={type}
            onChange={(_e, { value }) => setType(value as string)}
            disabled={!connected}
          />
        </Form.Field>

        <Grid>
          <Grid.Column width={8}>
            <Button
              type="submit"
              primary
              fluid
              disabled={!connected || isSubmitting}
              loading={isSubmitting}
            >
              <Icon name="save" />
              Create Category
            </Button>
          </Grid.Column>
          <Grid.Column width={8}>
            <Button
              type="button"
              fluid
              disabled={isSubmitting}
              onClick={() => navigate("/trackerdashboard")}
            >
              <Icon name="cancel" />
              Cancel
            </Button>
          </Grid.Column>
        </Grid>
      </Form>

      <Header as="h3" style={{ marginTop: "2em" }}>
        Why categorize transactions?
      </Header>
      <p>
        Categorizing your transactions helps you understand where your money is
        going, identify spending patterns, and create better budgets. You can
        assign each transaction to a category to track expenses and income more
        effectively.
      </p>

      <Header as="h4">Expense Categories</Header>
      <p>
        Expense categories represent money going out, such as groceries, rent,
        utilities, entertainment, and transportation.
      </p>

      <Header as="h4">Income Categories</Header>
      <p>
        Income categories represent money coming in, such as salary, freelance
        work, investments, and gifts.
      </p>
    </Container>
  );
};

export default AddCategory;
