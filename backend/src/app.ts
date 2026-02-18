import express from "express";
import cors from "cors";
import stockRoutes from "./routes/stock.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", stockRoutes);

export default app;
