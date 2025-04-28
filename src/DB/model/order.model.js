import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    }
  ],
  amount: { type: Number, required: true }, // total price in cents
  currency: { type: String, default: "usd" },
  status: { type: String, default: "pending" }, // pending / paid / cancelled
  paymentIntentId: { type: String }, // stripe paymentIntent ID
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
