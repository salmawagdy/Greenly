import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number,
    },
  ],
  amount: Number,
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  stripePaymentIntentId: String,
}, { timestamps: true });

export default mongoose.model('order', orderSchema);
