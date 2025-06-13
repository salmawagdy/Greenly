import mongoose from "mongoose";
import { Schema } from "mongoose";
const addressSchema = new Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  street: { type: String, required: true },
  building: { type: String, required: true },
  floor: { type: String, required: true },
  apartment: { type: String, required: true },
  postalcode: { type: String, required: true },
  phone: { type: String, required: true },
  TYPE: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userAddressesSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

export default mongoose.models.UserAddress ||
  mongoose.model("UserAddress", userAddressesSchema);

// const addressSchema = new Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         address1: { type: String, required: true },
//         address2: { type: String, required: true },
//         city: { type: String, required: true },
//         state: { type: String, required: true },
//         country: { type: String, required: true },
//         pincode: { type: String, required: true },
//     },
//     { timestamps: true }
// );
//const address = mongoose.models.address || mongoose.model("address", addressSchema);
