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
  Modal,
} from "semantic-ui-react";
import DeleteModal from "./deleteModal";
import Navbar from "../../../components/Navbar";
import { useConnection } from "@arweave-wallet-kit/react";
import { useNavigation } from "../../../hooks/useNavigation";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import type { CategoryTransactions } from "../../../types";

const RemoveCategory = () => {
  const { connected } = useConnection();

  const handleClick = useNavigation();

  const [incomeCategories, setIncomeCategories] = useState<
    CategoryTransactions[]
  >([]);
  const [expenseCategories, setExpenseCategories] = useState<
    CategoryTransactions[]
  >([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryTransactions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMockModal, setShowMockModal] = useState(false);
  const [isAddingMock, setIsAddingMock] = useState(false);

  const trackerProcess = "Ejr_9-PPwg9RV7FFilWIeap6Zm0CdmUEbevGzPwAOd0";

  // Fetch categories from AO process
  const fetchCategories = async () => {
    if (!connected) return;

    setIsLoading(true);
    setError(null);

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

      const { Messages, Error } = resultResponse;

      if (Error) {
        setError("Error fetching categories: " + Error);
        return;
      }

      if (!Messages || Messages.length === 0) {
        setError("No categories found");
        return;
      }

      const lastMessage = Messages[Messages.length - 1];
      const messageData = JSON.parse(lastMessage.Data);

      if (messageData && messageData.code === 200) {
        // The data should be an array of CategoryTransactions objects
        const categories: CategoryTransactions[] = messageData.data;

        // Separate income and expense categories
        setIncomeCategories(categories.filter((cat) => cat.type === "Income"));
        setExpenseCategories(
          categories.filter((cat) => cat.type === "Expense")
        );
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

  // Add mock categories to AO process
  const addMockCategories = async () => {
    setIsAddingMock(true);
    setShowMockModal(false);

    try {
      const messageResponse = await message({
        process: trackerProcess,
        tags: [{ name: "Action", value: "AddMockCategories" }],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const resultResponse = await result({
        message: messageResponse,
        process: trackerProcess,
      });

      const { Messages, Error } = resultResponse;

      if (Error) {
        setError("Error adding mock categories: " + Error);
        return;
      }

      if (!Messages || Messages.length === 0) {
        throw new Error("No messages were returned from ao. Please try later.");
      }

      const lastMessage = Messages[Messages.length - 1];
      const messageData = JSON.parse(lastMessage.Data);

      if (messageData && messageData.code === 200) {
        // Refresh categories after adding mock data
        await fetchCategories();
      } else {
        setError(messageData.message || "Failed to add mock categories");
      }
    } catch (error) {
      console.error("Error adding mock categories:", error);
      setError("Failed to add mock categories. Please try again.");
    } finally {
      setIsAddingMock(false);
    }
  };

  // Update categories when connection status changes
  useEffect(() => {
    if (connected) {
      fetchCategories();
    } else {
      setIncomeCategories([]);
      setExpenseCategories([]);
    }
  }, [connected]);

  const handleDeleteClick = (category: CategoryTransactions) => {
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

      {/* Mock Categories Modal */}
      <Modal
        open={showMockModal}
        onClose={() => setShowMockModal(false)}
        size="small"
      >
        <Modal.Header>Create Mock Categories</Modal.Header>
        <Modal.Content>
          <p>
            Would you like to add sample categories to test the application?
            This will create:
          </p>
          <ul>
            <li>5 income categories (Salary, Investments, Freelance)</li>
            <li>5 expense categories (Rent, Utilities, Groceries)</li>
          </ul>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowMockModal(false)}>Cancel</Button>
          <Button primary loading={isAddingMock} onClick={addMockCategories}>
            Create Mock Categories
          </Button>
        </Modal.Actions>
      </Modal>

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

      {/* Loading State */}
      {isLoading && (
        <Message info>
          <Message.Header>Loading Categories</Message.Header>
          <p>Please wait while we fetch your categories...</p>
        </Message>
      )}

      {/* Error State */}
      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
          <Button onClick={() => setError(null)}>Dismiss</Button>
        </Message>
      )}

      {/* No Categories State */}
      {connected &&
        !isLoading &&
        incomeCategories.length === 0 &&
        expenseCategories.length === 0 && (
          <Message info>
            <Message.Header>No Categories Found</Message.Header>
            <p>
              You don't have any categories yet. Would you like to create some
              mock data to test the app?
            </p>
            <Button
              primary
              loading={isAddingMock}
              onClick={() => setShowMockModal(true)}
            >
              Create Mock Categories
            </Button>
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
        <Menu.Menu position="right">
          <Button
            primary
            size="large"
            content="Add Category"
            icon="plus"
            labelPosition="left"
            onClick={handleClick("/addCatergory")}
            disabled={!connected}
          />
          {connected &&
            incomeCategories.length === 0 &&
            expenseCategories.length === 0 && (
              <Button
                color="teal"
                loading={isAddingMock}
                onClick={() => setShowMockModal(true)}
                disabled={isAddingMock}
              >
                <Icon name="magic" />
                Mock Data
              </Button>
            )}
          <Button
            icon="refresh"
            onClick={fetchCategories}
            disabled={!connected || isLoading}
            loading={isLoading}
          />
        </Menu.Menu>
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
      />
    </Container>
  );
};

export default RemoveCategory;
