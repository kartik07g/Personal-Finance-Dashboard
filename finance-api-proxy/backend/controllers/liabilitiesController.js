import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/config.js";

export const getLiabilities = async (req, res) => {
  try {
    console.log(`🔹 Forwarding GET request: ${req.originalUrl}`);
    const response = await axios.get(`${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in getLiabilities:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to fetch liabilities" });
  }
};

export const createLiability = async (req, res) => {
  try {
    console.log(`🔹 Forwarding POST request: ${req.originalUrl}`);
    console.log("📩 Payload:", req.body);

    const response = await axios.post(
      `${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
      req.body,
      { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization } }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in createLiability:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to create liability" });
  }
};

export const updateLiability = async (req, res) => {
  try {
    console.log(`🔹 Forwarding PATCH request: ${req.originalUrl}`);
    console.log("📩 Payload:", req.body);

    const response = await axios.patch(
      `${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
      req.body,
      { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in updateLiability:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to update liability" });
  }
};

export const deleteLiability = async (req, res) => {
  try {
    console.log(`🔹 Forwarding DELETE request: ${req.originalUrl}`);

    const response = await axios.delete(`${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in deleteLiability:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to delete liability" });
  }
};
