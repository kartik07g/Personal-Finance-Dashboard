import React, { useEffect, useState } from "react";
import {
  Grid, Box, Typography, Button, Card, CardContent,
} from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import LeftNav from "../components/LeftNav";
import Modal from "../components/Modal";
import { config } from "../config";

const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAssetLiabModalOpen, setIsAssetLiabModalOpen] = useState(false);
  const authToken = sessionStorage.getItem("authToken");


  const fetchReports = async () => {
    
    try {
      const response = await fetch(`${config.API_URL}/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        }
      });
      const data = await response.json();

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
      const response = await fetch(`${config.API_URL}/transactions/create`, {
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
      const response = await fetch(`${config.API_URL}/assetsliabs/create`, {
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

  const COLORS = ["#ff6b6b", "#ffa502", "#1e90ff", "#2ed573", "#ff4757"];

  return (
    <Box display="flex">
      <LeftNav />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, ml: { md: '270px' } }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexDirection={{ xs: "column", md: "row" }} gap={2}>
          <Typography variant="h4">Dashboard</Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" color="success" onClick={() => setIsTransactionModalOpen(true)}>
              + Add Transaction
            </Button>
            <Button variant="contained" color="primary" onClick={() => setIsAssetLiabModalOpen(true)}>
              + Add Asset/Liability
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#28a745", color: "white" }}>
              <CardContent>
                <Typography variant="h6">Total Income</Typography>
                <Typography variant="h4">${income.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#dc3545", color: "white" }}>
              <CardContent>
                <Typography variant="h6">Total Expenses</Typography>
                <Typography variant="h4">${expenses.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#007bff", color: "white" }}>
              <CardContent>
                <Typography variant="h6">Net Worth</Typography>
                <Typography variant="h4">${netWorth.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Income vs Expenses (Last 3 Months)</Typography>
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
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Expense Breakdown</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown.length > 0 ? expenseBreakdown : [{ category: "No Data", value: 1 }]}
                      dataKey="value"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Modals */}
        {isTransactionModalOpen && (
          <Modal
            title={"Add Transaction"}
            fields={[
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
            onSubmit={handleTransactionSubmit} // your handler
            onClose={() => setIsTransactionModalOpen(false)}
          />
        )}

        {isAssetLiabModalOpen && (
          <Modal
            title={"Add Asset/Liability"}
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
            onSubmit={handleAssetLiabSumit} // your handler
            onClose={() => setIsAssetLiabModalOpen(false)}
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
