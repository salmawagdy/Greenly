import express from "express";
import { getDashboardStats } from "../dashBoard/services/dashboard.service.js";

const router = express.Router();

router.get("/status", getDashboardStats);

export default router;
