import React, { useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import Modal from "../components/Modal";
import LeftNav from "../components/LeftNav";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import "../styles/css/Transactions.css";
import { useSelector } from "react-redux";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const authToken = useSelector((state) => state.auth.token);

  const apiUrl = "http://localhost:4000/proxy/transactions"; // Base API URL

  // 🔹 Fetch Transactions on Component Load
  const fetchTransactions = async () => {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
  
      const data = await response.json();
      console.log("*****data", data);
  
      // 🔹 Assign Sr. No based on original order (to prevent changes on sorting)
      const transactionsWithSrNo = data.map((transaction, index) => ({
        ...transaction,
        srNo: index + 1, // Fixed Sr. No
      }));
  
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
        Header: "Sr. No",
        accessor: "srNo",
        disableSortBy: true, 
      },
      { Header: "Transaction Type", accessor: "type" },
      { Header: "Category", accessor: "category" },
      { Header: "Amount", accessor: "amount" },
      { 
        Header: "Created Date", 
        accessor: "created_at",
        Cell: ({ value }) => formatToIST(value), // ✅ Corrected IST conversion
      },
      { 
        Header: "Updated Date", 
        accessor: "updated_at",
        Cell: ({ value }) => formatToIST(value), // ✅ Corrected IST conversion
      },
      {
        Header: "Modify",
        accessor: "modify",
        Cell: ({ row }) => (
          <button className="edit-btn" onClick={() => handleEdit(row.original)}>
            <FiEdit />
          </button>
        ),
        disableSortBy: true,
      },
      {
        Header: "Delete",
        accessor: "delete",
        Cell: ({ row }) => (
          <button className="delete-btn" onClick={() => handleDelete(row.original)}>
            <FiTrash />
          </button>
        ),
        disableSortBy: true,
      },
    ],
    []
  );
  
 
  
  
  const tableInstance = useTable({ columns, data: transactions }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  // 🔹 Handle Adding Transaction
  const handleSubmit = async (formData) => {
    const requestData = {
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
    };
    console.log("********authToken",authToken);
    

    try {
      const response = await fetch(`${apiUrl}/create`, {
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
    console.log("********selectedTransaction",selectedTransaction);
    
    try {
      const response = await fetch(`${apiUrl}/remove/${selectedTransaction.transaction_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.transaction_id));
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
    console.log("******requestData",requestData);
    
    try {
      const response = await fetch(`${apiUrl}/update/${selectedTransaction.transaction_id}`, {
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

      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.transaction_id));
      setSelectedTransaction(null);
      fetchTransactions();
      setIsModalOpen(false);
      alert("Transaction updated successfully!");
    } catch (error) {
      console.error("Error Updating transaction:", error);
      alert("An error occurred while updating the transaction.");
    }
  };

  return (
    <div className="transactions-container">
      <LeftNav />
      <div className="main-content">
        <div className="transactions-header">
          <h2>Transactions</h2>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            <FiPlus /> Add Transaction
          </button>
        </div>
        <table {...getTableProps()} className="transactions-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")} {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal
          title={selectedTransaction ? "Edit Transaction" : "Add Transaction"}
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
          initialValues={selectedTransaction || { type: "Income" }}
          onSubmit={selectedTransaction ? confirmModify : handleSubmit}
          onClose={() => {setIsModalOpen(false); setSelectedTransaction(null);}}
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
    </div>
  );
};

export default TransactionsPage;
