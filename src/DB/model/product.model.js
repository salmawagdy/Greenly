//collection(table)=schema +model
import mongoose from "mongoose";
import { model, Schema } from "mongoose";
const productSchema = new Schema(
  {
    //productid: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, trim: true },
    shortdescription: { type: String, min: 0, max: 200 },
    longdescription: { type: String, min: 0, max: 1000 },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "subcategory",
      required: true,
    },
    stock: { type: Number, default: 0, min: 0 },
    imageCover: { type: String },
    images: [{ type: String }],
    ratingAvg: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || model("Product", productSchema);

export default Product;
