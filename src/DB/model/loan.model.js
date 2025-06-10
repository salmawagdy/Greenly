import mongoose, { Schema, Types, model } from 'mongoose';

const loanSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  inputData: { type: Object, required: true },  
  loanStatus: { type: String, required: true },
}, { timestamps: true });

const loanModel = mongoose.models.loan || model('loan', loanSchema);

export default loanModel;
