import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/config.js";

export const getAssets = async (req, res) => {
  try {
    console.log(`🔹 Forwarding GET request: ${req.originalUrl}`);
    const response = await axios.get(`${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in getAssets:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to fetch assets" });
  }
};

export const createAsset = async (req, res) => {
  try {
    console.log(`🔹 Forwarding POST request: ${req.originalUrl}`);
    console.log("📩 Payload:", req.body);

    const response = await axios.post(
      `${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
      req.body,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in createAsset:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to create asset" });
  }
};

export const updateAsset = async (req, res) => {
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
    console.error("❌ Error in updateAsset:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to update asset" });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    console.log(`🔹 Forwarding DELETE request: ${req.originalUrl}`);

    const response = await axios.delete(`${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in deleteAsset:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to delete asset" });
  }
};
