import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/config.js";

export const signupUser = async (req, res) => {
  try {
    console.log(`🔹 Forwarding POST request: ${req.originalUrl}`);
    console.log("📩 Payload:", req.body);

    const response = await axios.post(
      `${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in signupUser:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to create user" });
  }
};

export const signinUser = async (req, res) => {
  try {
    console.log(`🔹 Forwarding POST request: ${req.originalUrl}`);
    console.log("📩 Payload:", req.body);

    const response = await axios.post(
      `${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in signinUser:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to login user" });
  }
};


