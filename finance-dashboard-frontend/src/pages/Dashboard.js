import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import "../styles/css/Dashboard.css";
import LeftNav from "../components/LeftNav";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";


const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAssetLiabModalOpen, setIsAssetLiabModalOpen] = useState(false);
  const authToken = sessionStorage.getItem("authToken");

  const apiUrl = "http://localhost:4000/proxy";

  const fetchReports = async () => {
    try {
      const response = await fetch(`${apiUrl}/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Adjust based on your auth setup
        }
      });

      const data = await response.json();


      // Extract and set values from the API response
      if (data.TOTAL_INCOME_EXPENSE_NETWORTH_REPORT) {
        setIncome(data.TOTAL_INCOME_EXPENSE_NETWORTH_REPORT[0].total_income || 0);
        setExpenses(data.TOTAL_INCOME_EXPENSE_NETWORTH_REPORT[0].total_expenses || 0);
        setNetWorth(data.TOTAL_INCOME_EXPENSE_NETWORTH_REPORT[0].net_worth || 0);
      }

      if (data.EXPENSES_BREAKDOWN_BY_CATEGORY_REPORT) {
        setExpenseBreakdown(data.EXPENSES_BREAKDOWN_BY_CATEGORY_REPORT);
      }

      if (data.INCOME_VS_EXPENSES_REPORT) {
        setFinancialData([
          { month: "Jan", income: data.INCOME_VS_EXPENSES_REPORT[0].income, expenses: data.INCOME_VS_EXPENSES_REPORT[0].expenses },
          { month: "Feb", income: data.INCOME_VS_EXPENSES_REPORT[0].income * 0.95, expenses: data.INCOME_VS_EXPENSES_REPORT[0].expenses * 1.1 },
          { month: "Mar", income: data.INCOME_VS_EXPENSES_REPORT[0].income * 1.05, expenses: data.INCOME_VS_EXPENSES_REPORT[0].expenses * 0.9 },
        ]);
      }

    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {

    fetchReports();
  }, []);

  const handleTransactionSubmit = async (formData) => {
    const requestData = {
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
    };
    

    try {
      const response = await fetch(`${apiUrl}/transactions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      fetchReports();

      alert("Transaction added successfully!");
      setIsTransactionModalOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("An error occurred while adding the transaction.");
    }
  };

  const handleAssetLiabSumit = async (formData) => {
    
    const requestData = {
      name: formData.name,
      type: formData.type,
      value: parseFloat(formData.value),
    };

    try {
      const response = await fetch(`${apiUrl}/assetsliabs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to add asset/liability");
      }

      fetchReports();

      alert("Asset/Liability added successfully!");
      setIsAssetLiabModalOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("An error occurred while adding the asset/liability.");
    }
  };

  // Expense Pie Chart Colors
  const COLORS = ["#ff6b6b", "#ffa502", "#1e90ff", "#2ed573", "#ff4757"];

  return (
    <div className="dashboard-container">
      <LeftNav />

      <div className="dashboard-content">
        {/* Header with Buttons */}
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="header-buttons">
            <button className="btn add-transaction" onClick={() => setIsTransactionModalOpen(true)}>+ Add Transaction</button>
            <button className="btn add-asset-liability" onClick={() => setIsAssetLiabModalOpen(true)}>+ Add Asset/Liability</button>
          </div>
        </div>

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
            <h3>Income vs Expenses (Last 3 Months)</h3>
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
        {/* <div className="transactions-container">
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
        </div> */}
      </div>
      {isTransactionModalOpen && (
              <Modal
                title={"Add Transaction"}
                fields={[
                  // { label: "Transaction Type", name: "type", type: "text", required: true },
                  {
                    label: "Transaction Type",
                    name: "type",
                    type: "select",
                    options: [
                      { label: "Income", value: "Income" },
                      { label: "Expenses", value: "Expenses" }
                    ],
                    required: true
                  },
                  { label: "Category", name: "category", type: "text", required: true },
                  { label: "Amount", name: "amount", type: "number", required: true },
                ]}
                initialValues={{ type: "Income" }}
                onSubmit={handleTransactionSubmit}
                onClose={() => setIsTransactionModalOpen(false)}
              />
          )}
        {isAssetLiabModalOpen && (
        <Modal
          title={ "Add Asset/Liability"}
          fields={[
            { label: "Name", name: "name", type: "text", required: true },
            {
              label: "Type",
              name: "type",
              type: "select",
              options: [
                { label: "Asset", value: "Asset" },
                { label: "Liability", value: "Liability" }
              ],
              required: true
            },
            { label: "Value", name: "value", type: "number", required: true },
          ]}
          initialValues={{ type: "Asset" }}
          onSubmit={handleAssetLiabSumit}
          onClose={() => setIsAssetLiabModalOpen(false)}
        />
      )}
    </div>

  );
};

export default Dashboard;
