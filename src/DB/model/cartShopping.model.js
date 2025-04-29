import mongoose from "mongoose";
import { Schema } from "mongoose";
const cartSchema = new Schema(
  {
    counter: { type: Number, default: 0 },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["active", "ordered"], default: "active" },
    counter: { type: Number, default: 0 }, // <-- new field
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.totalPrice = this.products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  this.counter = this.products.length;
  next();
});

const cart = mongoose.model("Cart", cartSchema);

export default cart;
