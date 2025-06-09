import axios from 'axios';
import loanModel from '../../../DB/model/loan.model.js';
export const checkLoan = async (req, res) => {
  try {
    const loanData = req.body;

    // Send data to Python server
    const response = await axios.post('http://127.0.0.1:5000/predict', loanData);

    const prediction = response.data.prediction;

    // Save to DB
    const application = new loanModel({
      ...loanData,
      userId: req.user._id,
      prediction
    });

    await application.save();

    res.status(201).json({
      message: 'Loan application submitted successfully',
      prediction,
      application
    });
  } catch (error) {
    console.error('Error submitting loan application:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};