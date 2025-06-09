import express from 'express';
import { authentication } from '../../middleware/auth.middleware.js';
import { getLoanPrediction } from './services/loan.service.js';
import loanModel from '../../DB/model/loan.model.js';
const router = express.Router();

router.post('/predict', authentication(), async (req, res) => {
  try {
    const userId = req.user._id;

    // Expecting: { data: { Gender: "...", Married: "...", ... } }
    const formData = req.body.data;


    console.log('User ID:', userId);
    console.log('Form Data:', formData);

    if (!formData) {
      return res.status(400).json({ error: 'Missing form data' });
    }

    const status = await getLoanPrediction(formData);
     console.log('Prediction status:', status);

    await loanModel.create({
      userId,
      inputData: formData,
      loanStatus: status
    });

    res.json({
      userId,
      loan_status: status
    });
  } catch (error) {
  console.error('Prediction error:', error.stack || error);
  res.status(500).json({ error: error.message || 'Failed to get prediction' });
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