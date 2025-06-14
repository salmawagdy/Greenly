import express from "express";
import { authentication , authorization} from "../../middleware/auth.middleware.js";
import { getLoanPrediction } from "./services/loan.service.js";
import loanModel from "../../DB/model/loan.model.js";
import mongoose from "mongoose";
import { endpoint } from "./loan.authorization.js";

const router = express.Router();

router.post("/predict", authentication(), async (req, res) => {
  try {
    const userId = req.user._id;
    const formData = req.body.data;

    if (!formData || typeof formData !== "object") {
      return res.status(400).json({ error: "Missing or invalid form data" });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const existingRequest = await loanModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "You can only apply once per month" });
    }
    const status = await getLoanPrediction(formData);
    const newLoan = await loanModel.create({
      userId,
      inputData: formData,
      loanStatus: status,
    });

    return res.status(201).json({
      message: "Loan prediction completed",
      loanId: newLoan._id,
      userId,
      loan_status: status,
    });
  } catch (error) {
    console.error("Prediction error:", error.stack || error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to get prediction" });
  }
});

router.get("/status/:id", authentication(), async (req, res) => {
  try {
    const userId = req.user._id; 
    const { loanId } = req.params;

    const loan = await loanModel.findOne({ loanId, userId });

    if (!loan) {
      return res
        .status(404)
        .json({ message: "Loan not found or access denied" });
    }

    res.json({
      loanId: loan._id,
      userId: loan.userId,
      inputData: loan.inputData,
      loanStatus: loan.loanStatus,
      createdAt: loan.createdAt,
    });
  } catch (error) {
    console.error("Get loan error:", error.message);
    res.status(500).json({ error: "Failed to retrieve loan" });
  }
});

export default router;
router.get("/allLoans", authentication(),authorization(endpoint.getAll), async (req, res) => {
  try {
    const loans = await loanModel.find()
      .populate("userId", "userName email") 
      .sort({ createdAt: -1 });

    res.status(200).json(
      loans,
    );
  } catch (error) {
    console.error("Error fetching loans:", error.message);
    res.status(500).json({ error: "Failed to fetch loans" });
  }
});
