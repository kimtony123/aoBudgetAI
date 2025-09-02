import React from "react";
import { Table, Label, Button, Popup } from "semantic-ui-react";
import type { Transaction } from "../../../../types";

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDeleteTransaction,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  return (
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Category</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {transactions.map((transaction) => (
          <Table.Row key={transaction.id}>
            <Table.Cell>{transaction.id}</Table.Cell>
            <Table.Cell>{transaction.category}</Table.Cell>
            <Table.Cell>{transaction.description}</Table.Cell>
            <Table.Cell>{transaction.date}</Table.Cell>
            <Table.Cell>
              <Label color={transaction.type === "income" ? "green" : "red"}>
                {transaction.type}
              </Label>
            </Table.Cell>
            <Table.Cell>
              <span
                style={{
                  color: transaction.amount >= 0 ? "green" : "red",
                }}
              >
                {transaction.amount >= 0 ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </Table.Cell>
            <Table.Cell>
              <Popup
                content="Delete transaction"
                trigger={
                  <Button
                    icon="trash"
                    color="red"
                    size="small"
                    onClick={() => onDeleteTransaction(transaction.id)}
                  />
                }
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TransactionTable;
