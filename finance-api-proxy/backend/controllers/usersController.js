import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/config.js";

export const getUsers = async (req, res) => {
  try {
    console.log(`🔹 Forwarding GET request: ${req.originalUrl}`);
    const response = await axios.get(`${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in getUsers:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to fetch users" });
  }
};


export const updateUser = async (req, res) => {
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
    console.error("❌ Error in updateUser:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log(`🔹 Forwarding DELETE request: ${req.originalUrl}`);

    const response = await axios.delete(`${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in deleteUser:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to delete user" });
  }
};
