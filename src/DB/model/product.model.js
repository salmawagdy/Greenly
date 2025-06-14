import mongoose from "mongoose";
import { model, Schema } from "mongoose";
const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    shortdescription: { type: String, min: 0, max: 200 },

    longdescription: { type: String, min: 0, max: 1000 },

    price: { type: Number, required: true, min: 0 },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    stock: { type: Number, default: 0, min: 0 },

    imageCover: { type: String },

    images: [{ type: String }],

    ratingAvg: { type: Number, default: 0 },

    vendor: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || model("Product", productSchema);

export default Product;
