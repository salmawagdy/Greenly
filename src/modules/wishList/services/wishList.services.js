import Wishlist from "../../../DB/model/wishList.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, products: [] });
    }

    const productExists = wishlist.products.find(
      (p) => p.productId.toString() === productId
    );

    if (productExists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.products.push({ productId });
    await wishlist.save();

    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
  
    res.status(200).json({ message: "Wishlist retrieved successfully", wishlist});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    } 

    wishlist.products = wishlist.products.filter(
      (p) => p.productId.toString() !== productId
    );
    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};