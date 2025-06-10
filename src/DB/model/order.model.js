import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending",
  },
  paymentIntentId: {
    type: String, // This will be returned by Stripe
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("order", orderSchema);

