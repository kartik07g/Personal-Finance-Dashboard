import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/config.js";

export const generateDashboardReport = async (req, res) => {
  try {
    console.log(`🔹 Forwarding post request: ${req.originalUrl}`);

    // List of report types
    const reportTypes = [
      "INCOME_VS_EXPENSES_REPORT",
      "EXPENSES_BREAKDOWN_BY_CATEGORY_REPORT",
      "NETWORTH_REPORT",
      "TOTAL_INCOME_EXPENSE_NETWORTH_REPORT"
    ];

    // Function to fetch report data
    const fetchReport = async (reportType) => {
      const requestBody = { ...req.body, report_type: reportType }; // Modify the request body for each call
      const response = await axios.post(
        `${BACKEND_BASE_URL}${req.originalUrl.replace(/^\/proxy/, "")}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
          },
        }
      );
      return response.data; // Store response under respective key
    };

    // Execute all API calls in parallel
    const reportResponses = await Promise.all(reportTypes.map(fetchReport));

    // Merge responses into a single dictionary
    const combinedReports = Object.assign({}, ...reportResponses);

    res.status(200).json(combinedReports);
  } catch (error) {
    console.error("❌ Error in generateReport:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to generate report" });
  }
};
