
import mongoose from "mongoose";
import { model, Schema } from "mongoose";
const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true 
    },

    shortdescription: { type: String, min: 0, max: 200 
    },

    longdescription: { type: String, min: 0, max: 1000 
    },

    price: { type: Number, required: true, min: 0 
    },

    category: {
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String }
},
subCategory: {
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  name: { type: String }
},
    stock: { type: Number, default: 0, min: 0 },

    imageCover: { type: String },

    images: [{ type: String }],

    ratingAvg: { type: Number, default: 0 },
    
    vendor:{type:String, required:true},
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || model("Product", productSchema);

export default Product;
