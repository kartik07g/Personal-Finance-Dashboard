import React, { useState, useEffect } from "react";
 import { useTable, useSortBy } from "react-table";
 import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
 import Modal from "../components/Modal";
 import LeftNav from "../components/LeftNav";
 import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
 import { useSelector } from "react-redux";
 import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
  Stack,
 } from "@mui/material";
 import EditIcon from '@mui/icons-material/Edit';
 import DeleteIcon from '@mui/icons-material/Delete';
 import AddIcon from '@mui/icons-material/Add';
 import { config } from "../config";

 const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const authToken = sessionStorage.getItem("authToken");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 🔹 Fetch Transactions on Component Load
  const fetchTransactions = async () => {
   try {
    const response = await fetch(`${config.API_URL}/transactions`, {
     headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
     },
    });

    if (!response.ok) {
     throw new Error("Failed to fetch transactions");
    }

    const data = await response.json();

    let transactionsWithSrNo = [];
    if (Array.isArray(data)) {
     transactionsWithSrNo = data.map((transaction, index) => ({
      ...transaction,
      srNo: index + 1, // Fixed Sr. No
     }));
    }

    setTransactions(transactionsWithSrNo); // Update state
   } catch (error) {
    console.error("Error fetching transactions:", error);
   }
  };


  useEffect(() => {
    fetchTransactions();
  }, [authToken]); // Re-run when authToken changes

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  // 🔹 Table Columns
  const formatToIST = (dateString) => {
    if (!dateString) return ""; // Handle empty values

    const utcDate = new Date(dateString); // Convert string to Date object
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Convert UTC to IST

    return istDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: () => <span>Sr. No</span>,
        accessor: "srNo",
        disableSortBy: true,
      },
      { Header: () => <span>Transaction Type</span>, accessor: "type" },
      { Header: () => <span>Category</span>, accessor: "category" },
      { Header: () => <span>Amount</span>, accessor: "amount" },
      {
        Header: () => <span>Created Date</span>,
        accessor: "created_at",
        Cell: ({ value }) => formatToIST(value),
      },
      {
        Header: () => <span>Updated Date</span>,
        accessor: "updated_at",
        Cell: ({ value }) => formatToIST(value),
      },
      {
        Header: () => <span>Modify</span>,
        accessor: "modify",
        Cell: ({ row }) => (
          <IconButton onClick={() => handleEdit(row.original)} aria-label="edit">
            <EditIcon />
          </IconButton>
        ),
        disableSortBy: true,
      },
      {
        Header: () => <span>Delete</span>,
        accessor: "delete",
        Cell: ({ row }) => (
          <IconButton onClick={() => handleDelete(row.original)} aria-label="delete">
            <DeleteIcon color="error" />
          </IconButton>
        ),
        disableSortBy: true,
      },
    ],
    []
  );


  const tableInstance = useTable({ columns, data: transactions }, useSortBy);
  console.log("tableInstance:", tableInstance); // Please provide this log if the error persists
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  // 🔹 Handle Adding Transaction
  const handleSubmit = async (formData) => {
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

      fetchTransactions();

      alert("Transaction added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("An error occurred while adding the transaction.");
    }
  };

  // 🔹 Handle Delete Transaction
  const confirmDelete = async () => {

    try {
      const response = await fetch(`${config.API_URL}/transactions/remove/${selectedTransaction.transaction_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.transaction_id));
      setSelectedTransaction(null);
      fetchTransactions();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("An error occurred while deleting the transaction.");
    }
  };

  const confirmModify = async (formData) => {
    const requestData = {
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
    };

    try {
      const response = await fetch(`${config.API_URL}/transactions/update/${selectedTransaction.transaction_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      setSelectedTransaction(null);
      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.transaction_id));
      fetchTransactions();
      setIsModalOpen(false);
      alert("Transaction updated successfully!");
    } catch (error) {
      console.error("Error Updating transaction:", error);
      alert("An error occurred while updating the transaction.");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f9" }}>
      <LeftNav />
      <Box sx={{ flexGrow: 1, p: 3, ml: { sm: "220px" } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 2 : 0 }}>
          <Typography variant="h4" component="h2" sx={{ mb: isMobile ? 2 : 0 }}>
            Transactions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Transaction
          </Button>
        </Box>

        <Paper sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer>
            <Table {...getTableProps()} aria-label="transactions table">
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableCell
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {column.render("Header")}
                        {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {isModalOpen && (
        <Modal
          title={selectedTransaction ? "Edit Transaction" : "Add Transaction"}
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
          initialValues={selectedTransaction || { type: "Income" }}
          onSubmit={selectedTransaction ? confirmModify : handleSubmit}
          onClose={() => { setIsModalOpen(false); setSelectedTransaction(null); }}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction?"
          details={[
            { label: "Transaction Type", value: selectedTransaction?.type },
            { label: "Category", value: selectedTransaction?.category },
            { label: "Amount", value: selectedTransaction?.amount },
          ]}
          onConfirm={confirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </Box>
  );
 };

 export default TransactionsPage;