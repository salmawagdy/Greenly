import express from 'express';
import { authentication } from '../../middleware/auth.middleware.js';
import { getLoanPrediction } from './services/loan.service.js';
import loanModel from '../../DB/model/loan.model.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/predict', authentication(), async (req, res) => {
  try {
    const userId = req.user._id;
    const formData = req.body.data;

    if (!formData || typeof formData !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid form data' });
    }

    // Check if user already applied this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const existingRequest = await loanModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: startOfMonth, $lt: endOfMonth }
    });

    if (existingRequest) {
      return res.status(409).json({ message: 'You can only apply once per month' });
    }

    // Predict loan status
    const status = await getLoanPrediction(formData);

    // Save the application
    const newLoan = await loanModel.create({
      userId,
      inputData: formData,
      loanStatus: status
    });

    return res.status(201).json({
      message: 'Loan prediction completed',
      loanId: newLoan._id,
      userId,
      loan_status: status
    });

  } catch (error) {
    console.error('Prediction error:', error.stack || error);
    return res.status(500).json({ error: error.message || 'Failed to get prediction' });
  }
});

router.get('/status/:id', authentication(), async (req, res) => {
  try {
    const userId = req.user._id; // Getting the authenticated user's ID
    const {loanId} = req.params

    const loan = await loanModel.findOne({  loanId, userId });

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found or access denied' });
    }

    res.json({
      loanId: loan._id,
      userId: loan.userId,
      inputData: loan.inputData,
      loanStatus: loan.loanStatus,
      createdAt: loan.createdAt
    });
  } catch (error) {
    console.error('Get loan error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve loan' });
  }
});

export default router;