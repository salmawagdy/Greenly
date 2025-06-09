import mongoose, { Schema, Types, model } from 'mongoose';

const loanSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'user', required: true },
  inputData: { type: Object, required: true },  // stores the raw form input JSON
  loanStatus: { type: String, required: true }, // "Approved" or "Rejected"
}, { timestamps: true });

const loanModel = mongoose.models.loan || model('loan', loanSchema);

export default loanModel;
