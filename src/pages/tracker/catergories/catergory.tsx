import { useState, useEffect } from "react";
import {
  Card,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Button,
  Popup,
  Segment,
  Message,
  Menu,
  MenuMenu,
} from "semantic-ui-react";
import DeleteModal from "./deleteModal";
import Navbar from "../../../components/Navbar";
import { useConnection } from "@arweave-wallet-kit/react";
import { useNavigation } from "../../../hooks/useNavigation";

// Define the Category interface
interface Category {
  id: string;
  name: string;
  description: string;
  type: "income" | "expense";
  icon: string;
}

// Sample category data
const sampleIncomeCategories: Category[] = [
  {
    id: "1",
    name: "Salary",
    description: "Monthly salary income",
    type: "income",
    icon: "money",
  },
  {
    id: "2",
    name: "Investments",
    description: "Investment returns",
    type: "income",
    icon: "line chart",
  },
  {
    id: "3",
    name: "Dividends",
    description: "Stock dividends",
    type: "income",
    icon: "dollar",
  },
  {
    id: "4",
    name: "Freelance",
    description: "Freelance work income",
    type: "income",
    icon: "laptop",
  },
];

const sampleExpenseCategories: Category[] = [
  {
    id: "5",
    name: "Rent",
    description: "Monthly rent payment",
    type: "expense",
    icon: "home",
  },
  {
    id: "6",
    name: "Utilities",
    description: "Electricity, water, etc.",
    type: "expense",
    icon: "lightbulb",
  },
  {
    id: "7",
    name: "Internet",
    description: "WiFi and internet services",
    type: "expense",
    icon: "wifi",
  },
  {
    id: "8",
    name: "Groceries",
    description: "Food and household items",
    type: "expense",
    icon: "shopping basket",
  },
  {
    id: "9",
    name: "Transportation",
    description: "Fuel and transport costs",
    type: "expense",
    icon: "car",
  },
  {
    id: "10",
    name: "Entertainment",
    description: "Movies, games, etc.",
    type: "expense",
    icon: "gamepad",
  },
];

const RemoveCategory = () => {
  const { connected } = useConnection();
  const handleClick = useNavigation();

  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  // Update categories when connection status changes
  useEffect(() => {
    if (connected) {
      setIncomeCategories(sampleIncomeCategories);
      setExpenseCategories(sampleExpenseCategories);
    } else {
      setIncomeCategories([]);
      setExpenseCategories([]);
    }
  }, [connected]);

  const handleDeleteClick = (category: Category) => {
    if (!connected) return;
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete && connected) {
      if (categoryToDelete.type === "income") {
        setIncomeCategories(
          incomeCategories.filter((cat) => cat.id !== categoryToDelete.id)
        );
      } else {
        setExpenseCategories(
          expenseCategories.filter((cat) => cat.id !== categoryToDelete.id)
        );
      }
    }
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <Container style={{ padding: "2em" }}>
      <Navbar />
      <Header as="h1" textAlign="center" color="blue">
        <Icon name="folder open" />
        Categories
      </Header>

      {/* Wallet Connection Warning */}
      {!connected && (
        <Message warning>
          <Message.Header>Wallet Not Connected</Message.Header>
          <p>Please connect your wallet to manage your categories.</p>
        </Message>
      )}

      <Message info>
        <Message.Header>Managing Categories</Message.Header>
        <p>
          Categories help you organize your transactions. You can add new
          categories from the "Add Category" page and delete them here. Be
          careful when deleting categories as this action cannot be undone.
        </p>
      </Message>

      <Divider />

      <Menu pointing secondary>
        <MenuMenu position="right">
          <Button
            primary
            size="large"
            content="Add Category"
            icon="plus"
            labelPosition="left"
            onClick={handleClick("/addCatergory")}
            disabled={!connected}
          />
        </MenuMenu>
      </Menu>

      <Divider />

      {connected ? (
        <>
          <Header as="h2" color="green">
            <Icon name="money" />
            Income Categories
          </Header>

          {incomeCategories.length === 0 ? (
            <Segment placeholder>
              <Header icon>
                <Icon name="dollar" />
                No income categories yet
              </Header>
              <p>Add some income categories to get started</p>
            </Segment>
          ) : (
            <Grid columns={4} stackable>
              {incomeCategories.map((category) => (
                <Grid.Column key={category.id}>
                  <Card color="green" fluid>
                    <Card.Content>
                      <Icon
                        name={category.icon as any}
                        size="big"
                        color="green"
                        style={{ float: "left", marginRight: "10px" }}
                      />
                      <Card.Header>{category.name}</Card.Header>
                      <Card.Description>
                        {category.description}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className="ui two buttons">
                        <Popup
                          content="Delete this category"
                          trigger={
                            <Button
                              basic
                              color="red"
                              onClick={() => handleDeleteClick(category)}
                              disabled={!connected}
                            >
                              <Icon name="trash" /> Delete
                            </Button>
                          }
                        />
                      </div>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))}
            </Grid>
          )}

          <Divider />

          <Header as="h2" color="red">
            <Icon name="credit card" />
            Expense Categories
          </Header>

          {expenseCategories.length === 0 ? (
            <Segment placeholder>
              <Header icon>
                <Icon name="shopping cart" />
                No expense categories yet
              </Header>
              <p>Add some expense categories to get started</p>
            </Segment>
          ) : (
            <Grid columns={4} stackable>
              {expenseCategories.map((category) => (
                <Grid.Column key={category.id}>
                  <Card color="red" fluid>
                    <Card.Content>
                      <Icon
                        name={category.icon as any}
                        size="big"
                        color="red"
                        style={{ float: "left", marginRight: "10px" }}
                      />
                      <Card.Header>{category.name}</Card.Header>
                      <Card.Description>
                        {category.description}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className="ui two buttons">
                        <Popup
                          content="Delete this category"
                          trigger={
                            <Button
                              basic
                              color="red"
                              onClick={() => handleDeleteClick(category)}
                              disabled={!connected}
                            >
                              <Icon name="trash" /> Delete
                            </Button>
                          }
                        />
                      </div>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <Segment placeholder>
          <Header icon>
            <Icon name="lock" />
            Wallet Not Connected
          </Header>
          <p>Please connect your wallet to view and manage categories</p>
        </Segment>
      )}

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        categoryName={categoryToDelete?.name || ""}
        disabled={!connected}
      />
    </Container>
  );
};

export default RemoveCategory;
