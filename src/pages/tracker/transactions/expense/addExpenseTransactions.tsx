import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Header,
  Message,
  Button,
  Icon,
  Grid,
  Popup,
  Loader,
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useConnection } from "@arweave-wallet-kit/react";
import { useNavigation } from "../../../../hooks/useNavigation";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import type { CategoryTransactions } from "../../../../types";

const AddExpenseTransaction = () => {
  const { connected } = useConnection();
  const handleClick = useNavigation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryTransactions[]>([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // This will store the CATEGORY ID
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const trackerProcess = "Ejr_9-PPwg9RV7FFilWIeap6Zm0CdmUEbevGzPwAOd0";

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "amount":
        setAmount(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  // Handle dropdown changes - CRITICAL: We're storing the CATEGORY ID here
  const handleDropdownChange = (_e: React.SyntheticEvent, data: any) => {
    // data.value contains the category ID from the dropdown options
    setCategory(data.value);
  };

  // Handle date selection
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  // Fetch categories from AO process
  const fetchCategories = async () => {
    if (!connected) return;

    setIsLoading(true);
    setError("");

    try {
      const messageResponse = await message({
        process: trackerProcess,
        tags: [{ name: "Action", value: "FetchUserCategories" }],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const resultResponse = await result({
        message: messageResponse,
        process: trackerProcess,
      });

      const { Messages, Error: errorMessage } = resultResponse;

      if (errorMessage) {
        setError("Error fetching categories: " + errorMessage);
        return;
      }

      if (!Messages || Messages.length === 0) {
        setError("No categories found");
        return;
      }

      const lastMessage = Messages[Messages.length - 1];
      const messageData = JSON.parse(lastMessage.Data);

      if (messageData && messageData.code === 200) {
        // Filter for expense categories only
        const expenseCategories = messageData.data.filter(
          (cat: CategoryTransactions) => cat.type.toLowerCase() === "expense"
        );
        setCategories(expenseCategories);

        // Redirect if no expense categories found
        if (expenseCategories.length === 0) {
          setError(
            "No expense categories found. Please add some categories first."
          );
          setTimeout(() => {
            handleClick("/addCategory")();
          }, 2000);
        }
      } else {
        setError(messageData.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission with individual tags
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !category || // This is the CATEGORY ID
      !description ||
      !selectedDate ||
      !amount ||
      parseFloat(amount) <= 0
    ) {
      setError("Please fill in all fields with valid values");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Format the date properly
      const dateStr = selectedDate.toISOString().split("T")[0];
      const amountNum = parseFloat(amount);

      // Send transaction to AO process with individual tags (best practice)
      const messageResponse = await message({
        process: trackerProcess,
        tags: [
          { name: "Action", value: "AddTransaction" },
          { name: "catergoryId", value: category }, // Sending CATEGORY ID here
          { name: "description", value: description },
          { name: "date", value: dateStr },
          { name: "type", value: "expense" },
          { name: "amount", value: amountNum.toString() },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const resultResponse = await result({
        message: messageResponse,
        process: trackerProcess,
      });

      const { Messages, Error: errorMessage } = resultResponse;

      if (errorMessage) {
        setError("Error adding transaction: " + errorMessage);
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
        setDescription("");
        setCategory(""); // Reset to empty string (no category selected)
        setAmount("");
        setSelectedDate(new Date());

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(messageData.message || "Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update categories when connection status changes
  useEffect(() => {
    if (connected) {
      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [connected]);

  // Get category options for expenses - CRITICAL: Using ID as value
  const getCategoryOptions = () => {
    return categories.map((category) => ({
      key: category.id,
      text: category.name,
      value: category.id, // THIS IS CRITICAL - Using ID as the value
      icon: category.icon || "money",
    }));
  };

  // Custom input component for the date picker
  const CustomDateInput = React.forwardRef<HTMLInputElement, any>(
    ({ value, onClick }, ref) => (
      <Form.Input
        label="Date"
        value={value}
        onClick={onClick}
        ref={ref}
        icon="calendar"
        iconPosition="left"
        readOnly
      />
    )
  );

  return (
    <Container style={{ marginTop: "2em", maxWidth: "600px" }}>
      <Header as="h1">Add Expense</Header>

      {/* Wallet Connection Warning */}
      {!connected && (
        <Message warning>
          <Message.Header>Wallet Not Connected</Message.Header>
          <p>Please connect your wallet to add expenses.</p>
        </Message>
      )}

      {success && (
        <Message positive>
          <Message.Header>Success!</Message.Header>
          <p>Your expense has been added successfully.</p>
        </Message>
      )}

      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}

      {isLoading && (
        <Message info>
          <Message.Header>Loading Categories</Message.Header>
          <p>Please wait while we fetch your expense categories...</p>
          <Loader active inline="centered" />
        </Message>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Select
          label="Category"
          name="category"
          placeholder="Select a category"
          fluid
          selection
          options={getCategoryOptions()}
          value={category} // This holds the CATEGORY ID
          onChange={handleDropdownChange}
          disabled={!connected || isLoading || categories.length === 0}
        />

        <Form.Input
          label="Description"
          name="description"
          placeholder="Enter a description for this expense"
          value={description}
          onChange={handleInputChange}
          disabled={!connected}
        />

        <Form.Field>
          <label>Date</label>
          <Popup
            wide
            trigger={
              <div>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  customInput={<CustomDateInput />}
                  popperClassName="date-picker-popper"
                />
              </div>
            }
            content={
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
              />
            }
            on="click"
            position="bottom left"
            open={showDatePicker}
            onOpen={() => setShowDatePicker(true)}
            onClose={() => setShowDatePicker(false)}
          />
        </Form.Field>

        <Form.Input
          type="number"
          label="Amount ($)"
          name="amount"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={amount}
          onChange={handleInputChange}
          disabled={!connected}
        />

        <Grid>
          <Grid.Column width={8}>
            <Button
              type="submit"
              primary
              fluid
              disabled={
                !connected ||
                isLoading ||
                isSubmitting ||
                categories.length === 0
              }
              loading={isSubmitting}
            >
              <Icon name="save" />
              Add Expense
            </Button>
          </Grid.Column>
          <Grid.Column width={8}>
            <Button
              type="button"
              fluid
              onClick={handleClick("/trackerdashboard")}
            >
              <Icon name="cancel" />
              Cancel
            </Button>
          </Grid.Column>
        </Grid>
      </Form>

      {categories.length === 0 && connected && !isLoading && (
        <Message info>
          <Message.Header>No Expense Categories Found</Message.Header>
          <p>You need to create expense categories before adding expenses.</p>
          <Button primary onClick={handleClick("/addCategory")}>
            <Icon name="plus" />
            Add Categories
          </Button>
        </Message>
      )}

      <Header as="h3" style={{ marginTop: "2em" }}>
        Expense Tips
      </Header>
      <p>
        Recording your expenses helps you understand where your money is going
        and identify opportunities to save.
      </p>

      <Header as="h4">Why track expenses?</Header>
      <p>
        Tracking expenses allows you to create better budgets, identify spending
        patterns, and make informed financial decisions.
      </p>

      <style>{`
        .date-picker-popper {
          z-index: 1001;
        }
        .react-datepicker-wrapper {
          width: 100%;
        }
      `}</style>
    </Container>
  );
};

export default AddExpenseTransaction;
