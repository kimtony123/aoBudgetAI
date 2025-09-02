import React from "react";
import { Menu, Dropdown, Button, Icon } from "semantic-ui-react";

interface FilterMenuProps {
  categoryFilter: string;
  typeFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onExportCSV: () => void;
  dateRangeText: string;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  categoryFilter,
  typeFilter,
  onCategoryFilterChange,
  onTypeFilterChange,
  onExportCSV,
  dateRangeText,
}) => {
  const categoryOptions = [
    { key: "all", text: "All Categories", value: "all" },
    { key: "food", text: "Food", value: "Food" },
    { key: "salary", text: "Salary", value: "Salary" },
    { key: "transportation", text: "Transportation", value: "Transportation" },
    { key: "entertainment", text: "Entertainment", value: "Entertainment" },
    { key: "freelance", text: "Freelance", value: "Freelance" },
    { key: "healthcare", text: "Healthcare", value: "Healthcare" },
  ];

  const typeOptions = [
    { key: "all", text: "All Types", value: "all" },
    { key: "income", text: "Income", value: "income" },
    { key: "expense", text: "Expense", value: "expense" },
  ];

  return (
    <Menu>
      <Menu.Item>
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>
          Date Range: {dateRangeText}
        </span>
      </Menu.Item>
      <Menu.Item>
        <Dropdown
          selection
          options={categoryOptions}
          value={categoryFilter}
          onChange={(_e, { value }) => onCategoryFilterChange(value as string)}
          placeholder="Filter by category"
        />
      </Menu.Item>

      <Menu.Item>
        <Dropdown
          selection
          options={typeOptions}
          value={typeFilter}
          onChange={(_e, { value }) => onTypeFilterChange(value as string)}
          placeholder="Filter by type"
        />
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item>
          <Button primary onClick={onExportCSV}>
            <Icon name="download" />
            Export CSV
          </Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default FilterMenu;
