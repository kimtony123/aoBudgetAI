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

// Custom hook for navigation
const useNavigation = () => {
  const navigate = useNavigate();
  const createClickHandler = (path: string) => () => {
    navigate(path);
  };
  return createClickHandler;
};

const AddCategory = () => {
  const handleClick = useNavigation();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!name || !icon || !type) {
      setError("Please fill in all fields");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Category data:", { name, icon, type, description });

    // Show success message
    setSuccess(true);
    setError("");

    // Reset form
    setName("");
    setIcon("");
    setType("");
    setDescription("");

    // Hide success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Container style={{ marginTop: "2em", maxWidth: "600px" }}>
      <Header as="h1">Create Category</Header>

      <Header as="h4" color="grey">
        Categories are used to group your transactions and track spending
        patterns.
      </Header>

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
          />
        </Form.Field>
        <Form.Field>
          <label>Description.</label>
          <input
            placeholder="It will help with AI analysis"
            value={description}
            onChange={(e) => setName(e.target.value)}
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
          />
        </Form.Field>

        <Grid>
          <Grid.Column width={8}>
            <Button type="submit" primary fluid>
              <Icon name="save" />
              Create Category
            </Button>
          </Grid.Column>
          <Grid.Column width={8}>
            <Button type="button" fluid onClick={handleClick("/transactions")}>
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
