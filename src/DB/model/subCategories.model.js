import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    categoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const subCategory =
  mongoose.models.subcategory || model("subcategory", subCategorySchema);

export default subCategory;
