import { useState, useEffect } from "react";
import {
  Container,
  Divider,
  Grid,
  Header,
  Message,
  Button,
} from "semantic-ui-react";
import Navbar from "../../../components/Navbar";
import type { Transaction } from "../../../types";
import DateRangePicker from "./transactionsComponents/dateRangePicker";
import TransactionTable from "./transactionsComponents/transactionsTable";
import FilterMenu from "./transactionsComponents/filterMenu";
import DeleteModal from "./transactionsComponents/deleteModal";
import { useConnection, useActiveAddress } from "@arweave-wallet-kit/react";
import { useNavigation } from "../../../hooks/useNavigation";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";

const Transactions: React.FC = () => {
  const { connected } = useConnection();
  const address = useActiveAddress();
  const handleClick = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackerProcess = "Ejr_9-PPwg9RV7FFilWIeap6Zm0CdmUEbevGzPwAOd0";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );

  // Fetch transactions from AO process
  const fetchTransactions = async () => {
    if (!connected) return;

    setIsLoading(true);
    setError(null);

    try {
      const messageResponse = await message({
        process: trackerProcess,
        tags: [{ name: "Action", value: "FetchUserTransactions" }],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const resultResponse = await result({
        message: messageResponse,
        process: trackerProcess,
      });

      const { Messages, Error } = resultResponse;

      if (Error) {
        setError("Error fetching transactions: " + Error);
        return;
      }

      if (!Messages || Messages.length === 0) {
        setError("No transactions found");
        return;
      }

      const lastMessage = Messages[Messages.length - 1];
      const messageData = JSON.parse(lastMessage.Data);

      if (messageData && messageData.code === 200) {
        setTransactions(messageData.data);
      } else {
        setError(messageData.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset transactions when connection status changes
  useEffect(() => {
    if (connected) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setFilteredTransactions([]);
    }
  }, [connected]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [categoryFilter, typeFilter, dateRange, transactions]);

  const applyFilters = () => {
    let result = [...transactions];

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        (transaction) => transaction.category === categoryFilter
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      result = result.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    setFilteredTransactions(result);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
  };

  const handleDateRangeSelect = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!connected || filteredTransactions.length === 0) return;

    const headers = "ID,Category,Description,Date,Type,Amount\n";
    const csvContent = filteredTransactions
      .map(
        (transaction) =>
          `${transaction.id},${transaction.category},${transaction.description},${transaction.date},${transaction.type},${transaction.amount}`
      )
      .join("\n");

    const blob = new Blob([headers + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete transaction
  const confirmDelete = (id: string) => {
    if (!connected) return;

    setTransactionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (transactionToDelete && connected) {
      const updatedTransactions = transactions.filter(
        (t) => t.id !== transactionToDelete
      );
      setTransactions(updatedTransactions);
      setDeleteModalOpen(false);
      setTransactionToDelete(null);
    }
  };

  // Generate date range text for display
  const dateRangeText =
    dateRange.start && dateRange.end
      ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(
          dateRange.end
        ).toLocaleDateString()}`
      : "All Dates";

  // Check if export should be disabled
  const isExportDisabled = !connected || filteredTransactions.length === 0;

  return (
    <Container style={{ marginTop: "2em" }}>
      <Navbar />
      <Divider />

      {/* Wallet Connection Warning */}
      {!connected && (
        <Message warning>
          <Message.Header>Wallet Not Connected</Message.Header>
          <p>Please connect your wallet to view your transactions.</p>
          <Button primary onClick={handleClick("/")}>
            Connect Wallet
          </Button>
        </Message>
      )}

      {/* Loading State */}
      {isLoading && (
        <Message info>
          <Message.Header>Loading Transactions</Message.Header>
          <p>Please wait while we fetch your transactions...</p>
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

      {connected ? (
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as="h2">Transaction History</Header>
              {!isLoading && filteredTransactions.length === 0 && (
                <Message info>
                  <p>
                    No transactions found. Add some transactions to get started.
                  </p>
                </Message>
              )}
            </Grid.Column>
            <Grid.Column width={8} textAlign="right">
              <DateRangePicker onDateRangeSelect={handleDateRangeSelect} />
              <Button
                icon="refresh"
                onClick={fetchTransactions}
                disabled={!connected || isLoading}
                loading={isLoading}
                style={{ marginLeft: "10px" }}
              />
            </Grid.Column>
          </Grid.Row>

          <Divider />

          <Grid.Row>
            <FilterMenu
              categoryFilter={categoryFilter}
              typeFilter={typeFilter}
              onCategoryFilterChange={handleCategoryFilterChange}
              onTypeFilterChange={handleTypeFilterChange}
              onExportCSV={exportToCSV}
              dateRangeText={dateRangeText}
              disabled={!connected}
              exportDisabled={isExportDisabled}
            />
          </Grid.Row>

          <Divider />

          <Grid.Row>
            <TransactionTable
              transactions={filteredTransactions}
              onDeleteTransaction={confirmDelete}
              disabled={!connected}
            />
          </Grid.Row>
        </Grid>
      ) : (
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as="h2">Transaction History</Header>
              <p>Connect your wallet to view your transaction history.</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </Container>
  );
};

export default Transactions;
