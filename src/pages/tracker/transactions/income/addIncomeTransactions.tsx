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

// Sample income category data
const incomeCategories = [
  { id: "1", name: "Salary", type: "income", icon: "money" },
  { id: "2", name: "Investments", type: "income", icon: "line chart" },
  { id: "3", name: "Dividends", type: "income", icon: "dollar" },
  { id: "4", name: "Freelance", type: "income", icon: "laptop" },
];

const AddIncomeTransaction = () => {
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

    // Create the complete transaction data with type set to "income"
    const incomeTransaction: AddTransaction = {
      ...formData,
      type: "income",
    };

    // Here you would typically send the data to your backend
    console.log("Income transaction data:", incomeTransaction);

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

  // Get category options for income
  const getCategoryOptions = () => {
    return incomeCategories.map((category) => ({
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
      <Header as="h1">Add Income</Header>

      {success && (
        <Message positive>
          <Message.Header>Success!</Message.Header>
          <p>Your income has been added successfully.</p>
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
          placeholder="Enter a description for this income"
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
              Add Income
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
        Income Tips
      </Header>
      <p>
        Recording your income helps you understand your earning patterns and
        plan your finances better.
      </p>

      <Header as="h4">Why track income?</Header>
      <p>
        Tracking income allows you to understand your cash flow, plan for taxes,
        and set realistic financial goals.
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

export default AddIncomeTransaction;
