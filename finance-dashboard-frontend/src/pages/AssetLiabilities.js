import React, { useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import Modal from "../components/Modal";
import LeftNav from "../components/LeftNav";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import "../styles/css/AssetsAndLiabilities.css";
import { useSelector } from "react-redux";

const AssetsAndLiabilitiesPage = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const authToken = useSelector((state) => state.auth.token);

  const apiUrl = "http://localhost:4000/proxy/assetsliabs";

  const fetchItems = async () => {
    
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("*****data", data);

      const itemsWithSrNo = data.map((item, index) => ({
        ...item,
        srNo: index + 1,
      }));

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

  const columns = React.useMemo(
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

  const tableInstance = useTable({ columns, data: items }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const handleSubmit = async (formData) => {
    console.log("*********formData",formData);
    
    const requestData = {
      name: formData.name,
      type: formData.type,
      value: parseFloat(formData.value),
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
        const response = await fetch(`${apiUrl}/remove/${selectedItem.assetliab_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete asset/liability");
        }
  
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
        const response = await fetch(`${apiUrl}/update/${selectedItem.assetliab_id}`, {
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
    <div className="assets-liabilities-container">
      <LeftNav />
      <div className="main-content">
        <div className="asset-liability-header">
          <h2>Assets & Liabilities</h2>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            <FiPlus /> Add Item
          </button>
        </div>
        <table {...getTableProps()} className="asset-liability-table">
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
          onSubmit={selectedItem ? confirmModify :handleSubmit}
          onClose={() => {setIsModalOpen(false); setSelectedItem(null);}}
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
    </div>
  );
};

export default AssetsAndLiabilitiesPage;
