import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
  {
    counter: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

wishlistSchema.pre("save", function (next) {
  this.counter = this.products.length;
  next();
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
