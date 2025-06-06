import cart from "../../../DB/model/cartShopping.model.js";
import Product from "../../../DB/model/product.model.js";
import jwt from "jsonwebtoken";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let Cart = await cart.findOne({ userId: req.user._id, status: "active" });

    if (!Cart) {
      Cart = await cart.create({
        userId: req.user._id,

        products: [],
        totalPrice: 0,
        status: "active",
      });
    }

    const existingProductIndex = Cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      Cart.products[existingProductIndex].quantity += 1;
    } else {
      Cart.products.push({
        productId: product._id,
        quantity: 1,
        price: product.price,
      });
    }

    Cart.totalPrice = Cart.products.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    await Cart.save();

    await Cart.populate({
      path: "products.productId",
      select:
        "name shortdescription longdescription price category subCategory stock imageCover images ratingAvg createdAt updatedAt",
    });

    res.status(200).json(  Cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cartItems = await cart
      .findOne({ userId: req.user._id, status: "active" })
      .populate("products.productId");
    if (!cartItems) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const deleteCart = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const Cart = await cart.findOne({ userId: req.user._id, status: "active" });

//     if (!Cart) return res.status(404).json({ message: "Cart not found" });

//     Cart.products = Cart.products.filter(
//       (p) => p.productId.toString() !== productId
//     );

//     await Cart.save();
//     await Cart.populate({
//       path: "products.productId",
//       select:
//         "name shortdescription longdescription price category subCategory stock imageCover images ratingAvg createdAt updatedAt",
//     });
//     res.json(Cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const deleteCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const Cart = await cart.findOne({ userId: req.user._id, status: "active" });

    if (!Cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productExists = Cart.products.some(
      (p) => p.productId.toString() === productId
    );

    if (!productExists) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    Cart.products = Cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    // تحديث السعر بعد الحذف
    Cart.totalPrice = Cart.products.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    await Cart.save();

    await Cart.populate({
      path: "products.productId",
      select:
        "name shortdescription longdescription price category subCategory stock imageCover images ratingAvg createdAt updatedAt",
    });

    res.json(Cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const Cart = await cart.findOne({ userId: req.user._id, status: "active" });

    if (!Cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productInCart = Cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!productInCart) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      Cart.products = Cart.products.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      productInCart.quantity = quantity;
    }

    Cart.totalPrice = Cart.products.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    await Cart.save();

    await Cart.populate({
      path: "products.productId",
      select:
        "name shortdescription longdescription price category subCategory stock imageCover images ratingAvg createdAt updatedAt",
    });

    res.status(200).json(Cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const Cart = await cart.findOne({ userId: req.user._id, status: "active" });

    if (!Cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    Cart.products = [];
    Cart.totalPrice = 0;

    await Cart.save();

    res.status(200).json(Cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};