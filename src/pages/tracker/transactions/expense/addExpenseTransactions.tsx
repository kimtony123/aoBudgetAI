import React, { useState } from "react";
import {
  Container,
  Form,
  Header,
  Message,
  Button,
  Icon,
  Grid,
  Popup,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { AddTransaction } from "../../../../types";

// Sample expense category data
const expenseCategories = [
  { id: "5", name: "Rent", type: "expense", icon: "home" },
  { id: "6", name: "Utilities", type: "expense", icon: "lightbulb" },
  { id: "7", name: "Internet", type: "expense", icon: "wifi" },
  { id: "8", name: "Groceries", type: "expense", icon: "shopping basket" },
  { id: "9", name: "Transportation", type: "expense", icon: "car" },
  { id: "10", name: "Entertainment", type: "expense", icon: "gamepad" },
];

const AddExpenseTransaction = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<Omit<AddTransaction, "type">>({
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
  });

  // Convert date string to Date object for the date picker
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Navigation handler
  const handleClick = (path: string) => () => {
    navigate(path);
  };

  // Handle form field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle dropdown changes
  const handleDropdownChange = (_e: React.SyntheticEvent, data: any) => {
    const { name, value } = data;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date selection
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: date.toISOString().split("T")[0],
      }));
    }
    setShowDatePicker(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.category ||
      !formData.description ||
      !formData.date ||
      formData.amount <= 0
    ) {
      setError("Please fill in all fields with valid values");
      return;
    }

    // Create the complete transaction data with type set to "expense"
    const expenseTransaction: AddTransaction = {
      ...formData,
      type: "expense",
    };

    // Here you would typically send the data to your backend
    console.log("Expense transaction data:", expenseTransaction);

    // Show success message
    setSuccess(true);
    setError("");

    // Reset form
    setFormData({
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
    });
    setSelectedDate(new Date());

    // Hide success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  // Get category options for expenses
  const getCategoryOptions = () => {
    return expenseCategories.map((category) => ({
      key: category.id,
      text: category.name,
      value: category.id,
      icon: category.icon,
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

      <Form onSubmit={handleSubmit}>
        <Form.Select
          label="Category"
          name="category"
          placeholder="Select a category"
          fluid
          selection
          options={getCategoryOptions()}
          value={formData.category}
          onChange={handleDropdownChange}
        />

        <Form.Input
          label="Description"
          name="description"
          placeholder="Enter a description for this expense"
          value={formData.description}
          onChange={handleInputChange}
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
          value={formData.amount || ""}
          onChange={handleInputChange}
        />

        <Grid>
          <Grid.Column width={8}>
            <Button type="submit" primary fluid>
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
