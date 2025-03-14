import express from "express";
import cors from "cors";
import proxyRoutes from "./backend/routes/proxyRoutes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: "GET,POST,PATCH,DELETE",
    credentials: true
  }));
app.use(express.json()); // ✅ Ensures JSON body is parsed

app.use("/proxy", proxyRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API Proxy running on port ${PORT}`));
