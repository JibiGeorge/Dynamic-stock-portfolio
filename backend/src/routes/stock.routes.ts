import { Router } from "express";
import { getStockData } from "../controllers/stock.controller";

const router = Router();

router.post("/stock-data", getStockData);

export default router;
