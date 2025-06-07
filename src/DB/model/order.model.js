import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
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

// import mongoose, { Schema } from "mongoose";
// const orderSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
//   products: [
//     {
//       productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//       quantity: Number,
//       price: Number,
//     },
//   ],
//   amount: Number,
//   status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
//   stripePaymentIntentId: String,
// }, { timestamps: true });

// export default mongoose.model('order', orderSchema);
