import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/config.js";

export const getAssetsAndLiability = async (req, res) => {
  try {
    console.log(`🔹 Forwarding GET request: ${req.originalUrl}`);
    const response = await axios.get(`${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in getAssetsAndLiability:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to fetch assets and liabilities" });
  }
};

export const createAssetAndLiability = async (req, res) => {
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
    console.error("❌ Error in createAssetAndLiability:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to create asset and liabilities" });
  }
};

export const updateAssetAndLiability = async (req, res) => {
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
    console.error("❌ Error in updateAssetAndLiability:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to update asset and liabilities" });
  }
};

export const deleteAssetAndLiability = async (req, res) => {
  try {
    console.log(`🔹 Forwarding DELETE request: ${req.originalUrl}`);

    const response = await axios.delete(`${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in deleteAssetAndLiability:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to delete asset  and liabilities" });
  }
};
