// src/types/index.ts

// Financial data interfaces
export interface FinancialData {
  [key: string]: {
    income: number;
    expenses: number;
    balance: number;
  };
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
}

export interface CategoryTransactions {
  id: string;
  name: string;
  icon: string;
  type: string;
  description: string;
}

export interface HistoryData {
  month: string;
  year: number;
  income: number;
  expenses: number;
}

// Navigation props
export interface NavigationProps {
  path: string;
}

// Component props interfaces
export interface OverviewSectionProps {
  financialData: FinancialData;
  timeFilter: string;
  onFilterChange: (event: React.SyntheticEvent<HTMLElement>, data: any) => void;
}

export interface CategoryBreakdownProps {
  incomeData: CategoryData[];
  expenseData: CategoryData[];
  totalIncome: number;
  totalExpenses: number;
  financialData: FinancialData;
  timeFilter: string;
}

export interface HistorySectionProps {
  historyData: HistoryData[];
}

// You can add more types as your application grows
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  category: string;
  description: string;
  date: string;
  type: "income" | "expense";
  amount: number;
}

export interface AddTransaction {
  category: string;
  description: string;
  date: string;
  type: "income" | "expense";
  amount: number;
}
