import cart from "../../../DB/model/cartShopping.model.js";
import product from "../../../DB/model/product.model.js";
import jwt from "jsonwebtoken";

// export const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }
//     const userId = req.user._id;

//     if (!productId || !quantity) {
//       return res
//         .status(400)
//         .json({ message: "Product ID and quantity are required" });
//     }

//     const productToAdd = await product.findById(productId);
//     if (!productToAdd) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const cartItem = {
//       productId,
//       quantity,
//       price: productToAdd.price,
//       };

//     const existingCart = await cart.findOne({ userId });

//     if (existingCart) {
//       existingCart.products.push(cartItem);
//       await existingCart.save();
//     } else {
//       const newCart = new cart({ userId, products: [cartItem] });
//       await newCart.save();
//     }

//     res.status(200).json({ message: "Product added to cart successfully" });
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    const productToAdd = await product.findById(productId);
    if (!productToAdd) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItem = {
      productId,
      quantity,
      price: productToAdd.price,
    };

    let userCart = await cart.findOne({ userId, status: "active" });

    if (!userCart) {
      userCart = new cart({
        userId,
        products: [cartItem],
      });
    } else {
      const existingProduct = userCart.products.find((p) =>
        p.productId.equals(productId)
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        userCart.products.push(cartItem);
      }
    }

    await userCart.save();
    res
      .status(200)
      .json({ message: "Product added to cart successfully", cart: userCart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Extract userId from the decoded token
    const userId = decoded._id;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    const cartItems = await cart
      .findOne({ userId })
      .populate("products.productId");
    if (!cartItems) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const Cart = await cart.findOne({ userId: req.user._id, status: "active" });

    if (!Cart) return res.status(404).json({ message: "Cart not found" });

    const item = Cart.products.find(
      (p) => p.productId.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await Cart.save();

    res.json({ message: "Cart updated", Cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const Cart = await cart.findOne({ userId: req.user._id, status: "active" });

    if (!Cart) return res.status(404).json({ message: "Cart not found" });

    Cart.products = Cart.products.filter(
      (p) => p.productId.toString() !== productId
    );
    await Cart.save();

    res.json({ message: "Product removed from cart", Cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
