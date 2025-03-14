import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import "../styles/css/Dashboard.css";
import LeftNav from "../components/LeftNav";

const Dashboard = ({ 
  income = 0, 
  expenses = 0, 
  assets = 0, 
  liabilities = 0, 
  transactionData = [],  // Default to empty array
  expenseBreakdown = []  // Default to empty array
}) => {
  const netWorth = assets - liabilities;

  // Sample Income vs Expenses Data (Last 6 Months)
  const financialData = [
    { month: "Jan", income: 5000, expenses: 3000 },
    { month: "Feb", income: 5200, expenses: 3200 },
    { month: "Mar", income: 4800, expenses: 3100 },
    { month: "Apr", income: 5300, expenses: 3300 },
    { month: "May", income: 5500, expenses: 3400 },
    { month: "Jun", income: 5700, expenses: 3600 },
  ];

  // Expense Pie Chart Colors
  const COLORS = ["#ff6b6b", "#ffa502", "#1e90ff", "#2ed573", "#ff4757"];

  return (
    <div className="dashboard-container">
      <LeftNav />
      
      <div className="dashboard-content">
      <h2>Dashboard</h2>
        {/* Summary Cards */}
        <div className="summary-container">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <p>${income.toLocaleString()}</p>
          </div>
          <div className="summary-card expenses">
            <h3>Total Expenses</h3>
            <p>${expenses.toLocaleString()}</p>
          </div>
          <div className="summary-card net-worth">
            <h3>Net Worth</h3>
            <p>${netWorth.toLocaleString()}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-container">
          <div className="chart">
            <h3>Income vs Expenses (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financialData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="income" stroke="#28a745" strokeWidth={3} />
                <Line type="monotone" dataKey="expenses" stroke="#dc3545" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart">
            <h3>Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={expenseBreakdown.length > 0 ? expenseBreakdown : [{ category: "No Data", value: 1 }]} 
                  dataKey="value" 
                  nameKey="category" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#8884d8" 
                  label
                >
                  {expenseBreakdown.length > 0 ? (
                    expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  ) : (
                    <Cell fill="#ccc" />
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="transactions-container">
          <h3>Recent Transactions</h3>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.length > 0 ? (
                transactionData.map((txn, index) => (
                  <tr key={index} className={txn.type === "Income" ? "income-row" : "expense-row"}>
                    <td>{txn.date}</td>
                    <td>{txn.category}</td>
                    <td>{txn.type}</td>
                    <td>${txn.amount ? txn.amount.toLocaleString() : "0"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No transactions available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Buttons Section */}
        <div className="buttons-container">
          <button className="btn add-transaction">+ Add Transaction</button>
          <button className="btn add-asset-liability">+ Add Asset/Liability</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
