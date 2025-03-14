import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/config.js";

export const generateReport = async (req, res) => {
  try {
    console.log(`🔹 Forwarding post request: ${req.originalUrl}`);
    const response = await axios.post(`${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
    req.body,
    { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization, } });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error in generateReport:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to generate report" });
  }
};


// export const createTransaction = async (req, res) => {
//   try {
//     console.log(`🔹 Forwarding POST request: ${req.originalUrl}`);
//     console.log("📩 Payload:", req.body);
    
//     const response = await axios.post(
//       `${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
//       req.body,
//       { headers: { "Content-Type": "application/json", Authorization: req.headers.authorization,  } });

//     res.status(response.status).json(response.data);
//   } catch (error) {
//     console.error("❌ Error in createTransaction:", error.message);
//     res.status(error.response?.status || 500).json({ error: "Failed to create transaction" });
//   }
// };
