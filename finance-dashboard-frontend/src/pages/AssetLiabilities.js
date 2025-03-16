import React, { useState, useEffect, useMemo } from "react";
 import { useTable, useSortBy } from "react-table";
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

 const AssetsAndLiabilitiesPage = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const authToken = sessionStorage.getItem("authToken");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchItems = async () => {
    try {
      const response = await fetch(`${config.API_URL}/assetsliabs`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      let itemsWithSrNo = [];
      if (Array.isArray(data)) {
        itemsWithSrNo = data.map((item, index) => ({
          ...item,
          srNo: index + 1,
        }));
      }

      setItems(itemsWithSrNo);
    } catch (error) {
      console.error("Error fetching assets and liabilities:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [authToken]);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const formatToIST = (dateString) => {
    if (!dateString) return "";
    const utcDate = new Date(dateString);
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
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

  const columns = useMemo(
    () => [
      { Header: "Sr. No", accessor: "srNo", disableSortBy: true },
      { Header: "Name", accessor: "name" },
      { Header: "Type", accessor: "type" },
      { Header: "Value", accessor: "value" },
      {
        Header: "Created Date",
        accessor: "created_at",
        Cell: ({ value }) => formatToIST(value),
      },
      {
        Header: "Updated Date",
        accessor: "updated_at",
        Cell: ({ value }) => formatToIST(value),
      },
      {
        Header: "Modify",
        accessor: "modify",
        Cell: ({ row }) => (
          <IconButton onClick={() => handleEdit(row.original)} aria-label="edit">
            <EditIcon />
          </IconButton>
        ),
        disableSortBy: true,
      },
      {
        Header: "Delete",
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

  const tableInstance = useTable({ columns, data: items }, useSortBy);
  console.log("tableInstance in AssetsAndLiabilitiesPage:", tableInstance); // Please provide this log if the error persists
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const handleSubmit = async (formData) => {

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

      fetchItems();

      alert("Asset/Liability added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("An error occurred while adding the asset/liability.");
    }
  };

    const confirmDelete = async () => {

      try {
        const response = await fetch(`${config.API_URL}/assetsliabs/remove/${selectedItem.assetliab_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete asset/liability");
        }
        setSelectedItem(null);

        fetchItems();
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting asset/liability:", error);
        alert("An error occurred while deleting the asset/liability.");
      }
    };

    const confirmModify = async (formData) => {
      const requestData = {
        name: formData.name,
        type: formData.type,
        value: parseFloat(formData.value)
      };

      try {
        const response = await fetch(`${config.API_URL}/assetsliabs/update/${selectedItem.assetliab_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error("Failed to update asset/liability");
        }
        setSelectedItem(null);
        fetchItems();
        setIsModalOpen(false);
        alert("Asset/Liability updated successfully!");
      } catch (error) {
        console.error("Error Updating asset/liability:", error);
        alert("An error occurred while updating the asset/liability.");
      }
    };


  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f9" }}>
      <LeftNav />
      <Box sx={{ flexGrow: 1, p: 3, ml: { sm: "240px" } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 2 : 0 }}>
          <Typography variant="h4" component="h2" sx={{ mb: isMobile ? 2 : 0 }}>
            Assets & Liabilities
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Item
          </Button>
        </Box>

        <Paper sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer>
            <Table {...getTableProps()} aria-label="assets and liabilities table">
              <TableHead>
                {headerGroups && headerGroups.map((headerGroup) => (
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
          title={selectedItem ? "Edit Item" : "Add Item"}
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
          initialValues={selectedItem || { type: "Asset" }}
          onSubmit={selectedItem ? confirmModify : handleSubmit}
          onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          title="Delete Item"
          message="Are you sure you want to delete this item?"
          details={[
            { label: "Name", value: selectedItem?.name },
            { label: "Type", value: selectedItem?.type },
            { label: "Value", value: selectedItem?.value },
          ]}
          onConfirm={confirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </Box>
  );
 };

 export default AssetsAndLiabilitiesPage;