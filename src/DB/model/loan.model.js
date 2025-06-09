import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  Gender: String,
  Married: String,
  Dependents: String,
  Education: String,
  Self_Employed: String,
  ApplicantIncome: Number,
  CoApplicantIncome: Number,
  LoanAmount: Number,
  Loan_Amount_Term: Number,
  Credit_History: Number,
  Property_Area: String,
  prediction: String // 'Approved' or 'Rejected'
}, { timestamps: true });

export default mongoose.model('LoanApplication', loanApplicationSchema);