import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TrackerDashboard from "./pages/tracker/dashboard/dashboard";
import Transactions from "./pages/tracker/transactions/transactions";
import Catergories from "./pages/tracker/catergories/catergory";
import Agents from "./pages/agent/myAgent/agents";
import AddIncomeTransaction from "./pages/tracker/transactions/income/addIncomeTransactions";
import AddExpenseTransaction from "./pages/tracker/transactions/expense/addExpenseTransactions";
import AiAnalysis from "./pages/agent/myAgent/aiAnalysis";
import CreateAgent from "./pages/agent/createAgents/createAgent";
import AddCategory from "./pages/tracker/catergories/addCatergory";

// Ensure this import path is correct

function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen">
        <div className="nav-content flex-grow">
          <Routes>
            {/* Set the Home component as the element for the root path */}
            <Route path="/" element={<Home />} />
            <Route path="trackerdashboard" element={<TrackerDashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="manage" element={<Catergories />} />
            <Route path="agents" element={<Agents />} />
            <Route
              path="addIncomeTransaction"
              element={<AddIncomeTransaction />}
            />
            <Route
              path="addExpenseTransaction"
              element={<AddExpenseTransaction />}
            />
            <Route path="getAIAnalysis" element={<AiAnalysis />} />
            <Route path="createAgent" element={<CreateAgent />} />
            <Route path="addCatergory" element={<AddCategory />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
